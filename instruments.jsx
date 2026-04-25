// 아이소메트릭 악기 일러스트 (SVG)
// 단순화된 아이소메트릭 스타일 - 30도 각도, 부드러운 그림자, 단색 면
// 각 컴포넌트는 size prop을 받음

function IsoMainKey({ size = 80, palette }) {
  const c = palette || { top: '#E8D5FF', front: '#A78BFA', side: '#7C3AED', shadow: '#5B21B6', dark: '#1F1532', accent: '#FCD34D' };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      {/* shadow */}
      <ellipse cx="50" cy="86" rx="32" ry="5" fill="rgba(0,0,0,0.18)" />
      {/* keyboard body — 아이소메트릭 박스 */}
      {/* 옆면 (오른쪽) */}
      <polygon points="78,42 78,58 90,52 90,36" fill={c.side} />
      {/* 앞면 */}
      <polygon points="14,52 78,58 78,42 14,36" fill={c.front} />
      {/* 윗면 */}
      <polygon points="14,36 78,42 90,36 26,30" fill={c.top} />
      {/* 흰건반 라인 (윗면) */}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <line key={i}
          x1={20 + i*6} y1={32 + i*0.6}
          x2={32 + i*6} y2={26 + i*0.6}
          stroke={c.dark} strokeOpacity="0.15" strokeWidth="0.5" />
      ))}
      {/* 검은건반 (윗면) */}
      {[1,2,4,5,6].map((g, i) => (
        <polygon key={i}
          points={`${22 + g*6},${30.5 + g*0.6} ${28 + g*6},${27.5 + g*0.6} ${30 + g*6},${28.5 + g*0.6} ${24 + g*6},${31.5 + g*0.6}`}
          fill={c.dark} />
      ))}
      {[8,9].map((g, i) => (
        <polygon key={`b${i}`}
          points={`${22 + g*6},${30.5 + g*0.6} ${28 + g*6},${27.5 + g*0.6} ${30 + g*6},${28.5 + g*0.6} ${24 + g*6},${31.5 + g*0.6}`}
          fill={c.dark} />
      ))}
      {/* 디스플레이 점 */}
      <circle cx="22" cy="38" r="1.2" fill={c.accent} />
      <circle cx="26" cy="38.5" r="1.2" fill={c.accent} opacity="0.5" />
    </svg>
  );
}

function IsoSecondKey({ size = 80, palette }) {
  const c = palette || { top: '#CCEBFF', front: '#60A5FA', side: '#2563EB', shadow: '#1E3A8A', dark: '#0F172A', accent: '#F472B6' };
  // 더 작고 짧은 키보드
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="84" rx="28" ry="4.5" fill="rgba(0,0,0,0.18)" />
      <polygon points="72,46 72,60 84,54 84,40" fill={c.side} />
      <polygon points="20,55 72,60 72,46 20,41" fill={c.front} />
      <polygon points="20,41 72,46 84,40 32,35" fill={c.top} />
      {/* 검은 건반 군데군데 */}
      {[1,3,5,7].map(i => (
        <polygon key={i}
          points={`${26 + i*5.5},${36 + i*0.5} ${30 + i*5.5},${33.5 + i*0.5} ${32 + i*5.5},${34.5 + i*0.5} ${28 + i*5.5},${37 + i*0.5}`}
          fill={c.dark} />
      ))}
      {/* 화이트 라인 */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`w${i}`}
          x1={26 + i*5.5} y1={36.5 + i*0.5}
          x2={36 + i*5.5} y2={32 + i*0.5}
          stroke={c.dark} strokeOpacity="0.12" strokeWidth="0.4" />
      ))}
      {/* 모듈러 휠 */}
      <rect x="20" y="44" width="6" height="10" fill={c.shadow} rx="1"/>
    </svg>
  );
}

