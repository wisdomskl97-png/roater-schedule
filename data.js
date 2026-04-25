// 찬양팀 로스터 - 시드 데이터 + 자동생성 로직

const INSTRUMENTS = [
  { id: 'mainKey',   label: '메인건반',   short: '메인',   en: 'Main Keys',    hue: 280 },
  { id: 'secondKey', label: '세컨건반',   short: '세컨',   en: 'Second Keys',  hue: 200 },
  { id: 'bass',      label: '베이스',     short: '베이스', en: 'Bass',         hue: 30  },
  { id: 'guitar',    label: '일렉기타',   short: '일렉',   en: 'E. Guitar',    hue: 350 },
  { id: 'acoustic',  label: '어쿠스틱기타', short: '어쿠',   en: 'A. Guitar',    hue: 50  },
  { id: 'drum',      label: '드럼',       short: '드럼',   en: 'Drums',        hue: 140 },
  { id: 'cajon',     label: '카혼',       short: '카혼',   en: 'Cajón',        hue: 20  },
  { id: 'violin',    label: '바이올린',   short: '바이올린', en: 'Violin',       hue: 320 },
];

// 8~12명 가상 멤버 (한국 이름)
const SEED_MEMBERS = [
  { id: 'm1',  name: '김민수', instruments: ['mainKey', 'secondKey'],     defaultService: 'both',     active: true,  note: '' },
  { id: 'm2',  name: '박서연', instruments: ['secondKey', 'guitar'],      defaultService: 'both',     active: true,  note: '' },
  { id: 'm3',  name: '이지훈', instruments: ['drum', 'cajon'],            defaultService: 'second',   active: true,  note: '3부만' },
  { id: 'm4',  name: '최민재', instruments: ['guitar', 'bass'],           defaultService: 'both',     active: true,  note: '' },
  { id: 'm5',  name: '정하은', instruments: ['mainKey', 'violin'],        defaultService: 'first',    active: true,  note: '2부 고정' },
  { id: 'm6',  name: '이준호', instruments: ['bass', 'guitar'],           defaultService: 'both',     active: true,  note: '' },
  { id: 'm7',  name: '한지원', instruments: ['secondKey', 'mainKey'],     defaultService: 'both',     active: true,  note: '' },
  { id: 'm8',  name: '김도현', instruments: ['drum', 'cajon'],            defaultService: 'both',     active: true,  note: '' },
  { id: 'm9',  name: '윤소정', instruments: ['acoustic', 'guitar'],       defaultService: 'second',   active: true,  note: '' },
  { id: 'm10', name: '강태윤', instruments: ['drum'],                     defaultService: 'both',     active: true,  note: '' },
  { id: 'm11', name: '서지안', instruments: ['mainKey', 'acoustic'],      defaultService: 'first',    active: true,  note: '' },
  { id: 'm12', name: '오민혁', instruments: ['bass', 'cajon'],            defaultService: 'both',     active: false, note: '교환학생 휴식' },
  { id: 'm13', name: '김예슬', instruments: ['violin'],                   defaultService: 'both',     active: true,  note: '' },
  { id: 'm14', name: '박찬우', instruments: ['acoustic', 'cajon'],        defaultService: 'both',     active: true,  note: '' },
];

// 인도자 후보
const LEADERS = ['박인도', '최인도', '정인도', '강인도'];

// 이번 주 정보 (2026-05-03)
const SEED_WEEK = {
  date: '2026-05-03',
  firstLeader: '박인도',
  secondLeader: '박인도',
  // availability: { memberId: { first: bool, second: bool, note: string } }
  availability: {
    m3: { first: false, second: true,  note: '오전 일정' },
    m5: { first: true,  second: false, note: '' },
    m9: { first: false, second: true,  note: '' },
  },
};

// ─────────────────────────────────────────────────────────
// 멤버가 해당 예배에 가능한지
function canAttend(member, week, service /* 'first'|'second' */) {
  if (!member.active) return false;
  const ex = week.availability?.[member.id];
  if (ex && typeof ex[service] === 'boolean') return ex[service];
  // 기본값
  if (member.defaultService === 'both') return true;
  return member.defaultService === service;
}

