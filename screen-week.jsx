// 주간 준비 화면 - 날짜, 인도자, availability 입력

const { useState: useStateWeek } = React;

function WeekScreen({ members, week, setWeek, theme, onGenerate }) {
  // 인도자 같음/다름만 관리. 내부 표현은 firstLeader/secondLeader 동일/다름으로
  const sameLeaderState = !!(week.firstLeader && week.firstLeader === week.secondLeader);
  function setSameLeader(same) {
    if (same) {
      setWeek({ ...week, firstLeader: 'A', secondLeader: 'A' });
    } else {
      setWeek({ ...week, firstLeader: 'A', secondLeader: 'B' });
    }
  }
  function setAvail(memberId, service, val) {
    const next = { ...week.availability };
    next[memberId] = { ...(next[memberId] || {}), [service]: val };
    setWeek({ ...week, availability: next });
  }
  function clearAvail(memberId) {
    const next = { ...week.availability };
    delete next[memberId];
    setWeek({ ...week, availability: next });
  }

  const sameLeader = week.firstLeader && week.firstLeader === week.secondLeader;

  return (
    <div style={{ padding: '0 0 100px', fontFamily: theme.fontBody, color: theme.text }}>
      {/* 헤더 */}
      <div style={{ padding: '20px 20px 12px' }}>
        <div style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>이번 주 예배</div>
        <div style={{ fontFamily: '"Apple SD Gothic Neo"', fontSize: 32, fontWeight: 800, lineHeight: 1.1, marginTop: 2 }}>
          {fmtDate(week.date)}
        </div>
      </div>

      {/* 날짜 변경 */}
      <div style={{ padding: '0 20px 16px' }}>
        <input type="date" value={week.date}
          onChange={e => setWeek({ ...week, date: e.target.value })}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 14px',
            border: `${theme.radius < 10 ? 2 : 1}px solid ${theme.border}`,
            borderRadius: theme.radius >= 16 ? 12 : 4,
            background: theme.surface, color: theme.text,
            fontSize: 15, fontFamily: theme.fontBody,
            outline: 'none',
          }}/>
      </div>

      {/* 인도자 같음/다름 토글 */}
      <SectionTitle theme={theme}>2부 · 3부 인도자</SectionTitle>
      <div style={{ padding: '0 16px 4px' }}>
        <div style={{
          background: theme.surface,
          borderRadius: theme.radius,
          padding: '14px 16px',
          border: `${theme.radius < 10 ? 2 : 1}px solid ${theme.border}`,
          boxShadow: theme.shadow,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, marginBottom: 8 }}>
            2부와 3부 인도자가
          </div>
          <SegmentedToggle theme={theme}
            value={sameLeaderState ? 'same' : 'diff'}
            onChange={v => setSameLeader(v === 'same')}
            options={[
              { value: 'same', label: '🔗 같음' },
              { value: 'diff', label: '↔️ 다름' },
            ]} />
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 10, lineHeight: 1.5 }}>
            {sameLeaderState
              ? '인도자가 같으니 2부·3부 멤버를 최대한 동일하게 배정합니다.'
              : '인도자가 다르므로 2부·3부 멤버를 독립적으로 배정합니다.'}
          </div>
        </div>
      </div>

      {/* 멤버 availability */}
      <SectionTitle theme={theme} style={{ marginTop: 24 }}>멤버 가능 여부</SectionTitle>
      <div style={{ padding: '0 16px', fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>
        기본 설정이 있으면 표시되고, 이번 주만 다르게 바꿀 수 있어요
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.filter(m => m.active).map(m => {
          const ex = week.availability[m.id];
          const firstAvail = ex && typeof ex.first === 'boolean' ? ex.first
            : m.defaultService === 'both' || m.defaultService === 'first';
          const secondAvail = ex && typeof ex.second === 'boolean' ? ex.second
            : m.defaultService === 'both' || m.defaultService === 'second';
          const overridden = !!ex;
          return (
            <div key={m.id} style={{
              background: theme.surface,
              borderRadius: theme.radius,
              padding: '12px 14px',
              border: `${theme.radius < 10 ? 2 : 1}px solid ${overridden ? theme.primary : theme.border}`,
              boxShadow: theme.shadow,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <MemberAvatar name={m.name} size={36} theme={theme} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: theme.textMuted }}>
                  {overridden ? '✏️ 이번 주 변경됨' : `기본: ${m.defaultService === 'both' ? '둘 다' : m.defaultService === 'first' ? '2부' : '3부'}`}
                </div>
              </div>
              <ServicePill theme={theme} label="2부" on={firstAvail} onChange={v => setAvail(m.id, 'first', v)} />
              <ServicePill theme={theme} label="3부" on={secondAvail} onChange={v => setAvail(m.id, 'second', v)} />
              {overridden && (
                <button onClick={() => clearAvail(m.id)} style={{
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  color: theme.textMuted, fontSize: 11, padding: 4,
                }}>↺</button>
              )}
            </div>
          );
        })}
      </div>

      {/* 자동 생성 버튼 */}
      <div style={{ padding: '24px 20px 0' }}>
        <Btn theme={theme} variant="primary" onClick={onGenerate} style={{
          width: '100%', padding: '18px 20px', fontSize: 17, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 22 }}>🎰</span> 로스터 자동 생성
        </Btn>
      </div>
    </div>
  );
}

function SectionTitle({ children, theme, style = {} }) {
  return (
    <div style={{
      padding: '0 20px 8px', fontSize: 12, fontWeight: 700,
      color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.6,
      ...style,
    }}>{children}</div>
  );
}

function LeaderRow({ label, value, onChange, theme }) {
  const [editing, setEditing] = useStateWeek(false);
  return (
    <div style={{
      background: theme.surface,
      borderRadius: theme.radius,
      padding: '14px 16px',
      border: `${theme.radius < 10 ? 2 : 1}px solid ${theme.border}`,
      boxShadow: theme.shadow,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: theme.radius >= 16 ? '50%' : 4,
        background: theme.primary, color: theme.primaryFg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 16, fontFamily: theme.fontHead,
      }}>{label}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>인도자</div>
        {editing ? (
          <input autoFocus value={value || ''}
            onChange={e => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={e => { if (e.key === 'Enter') setEditing(false); }}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '4px 8px',
              border: `1px solid ${theme.primary}`,
              borderRadius: 4, fontSize: 16, fontWeight: 700,
              fontFamily: theme.fontBody,
              background: theme.surfaceAlt, color: theme.text,
              outline: 'none',
            }}/>
        ) : (
          <div onClick={() => setEditing(true)} style={{
            fontSize: 16, fontWeight: 700, cursor: 'text',
            color: value ? theme.text : theme.textMuted,
          }}>{value || '입력하세요'}</div>
        )}
      </div>
    </div>
  );
}

function ServicePill({ label, on, onChange, theme }) {
  return (
    <button onClick={() => onChange(!on)}
      style={{
        border: `${theme.radius < 10 ? 2 : 1}px solid ${on ? theme.primary : theme.border}`,
        background: on ? theme.primary : theme.surface,
        color: on ? theme.primaryFg : theme.textMuted,
        borderRadius: theme.radius >= 16 ? 999 : 4,
        padding: '6px 10px',
        fontSize: 12, fontWeight: 700,
        cursor: 'pointer',
        fontFamily: theme.fontBody,
        opacity: on ? 1 : 0.6,
        position: 'relative',
      }}>
      {label}
      {!on && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.danger, fontSize: 18, fontWeight: 800 }}>✕</span>}
    </button>
  );
}

Object.assign(window, { WeekScreen });