function IsoBass({ size = 80, palette }) {
  const c = palette || { body: '#FB923C', side: '#C2410C', neck: '#FDE68A', dark: '#451A03', shadow: '#7C2D12', string: '#FAFAF9' };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="86" rx="34" ry="5" fill="rgba(0,0,0,0.2)" />
      {/* 넥 */}
      <polygon points="14,28 22,22 78,55 70,61" fill={c.neck} />
      <polygon points="78,55 82,52 76,72 70,61" fill={c.side} />
      {/* 헤드스톡 */}
      <polygon points="10,30 18,24 22,22 14,28" fill={c.dark} />
      <circle cx="13" cy="27" r="1" fill={c.shadow} />
      <circle cx="16" cy="25" r="1" fill={c.shadow} />
      <circle cx="19" cy="23" r="1" fill={c.shadow} />
      {/* 바디 (둥근 형태 - polygon 근사) */}
      <polygon points="56,52 78,52 92,60 88,72 80,80 60,82 50,76 48,64 50,56" fill={c.body} />
      <polygon points="92,60 96,58 92,72 88,72" fill={c.side} />
      <polygon points="60,82 56,84 48,76 50,76" fill={c.shadow} opacity="0.6"/>
      {/* 픽업 */}
      <polygon points="62,62 72,66 70,72 60,68" fill={c.dark} />
      {/* 줄 */}
      {[0,1,2,3].map(i => (
        <line key={i} x1={20 - i*0.4} y1={26 + i*0.6} x2={70 - i*0.4} y2={59 + i*0.6} stroke={c.string} strokeWidth="0.4" opacity="0.7" />
      ))}
      {/* 컨트롤 노브 */}
      <circle cx="78" cy="74" r="2" fill={c.dark} />
      <circle cx="84" cy="71" r="2" fill={c.dark} />
    </svg>
  );
}

function IsoGuitar({ size = 80, palette }) {
  const c = palette || { body: '#F87171', side: '#991B1B', neck: '#92400E', dark: '#1C1917', pickguard: '#FAFAF9', accent: '#FBBF24' };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="86" rx="34" ry="5" fill="rgba(0,0,0,0.2)" />
      {/* 넥 */}
      <polygon points="12,32 20,26 76,52 68,58" fill={c.neck} />
      <polygon points="76,52 80,50 74,68 68,58" fill={c.dark} opacity="0.5"/>
      {/* 헤드 */}
      <polygon points="8,34 16,28 22,30 14,36" fill={c.dark} />
      {/* 일렉기타 바디 (스트랫 스타일) */}
      <polygon points="56,50 76,48 90,55 92,68 86,78 76,80 64,82 52,78 46,68 48,58" fill={c.body} />
      <polygon points="90,55 94,54 88,75 86,78 92,68" fill={c.side} />
      {/* 픽가드 */}
      <polygon points="62,58 78,58 82,68 76,76 64,74 60,68" fill={c.pickguard} />
      {/* 픽업 3개 */}
      <rect x="64" y="62" width="12" height="2.5" fill={c.dark} transform="rotate(8 70 63)" />
      <rect x="64" y="67" width="12" height="2.5" fill={c.dark} transform="rotate(8 70 68)" />
      <rect x="64" y="72" width="12" height="2.5" fill={c.dark} transform="rotate(8 70 73)" />
      {/* 노브 */}
      <circle cx="80" cy="72" r="1.5" fill={c.accent} />
      <circle cx="83" cy="68" r="1.5" fill={c.accent} />
    </svg>
  );
}

