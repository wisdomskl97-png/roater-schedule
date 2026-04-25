// 메인 앱 컴포넌트 — 탭 전환 + 상태 관리

const { useState: useAppState } = React;

function RosterApp({ theme: themeName = 'cute', iconPalette }) {
  const themeBase = THEMES[themeName];
  const theme = { ...themeBase, iconPalette: iconPalette || (themeName === 'bold' ? 'bold' : 'cute') };

  const [members, setMembers] = useAppState(SEED_MEMBERS);
  const [week, setWeek] = useAppState(SEED_WEEK);
  const [tab, setTab] = useAppState('week');
  const [roster, setRoster] = useAppState(() => autoBuildRoster(SEED_MEMBERS, SEED_WEEK));
  const [animateOnMount, setAnimateOnMount] = useAppState(false);

  function handleGenerate() {
    const r = autoBuildRoster(members, week);
    setRoster(r);
    setAnimateOnMount(true);
    setTab('roster');
  }

  let content;
  if (tab === 'week') {
    content = <WeekScreen theme={theme} members={members} week={week} setWeek={setWeek} onGenerate={handleGenerate} />;
  } else if (tab === 'roster') {
    content = <RosterScreen theme={theme} members={members} week={week} roster={roster} setRoster={setRoster}
      animateOnMount={animateOnMount} onAnimateDone={() => setAnimateOnMount(false)} />;
  } else if (tab === 'members') {
    content = <MembersScreen theme={theme} members={members} setMembers={setMembers} />;
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: theme.bg,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* 상단 브랜드 바 */}
      <BrandHeader theme={theme} themeName={themeName} />
      {/* 컨텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {content}
      </div>
      {/* 하단 탭 */}
      <TabBar active={tab} onChange={setTab} theme={theme} />
    </div>
  );
}

function BrandHeader({ theme, themeName }) {
  return (
    <div style={{
      padding: '12px 20px 10px',
      background: theme.bg,
      borderBottom: themeName === 'bold' ? `2px solid ${theme.border}` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28,
          borderRadius: theme.radius >= 16 ? 8 : 4,
          background: theme.primary, color: theme.primaryFg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: theme.fontHead, fontWeight: 900, fontSize: 14,
        }}>주</div>
        <div style={{ fontFamily: '"Apple SD Gothic Neo"', fontWeight: 800, fontSize: 14, color: theme.text }}>
          주안교회 <span style={{ color: theme.textMuted, fontWeight: 600 }}>· 찬양팀</span>
        </div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: theme.textMuted,
        padding: '4px 8px', background: theme.surface,
        borderRadius: theme.radius >= 16 ? 999 : 4,
        border: `1px solid ${theme.border}`,
      }}>{themeName === 'cute' ? 'soft' : 'bold'}</div>
    </div>
  );
}

Object.assign(window, { RosterApp });