// ─────────────────────────────────────────────────────────
// 자동 생성: 한 예배(2부 또는 3부)의 로스터 만들기
// preferred: { instrumentId: memberId } 우선 배치 (인도자 같음)
// avoid: Set<memberId>             가능하면 피하기 (인도자 다름)
function buildServiceRoster(members, week, service, preferred = {}, recentCounts = {}, avoid = null) {
  const result = {};
  const used = new Set();

  // 1) preferred 먼저
  for (const inst of INSTRUMENTS) {
    const wantId = preferred[inst.id];
    if (!wantId) continue;
    const m = members.find(x => x.id === wantId);
    if (!m) continue;
    if (!canAttend(m, week, service)) continue;
    if (!m.instruments.includes(inst.id)) continue;
    if (used.has(m.id)) continue;
    result[inst.id] = m.id;
    used.add(m.id);
  }

  // 2) 비어있는 자리 채우기
  for (const inst of INSTRUMENTS) {
    if (result[inst.id]) continue;
    const all = members
      .filter(m => canAttend(m, week, service))
      .filter(m => m.instruments.includes(inst.id))
      .filter(m => !used.has(m.id));

    // avoid 안 겹치는 후보 우선; 없으면 fallback
    const fresh = avoid ? all.filter(m => !avoid.has(m.id)) : all;
    const pool = fresh.length > 0 ? fresh : all;

    pool.sort((a, b) => {
      const ra = recentCounts[a.id] || 0;
      const rb = recentCounts[b.id] || 0;
      if (ra !== rb) return ra - rb;
      return a.instruments.length - b.instruments.length;
    });

    if (pool.length > 0) {
      result[inst.id] = pool[0].id;
      used.add(pool[0].id);
    } else {
      result[inst.id] = null;
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────
// 전체 자동 생성
function autoBuildRoster(members, week, recentCounts = {}) {
  const sameLeader = week.firstLeader && week.firstLeader === week.secondLeader;

  // 2부 먼저
  const first = buildServiceRoster(members, week, 'first', {}, recentCounts);

  // 인도자 같음 → first와 최대한 같게 (preferred로 first 그대로 시도)
  // 인도자 다름 → first에 배정된 사람 최대한 피하기 (avoid 세트)
  const second = sameLeader
    ? buildServiceRoster(members, week, 'second', first, recentCounts)
    : buildServiceRoster(members, week, 'second', {}, recentCounts, new Set(Object.values(first).filter(Boolean)));

  return { first, second };
}

// ─────────────────────────────────────────────────────────
// 경고 검사
function checkWarnings(roster, members, week) {
  const warnings = []; // { service, instrument, memberId, type, msg }
  for (const service of ['first', 'second']) {
    const r = roster[service];
    const seen = {};
    for (const inst of INSTRUMENTS) {
      const mid = r[inst.id];
      if (!mid) {
        warnings.push({ service, instrument: inst.id, type: 'empty', msg: `${service==='first'?'2부':'3부'} ${inst.label} 미배정` });
        continue;
      }
      const m = members.find(x => x.id === mid);
      if (!m) continue;
      if (!m.active) {
        warnings.push({ service, instrument: inst.id, memberId: mid, type: 'inactive', msg: `${m.name}은 비활성 멤버` });
      }
      if (!m.instruments.includes(inst.id)) {
        warnings.push({ service, instrument: inst.id, memberId: mid, type: 'wrongInstrument', msg: `${m.name}은 ${inst.label} 가능 악기가 아님` });
      }
      if (!canAttend(m, week, service)) {
        warnings.push({ service, instrument: inst.id, memberId: mid, type: 'unavailable', msg: `${m.name}은 ${service==='first'?'2부':'3부'} 불가능` });
      }
      if (seen[mid]) {
        warnings.push({ service, instrument: inst.id, memberId: mid, type: 'duplicate', msg: `${m.name} 중복 배정` });
      }
      seen[mid] = true;
    }
  }
  return warnings;
}

Object.assign(window, {
  INSTRUMENTS, SEED_MEMBERS, SEED_WEEK, LEADERS,
  canAttend, buildServiceRoster, autoBuildRoster, checkWarnings,
});

// touch 1777114825215