function IsoDrum({ size = 80, palette }) {
  const c = palette || { kick: '#34D399', skin: '#FEF3C7', side: '#047857', shell: '#065F46', cymbal: '#FCD34D', cymbalEdge: '#92400E', stand: '#1F2937' };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="88" rx="38" ry="5" fill="rgba(0,0,0,0.2)" />
      {/* 킥 드럼 (큰 원통) */}
      <ellipse cx="50" cy="74" rx="22" ry="7" fill={c.side} />
      <rect x="28" y="60" width="44" height="14" fill={c.kick} />
      <ellipse cx="50" cy="60" rx="22" ry="7" fill={c.skin} />
      <ellipse cx="50" cy="60" rx="22" ry="7" fill="none" stroke={c.shell} strokeWidth="1.5" />
      {/* 러그 */}
      {[0,1,2,3,4,5].map(i => {
        const angle = (i / 6) * Math.PI;
        const x = 50 + Math.cos(angle) * 22;
        const y = 60 + Math.sin(angle) * 7;
        return <circle key={i} cx={x} cy={y} r="0.8" fill={c.shell} />;
      })}
      {/* 탐 (위 작은 드럼) */}
      <ellipse cx="36" cy="48" rx="9" ry="3" fill={c.side} />
      <rect x="27" y="42" width="18" height="6" fill={c.kick} />
      <ellipse cx="36" cy="42" rx="9" ry="3" fill={c.skin} />
      <ellipse cx="36" cy="42" rx="9" ry="3" fill="none" stroke={c.shell} strokeWidth="1" />
      {/* 탐2 */}
      <ellipse cx="58" cy="46" rx="8" ry="2.5" fill={c.side} />
      <rect x="50" y="41" width="16" height="5" fill={c.kick} />
      <ellipse cx="58" cy="41" rx="8" ry="2.5" fill={c.skin} />
      <ellipse cx="58" cy="41" rx="8" ry="2.5" fill="none" stroke={c.shell} strokeWidth="1" />
      {/* 심벌 (왼쪽) */}
      <line x1="20" y1="60" x2="20" y2="34" stroke={c.stand} strokeWidth="1.5" />
      <ellipse cx="20" cy="32" rx="14" ry="3" fill={c.cymbal} />
      <ellipse cx="20" cy="32" rx="14" ry="3" fill="none" stroke={c.cymbalEdge} strokeWidth="0.5" />
      <circle cx="20" cy="32" r="1.5" fill={c.cymbalEdge} />
      {/* 심벌 (오른쪽 위) */}
      <line x1="78" y1="60" x2="78" y2="28" stroke={c.stand} strokeWidth="1.5" />
      <ellipse cx="78" cy="26" rx="12" ry="2.5" fill={c.cymbal} />
      <ellipse cx="78" cy="26" rx="12" ry="2.5" fill="none" stroke={c.cymbalEdge} strokeWidth="0.5" />
      <circle cx="78" cy="26" r="1.2" fill={c.cymbalEdge} />
    </svg>
  );
}

function IsoAcoustic({ size = 80, palette }) {
  const c = palette || { body: '#FCD34D', side: '#A16207', neck: '#92400E', dark: '#451A03', hole: '#1C1917', string: '#FAFAF9', accent: '#7C2D12' };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="86" rx="34" ry="5" fill="rgba(0,0,0,0.2)" />
      {/* 넥 */}
      <polygon points="14,30 22,24 70,52 62,58" fill={c.neck} />
      <polygon points="70,52 74,50 68,66 62,58" fill={c.dark} opacity="0.4"/>
      {/* 헤드스톡 */}
      <polygon points="9,32 17,26 22,28 14,34" fill={c.dark} />
      <circle cx="12" cy="29" r="0.7" fill={c.accent} />
      <circle cx="15" cy="27" r="0.7" fill={c.accent} />
      {/* 어쿠스틱 바디 (둥근 8자 모양 근사) */}
      <ellipse cx="74" cy="65" rx="20" ry="18" fill={c.body} />
      <ellipse cx="74" cy="65" rx="20" ry="18" fill="none" stroke={c.side} strokeWidth="1.2" />
      {/* 측면 그림자 */}
      <path d="M 90 58 Q 96 65 90 76 Q 86 78 86 75 Q 92 66 88 58 Z" fill={c.side} opacity="0.5"/>
      {/* 사운드홀 */}
      <circle cx="68" cy="62" r="5" fill={c.hole} />
      <circle cx="68" cy="62" r="5" fill="none" stroke={c.accent} strokeWidth="0.6" />
      <circle cx="68" cy="62" r="3.2" fill="none" stroke={c.accent} strokeWidth="0.4" />
      {/* 브릿지 */}
      <rect x="73" y="70" width="11" height="2" fill={c.dark} transform="rotate(8 78 71)" />
      {/* 줄 */}
      {[0,1,2,3,4,5].map(i => (
        <line key={i} x1={20 - i*0.3} y1={28 + i*0.5} x2={80 - i*0.3} y2={71 + i*0.5} stroke={c.string} strokeWidth="0.35" opacity="0.7" />
      ))}
    </svg>
  );
}

function IsoCajon({ size = 80, palette }) {
  const c = palette || { front: '#D97706', top: '#FCD34D', side: '#92400E', dark: '#451A03', hole: '#1C1917', accent: '#FBBF24' };
  // 아이소메트릭 박스 (카혼 = 나무 박스)
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="86" rx="30" ry="4.5" fill="rgba(0,0,0,0.22)" />
      {/* 윗면 */}
      <polygon points="22,40 50,32 82,40 54,48" fill={c.top} />
      {/* 앞면 (타파) */}
      <polygon points="22,40 54,48 54,82 22,74" fill={c.front} />
      {/* 옆면 */}
      <polygon points="54,48 82,40 82,74 54,82" fill={c.side} />
      {/* 나무 결 (앞면) */}
      {[0,1,2].map(i => (
        <line key={i} x1={26} y1={50 + i*8} x2={52} y2={56 + i*8} stroke={c.dark} strokeOpacity="0.18" strokeWidth="0.5" />
      ))}
      {/* 나무 결 (옆면) */}
      {[0,1,2].map(i => (
        <line key={`s${i}`} x1={58} y1={52 + i*8} x2={80} y2={48 + i*8} stroke={c.dark} strokeOpacity="0.15" strokeWidth="0.5" />
      ))}
      {/* 사운드홀 (옆면 가운데) */}
      <ellipse cx="68" cy="62" rx="3.5" ry="4" fill={c.hole} />
      {/* 모서리 강조 */}
      <line x1="22" y1="40" x2="22" y2="74" stroke={c.dark} strokeOpacity="0.3" strokeWidth="0.6" />
      <line x1="54" y1="48" x2="54" y2="82" stroke={c.dark} strokeOpacity="0.4" strokeWidth="0.7" />
      {/* 코너 나사 */}
      <circle cx="26" cy="44" r="0.8" fill={c.accent} />
      <circle cx="50" cy="44" r="0.8" fill={c.accent} />
      <circle cx="26" cy="71" r="0.8" fill={c.accent} />
      <circle cx="50" cy="78" r="0.8" fill={c.accent} />
    </svg>
  );
}

function IsoViolin({ size = 80, palette }) {
  const c = palette || { body: '#B45309', side: '#78350F', neck: '#1C1917', dark: '#0C0A09', string: '#FAFAF9', accent: '#FCD34D', f: '#1C1917' };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="86" rx="32" ry="4.5" fill="rgba(0,0,0,0.2)" />
      {/* 활(bow) — 뒤쪽에 */}
      <line x1="14" y1="26" x2="86" y2="74" stroke={c.dark} strokeWidth="1.2" />
      <path d="M 14 26 Q 50 52 86 74" stroke={c.string} strokeWidth="0.6" fill="none" opacity="0.7"/>
      {/* 넥 */}
      <polygon points="22,32 28,26 64,52 58,58" fill={c.neck} />
      {/* 스크롤(헤드) */}
      <path d="M 22 32 Q 16 28 18 24 Q 22 22 24 26 L 28 26 Z" fill={c.dark} />
      {/* 핑거보드 */}
      <polygon points="28,32 32,28 60,50 56,54" fill={c.dark} opacity="0.85"/>
      {/* 바이올린 바디 (둥근 8자) */}
      <ellipse cx="68" cy="62" rx="16" ry="18" fill={c.body} transform="rotate(-25 68 62)" />
      <ellipse cx="68" cy="62" rx="16" ry="18" fill="none" stroke={c.side} strokeWidth="1" transform="rotate(-25 68 62)" />
      {/* 허리 잘록 (waist) */}
      <ellipse cx="62" cy="56" rx="3" ry="5" fill={c.side} opacity="0.45" transform="rotate(-25 62 56)" />
      {/* f-홀 두 개 */}
      <path d="M 62 60 Q 60 64 62 68 Q 64 70 63 72" stroke={c.f} strokeWidth="1" fill="none" />
      <path d="M 72 64 Q 70 68 72 72 Q 74 74 73 76" stroke={c.f} strokeWidth="1" fill="none" />
      {/* 브릿지 */}
      <rect x="64" y="66" width="10" height="1.5" fill={c.accent} transform="rotate(-25 69 66)" />
      {/* 테일피스 */}
      <polygon points="70,72 76,76 72,80 68,76" fill={c.dark} />
      {/* 줄 (4개) */}
      {[0,1,2,3].map(i => (
        <line key={i} x1={26 + i*0.6} y1={28 + i*0.5} x2={70 + i*0.6} y2={70 + i*0.5} stroke={c.string} strokeWidth="0.3" opacity="0.8" />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 컬러 팔레트별 매핑
const ICON_PALETTES = {
  cute: {
    mainKey:   { top: '#FCE7F3', front: '#F9A8D4', side: '#DB2777', shadow: '#9D174D', dark: '#500724', accent: '#FCD34D' },
    secondKey: { top: '#DBEAFE', front: '#93C5FD', side: '#3B82F6', shadow: '#1E3A8A', dark: '#172554', accent: '#FBBF24' },
    bass:      { body: '#FED7AA', side: '#EA580C', neck: '#FEF3C7', dark: '#7C2D12', shadow: '#9A3412', string: '#FFFBEB' },
    guitar:    { body: '#FECACA', side: '#DC2626', neck: '#A16207', dark: '#450A0A', pickguard: '#FFFBEB', accent: '#FBBF24' },
    acoustic:  { body: '#FEF08A', side: '#A16207', neck: '#92400E', dark: '#451A03', hole: '#1C1917', string: '#FFFBEB', accent: '#7C2D12' },
    drum:      { kick: '#A7F3D0', skin: '#FEF3C7', side: '#059669', shell: '#064E3B', cymbal: '#FCD34D', cymbalEdge: '#92400E', stand: '#1F2937' },
    cajon:     { front: '#F59E0B', top: '#FCD34D', side: '#92400E', dark: '#451A03', hole: '#1C1917', accent: '#FBBF24' },
    violin:    { body: '#C2410C', side: '#7C2D12', neck: '#1C1917', dark: '#0C0A09', string: '#FFFBEB', accent: '#FCD34D', f: '#1C1917' },
  },
  bold: {
    mainKey:   { top: '#FAFAFA', front: '#000000', side: '#171717', shadow: '#0A0A0A', dark: '#FFFFFF', accent: '#FACC15' },
    secondKey: { top: '#FAFAFA', front: '#FACC15', side: '#A16207', shadow: '#713F12', dark: '#000000', accent: '#000000' },
    bass:      { body: '#FACC15', side: '#A16207', neck: '#1C1917', dark: '#000000', shadow: '#713F12', string: '#FFFFFF' },
    guitar:    { body: '#000000', side: '#171717', neck: '#A16207', dark: '#FACC15', pickguard: '#FAFAFA', accent: '#FACC15' },
    acoustic:  { body: '#FACC15', side: '#000000', neck: '#171717', dark: '#000000', hole: '#000000', string: '#FAFAFA', accent: '#000000' },
    drum:      { kick: '#FAFAFA', skin: '#FACC15', side: '#525252', shell: '#000000', cymbal: '#FACC15', cymbalEdge: '#000000', stand: '#000000' },
    cajon:     { front: '#000000', top: '#FACC15', side: '#171717', dark: '#000000', hole: '#FACC15', accent: '#FACC15' },
    violin:    { body: '#000000', side: '#171717', neck: '#000000', dark: '#FACC15', string: '#FAFAFA', accent: '#FACC15', f: '#FACC15' },
  },
  neon: {
    mainKey:   { top: '#F0ABFC', front: '#A855F7', side: '#6B21A8', shadow: '#3B0764', dark: '#0A0014', accent: '#22D3EE' },
    secondKey: { top: '#67E8F9', front: '#06B6D4', side: '#0E7490', shadow: '#164E63', dark: '#000814', accent: '#F0ABFC' },
    bass:      { body: '#F472B6', side: '#9D174D', neck: '#FCD34D', dark: '#1F0A1A', shadow: '#831843', string: '#22D3EE' },
    guitar:    { body: '#22D3EE', side: '#0E7490', neck: '#1E1B4B', dark: '#0A0014', pickguard: '#F0ABFC', accent: '#FACC15' },
    acoustic:  { body: '#FACC15', side: '#9D174D', neck: '#1E1B4B', dark: '#0A0014', hole: '#0A0014', string: '#22D3EE', accent: '#F0ABFC' },
    drum:      { kick: '#A3E635', skin: '#F0ABFC', side: '#365314', shell: '#0A0014', cymbal: '#FACC15', cymbalEdge: '#9D174D', stand: '#1F0A1A' },
    cajon:     { front: '#A855F7', top: '#FACC15', side: '#3B0764', dark: '#0A0014', hole: '#0A0014', accent: '#22D3EE' },
    violin:    { body: '#F472B6', side: '#831843', neck: '#0A0014', dark: '#000814', string: '#22D3EE', accent: '#FACC15', f: '#0A0014' },
  },
};

// 통합 아이콘 컴포넌트
function InstrumentIcon({ id, size = 64, paletteName = 'cute' }) {
  const pal = (ICON_PALETTES[paletteName] || ICON_PALETTES.cute)[id];
  switch (id) {
    case 'mainKey':   return <IsoMainKey   size={size} palette={pal} />;
    case 'secondKey': return <IsoSecondKey size={size} palette={pal} />;
    case 'bass':      return <IsoBass      size={size} palette={pal} />;
    case 'guitar':    return <IsoGuitar    size={size} palette={pal} />;
    case 'drum':      return <IsoDrum      size={size} palette={pal} />;
    case 'acoustic':  return <IsoAcoustic  size={size} palette={pal} />;
    case 'cajon':     return <IsoCajon     size={size} palette={pal} />;
    case 'violin':    return <IsoViolin    size={size} palette={pal} />;
    default: return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 추상 도형 버전 (palette toggle용)
function AbstractIcon({ id, size = 64, paletteName = 'cute' }) {
  const pal = (ICON_PALETTES[paletteName] || ICON_PALETTES.cute)[id];
  const main = pal.front || pal.body || pal.kick;
  const dark = pal.dark || pal.shadow;
  const accent = pal.accent || pal.cymbal;
  const shapes = {
    mainKey: <>
      <rect x="15" y="35" width="70" height="35" rx="4" fill={main} />
      <rect x="15" y="35" width="70" height="6" fill={dark} opacity="0.3" />
      {[20,30,40,50,60,70].map(x => <rect key={x} x={x} y="42" width="2" height="22" fill={dark} opacity="0.5" />)}
      <circle cx="78" cy="48" r="2" fill={accent} />
    </>,
    secondKey: <>
      <rect x="20" y="40" width="60" height="28" rx="4" fill={main} />
      <rect x="20" y="40" width="60" height="5" fill={dark} opacity="0.3" />
      {[26,34,42,50,58,66,74].map(x => <rect key={x} x={x} y="46" width="2" height="18" fill={dark} opacity="0.5" />)}
    </>,
    bass: <>
      <rect x="14" y="48" width="50" height="3" fill={dark} />
      <ellipse cx="74" cy="50" rx="14" ry="18" fill={main} />
      <line x1="14" y1="49" x2="64" y2="49" stroke={accent || '#fff'} strokeWidth="0.5"/>
      <circle cx="74" cy="50" r="3" fill={dark} />
    </>,
    guitar: <>
      <rect x="14" y="48" width="50" height="3" fill={pal.neck || dark} />
      <path d="M 64 35 Q 88 35 88 50 Q 88 70 70 70 Q 60 65 60 55 Q 58 50 64 45 Z" fill={main} />
      <rect x="68" y="50" width="14" height="2" fill={dark} />
      <rect x="68" y="56" width="14" height="2" fill={dark} />
    </>,
    drum: <>
      <ellipse cx="50" cy="60" rx="30" ry="10" fill={pal.kick || main} />
      <ellipse cx="50" cy="56" rx="30" ry="10" fill={pal.skin || '#FEF3C7'} />
      <ellipse cx="50" cy="56" rx="30" ry="10" fill="none" stroke={pal.shell || dark} strokeWidth="1.5" />
      <circle cx="20" cy="35" r="14" fill={accent} opacity="0.9" />
      <circle cx="20" cy="35" r="2" fill={dark} />
    </>,
    acoustic: <>
      <rect x="14" y="48" width="46" height="3" fill={pal.neck || dark} />
      <ellipse cx="70" cy="55" rx="18" ry="20" fill={pal.body || main} />
      <ellipse cx="70" cy="55" rx="18" ry="20" fill="none" stroke={pal.side || dark} strokeWidth="1" />
      <circle cx="66" cy="55" r="5" fill={pal.hole || dark} />
      <rect x="72" y="60" width="10" height="1.5" fill={dark} />
    </>,
    cajon: <>
      <rect x="28" y="30" width="44" height="50" rx="3" fill={pal.front || main} />
      <rect x="28" y="30" width="44" height="6" fill={pal.top || accent} />
      <ellipse cx="50" cy="55" rx="3.5" ry="4.5" fill={pal.hole || dark} />
      {[34,42,50,58,66,74].map(y => <line key={y} x1="32" y1={y} x2="68" y2={y} stroke={dark} strokeOpacity="0.18" strokeWidth="0.5" />)}
    </>,
    violin: <>
      <line x1="18" y1="30" x2="82" y2="68" stroke={dark} strokeWidth="1" />
      <ellipse cx="68" cy="58" rx="16" ry="20" fill={pal.body || main} transform="rotate(-20 68 58)" />
      <ellipse cx="62" cy="54" rx="3" ry="5" fill={pal.side || dark} opacity="0.45" transform="rotate(-20 62 54)" />
      <path d="M 62 56 Q 60 60 62 64" stroke={pal.f || dark} strokeWidth="1" fill="none" />
      <path d="M 72 60 Q 70 64 72 68" stroke={pal.f || dark} strokeWidth="1" fill="none" />
      <rect x="22" y="36" width="36" height="3" fill={pal.neck || dark} transform="rotate(35 40 38)"/>
    </>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <ellipse cx="50" cy="82" rx="32" ry="4" fill="rgba(0,0,0,0.15)" />
      {shapes[id]}
    </svg>
  );
}

Object.assign(window, { InstrumentIcon, AbstractIcon, ICON_PALETTES });
