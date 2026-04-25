// 로스터 화면 - 자동생성 (슬롯머신 애니메이션) + 수동 수정 + 인라인 경고

const { useState: useStateRoster, useEffect: useEffectRoster, useRef: useRefRoster, useMemo } = React;

function RosterScreen({ members, week, roster, setRoster, theme, animateOnMount, onAnimateDone }) {
  const [activeService, setActiveService] = useStateRoster('first');
  const [pickerFor, setPickerFor] = useStateRoster(null); // { service, instrumentId }
  const [animating, setAnimating] = useStateRoster(animateOnMount);
  const [showSummary, setShowSummary] = useStateRoster(false);

  useEffectRoster(() => {
    if (animateOnMount) {
      setAnimating(true);
      const t = setTimeout(() => {
        setAnimating(false);
        onAnimateDone && onAnimateDone();
      }, 2400);
      return () => clearTimeout(t);
    }
  }, [animateOnMount]);

  function regenerate() {
    setAnimating(true);
    setTimeout(() => {
      const r = autoBuildRoster(members, week);
      setRoster(r);
      setAnimating(false);
    }, 50);
    // 새 로스터 보여주기 전에 애니메이션
    setTimeout(() => {
      const r = autoBuildRoster(members, week);
      setRoster(r);
    }, 100);
  }

  function setSlot(service, instrumentId, memberId) {
    setRoster({ ...roster, [service]: { ...roster[service], [instrumentId]: memberId } });
  }

  const warnings = useMemo(() => checkWarnings(roster, members, week), [roster, members, week]);
  const cur = roster[activeService];

  const sameLeader = week.firstLeader && week.firstLeader === week.secondLeader;

  return (
    <div style={{ padding: '0 0 100px', fontFamily: theme.fontBody, color: theme.text }}>
      {/* 헤더 */}
      <div style={{ padding: '20px 20px 12px' }}>
        <div style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{fmtDate(week.date)} 로스터</span>
          <button onClick={() => setShowSummary(true)} style={{
            border: `1px solid ${theme.border}`,
            background: theme.surface, color: theme.text,
            padding: '4px 10px', borderRadius: theme.radius >= 16 ? 999 : 4,
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
            fontFamily: theme.fontBody,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>📋 결과 보기 / 복사</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: '"Apple SD Gothic Neo"', fontSize: 32, fontWeight: 800, lineHeight: 1.1, marginTop: 2 }}>
            {activeService === 'first' ? '2부' : '3부'} 예배
          </div>
          <div style={{ fontSize: 13, color: theme.textMuted }}>
            인도자 · <span style={{ fontWeight: 700, color: theme.text }}>
              {sameLeader ? '같음' : '다름'}
            </span>
          </div>
        </div>
      </div>

      {/* 2부/3부 토글 */}
      <div style={{ padding: '0 16px 14px' }}>
        <SegmentedToggle theme={theme}
        value={activeService}
        onChange={setActiveService}
        options={[
        { value: 'first', label: `2부 ${countFilled(roster.first)}/${INSTRUMENTS.length}` },
        { value: 'second', label: `3부 ${countFilled(roster.second)}/${INSTRUMENTS.length}` }]
        } />
      </div>

      {/* 인도자 같음 배지 */}
      {sameLeader &&
      <div style={{ padding: '0 20px 12px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', background: theme.surfaceAlt,
          borderRadius: 999, fontSize: 11, fontWeight: 700,
          color: theme.textMuted,
          border: `1px solid ${theme.border}`
        }}>
            🔗 2부·3부 멤버 통일됨
          </div>
        </div>
      }

      {/* 악기 카드 5개 */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {INSTRUMENTS.map((inst) => {
          const memberId = cur[inst.id];
          const member = memberId ? getMember(members, memberId) : null;
          const slotWarnings = warnings.filter((w) =>
          w.service === activeService && w.instrument === inst.id);
          return (
            <InstrumentSlot key={inst.id}
            theme={theme}
            instrument={inst}
            member={member}
            warnings={slotWarnings}
            animating={animating}
            animationDelay={INSTRUMENTS.indexOf(inst) * 350}
            animationMembers={members.filter((m) => m.active && m.instruments.includes(inst.id))}
            onClick={() => setPickerFor({ service: activeService, instrumentId: inst.id })} />);


        })}
      </div>

      {/* 경고 요약 */}
      {warnings.length > 0 && !animating &&
      <div style={{ padding: '20px 16px 0' }}>
          <div style={{
          background: `oklch(0.96 0.04 25)`,
          border: `${theme.radius < 10 ? 2 : 1}px solid ${theme.danger}`,
          borderRadius: theme.radius,
          padding: '12px 14px'
        }}>
            <div style={{ fontWeight: 800, color: theme.danger, fontSize: 14, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚠️ 경고 {warnings.length}건
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {warnings.slice(0, 4).map((w, i) =>
            <div key={i} style={{ fontSize: 12, color: theme.text }}>· {w.msg}</div>
            )}
              {warnings.length > 4 && <div style={{ fontSize: 12, color: theme.textMuted }}>+ {warnings.length - 4}개 더</div>}
            </div>
          </div>
        </div>
      }

      {/* 재생성 버튼 */}
      <div style={{ padding: '20px 20px 0', display: 'flex', gap: 10 }}>
        <Btn theme={theme} variant="outline" onClick={regenerate} style={{ flex: 1 }} disabled={animating}>
          🎲 다시 돌리기
        </Btn>
      </div>

      {/* 멤버 선택 시트 */}
      {pickerFor &&
      <MemberPicker theme={theme}
      members={members} week={week}
      service={pickerFor.service}
      instrumentId={pickerFor.instrumentId}
      currentId={roster[pickerFor.service][pickerFor.instrumentId]}
      onPick={(mid) => {setSlot(pickerFor.service, pickerFor.instrumentId, mid);setPickerFor(null);}}
      onClose={() => setPickerFor(null)} />

      }

      {/* 결과 요약 시트 */}
      {showSummary &&
      <SummarySheet theme={theme}
        members={members} week={week} roster={roster}
        sameLeader={sameLeader}
        onClose={() => setShowSummary(false)} />
      }
    </div>);

}

function countFilled(svcRoster) {
  return INSTRUMENTS.filter((i) => svcRoster[i.id]).length;
}

// ─────────────────────────────────────────────────────────
// 악기 슬롯 카드 (슬롯머신 애니메이션)
function InstrumentSlot({ theme, instrument, member, warnings, animating, animationDelay, animationMembers, onClick }) {
  const [reelText, setReelText] = useStateRoster(member ? member.name : '—');
  const [reelStopped, setReelStopped] = useStateRoster(true);

  useEffectRoster(() => {
    if (animating) {
      setReelStopped(false);
      // 시작 지연
      const startT = setTimeout(() => {
        const interval = setInterval(() => {
          if (animationMembers.length > 0) {
            const random = animationMembers[Math.floor(Math.random() * animationMembers.length)];
            setReelText(random.name);
          } else {
            setReelText('?');
          }
        }, 70);
        // 멈춤
        const stopT = setTimeout(() => {
          clearInterval(interval);
          setReelText(member ? member.name : '미배정');
          setReelStopped(true);
        }, 1400);
        // cleanup
        return () => {clearInterval(interval);clearTimeout(stopT);};
      }, animationDelay);
      return () => clearTimeout(startT);
    } else {
      setReelText(member ? member.name : '미배정');
      setReelStopped(true);
    }
  }, [animating, member?.id]);

  const hasWarning = warnings.length > 0;
  const isEmpty = !member;

  return (
    <div onClick={() => !animating && onClick()}
    style={{
      background: theme.surface,
      border: `${theme.radius < 10 ? 2 : 1}px solid ${hasWarning ? theme.danger : theme.border}`,
      borderRadius: theme.radius,
      padding: '14px 16px',
      boxShadow: theme.shadow,
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: animating ? 'default' : 'pointer',
      position: 'relative',
      transition: 'transform 0.15s, box-shadow 0.15s'
    }}>
      {/* 악기 일러스트 */}
      <div style={{
        width: 64, height: 64, flexShrink: 0,
        background: theme.surfaceAlt,
        borderRadius: theme.radius >= 16 ? 16 : 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: !reelStopped ? 'wobble 0.4s infinite' : 'none'
      }}>
        <InstrumentIcon id={instrument.id} size={56} paletteName={theme.iconPalette || 'cute'} />
      </div>

      {/* 정보 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: theme.textMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          {instrument.en}
        </div>
        <div style={{ fontFamily: '"Apple SD Gothic Neo"', fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginTop: 2,
          color: isEmpty && reelStopped ? theme.textMuted : theme.text,
          fontStyle: isEmpty && reelStopped ? 'italic' : 'normal'
        }}>
          {/* 슬롯머신 효과: 빠르게 바뀌는 텍스트 */}
          <span style={{
            display: 'inline-block',
            transform: !reelStopped ? `translateY(${Math.random() * 4 - 2}px)` : 'none',
            transition: reelStopped ? 'transform 0.2s' : 'none', fontFamily: "\"Apple SD Gothic Neo\""
          }}>{reelText}</span>
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{instrument.label}</div>
      </div>

      {/* 경고 뱃지 */}
      {hasWarning && reelStopped &&
      <div style={{
        position: 'absolute', top: -6, right: -6,
        background: theme.danger, color: '#fff',
        fontSize: 11, fontWeight: 800,
        padding: '3px 8px',
        borderRadius: theme.radius >= 16 ? 999 : 4,
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        display: 'flex', alignItems: 'center', gap: 4
      }}>
          ⚠ {warnings[0].type === 'empty' ? '미배정' :
        warnings[0].type === 'unavailable' ? '불가능' :
        warnings[0].type === 'duplicate' ? '중복' :
        warnings[0].type === 'wrongInstrument' ? '악기 불일치' : '확인'}
        </div>
      }

      {!animating &&
      <div style={{ color: theme.textMuted, fontSize: 24, fontWeight: 300 }}>›</div>
      }
    </div>);

}

// ─────────────────────────────────────────────────────────
// 멤버 선택 시트
function MemberPicker({ theme, members, week, service, instrumentId, currentId, onPick, onClose }) {
  const inst = getInstrument(instrumentId);
  // 해당 악기 가능 + 활성 멤버 분류
  const all = members.filter((m) => m.active);
  const groups = {
    valid: all.filter((m) => m.instruments.includes(instrumentId) && canAttend(m, week, service)),
    canPlayCantAttend: all.filter((m) => m.instruments.includes(instrumentId) && !canAttend(m, week, service)),
    cantPlay: all.filter((m) => !m.instruments.includes(instrumentId))
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 100, display: 'flex', alignItems: 'flex-end'
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: theme.surface, width: '100%',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 0 32px',
        animation: 'slideUp 0.25s ease-out',
        maxHeight: '80%', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.border, margin: '0 auto 12px' }} />
        <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <InstrumentIcon id={instrumentId} size={42} paletteName={theme.iconPalette || 'cute'} />
          <div>
            <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>{service === 'first' ? '2부' : '3부'} {inst.label}</div>
            <div style={{ fontFamily: theme.fontHead, fontSize: 20, fontWeight: 800 }}>담당자 선택</div>
          </div>
        </div>

        <div style={{ overflowY: 'auto', padding: '0 16px', flex: 1 }}>
          {/* 미배정 옵션 */}
          <PickerRow theme={theme}
          name="미배정으로 두기" sub="비워둠"
          selected={!currentId}
          onClick={() => onPick(null)}
          italic />
          

          {groups.valid.length > 0 && <GroupLabel theme={theme}>가능한 멤버</GroupLabel>}
          {groups.valid.map((m) =>
          <PickerRow key={m.id} theme={theme}
          name={m.name} sub={m.instruments.map((i) => getInstrument(i).short).join(' · ')}
          selected={m.id === currentId}
          onClick={() => onPick(m.id)} />

          )}

          {groups.canPlayCantAttend.length > 0 && <GroupLabel theme={theme}>이번 주 불가능 (가능한 악기)</GroupLabel>}
          {groups.canPlayCantAttend.map((m) =>
          <PickerRow key={m.id} theme={theme}
          name={m.name} sub={`이번 주 ${service === 'first' ? '2부' : '3부'} 불가능`}
          warn selected={m.id === currentId}
          onClick={() => onPick(m.id)} />

          )}

          {groups.cantPlay.length > 0 && <GroupLabel theme={theme}>{inst.label} 불가능</GroupLabel>}
          {groups.cantPlay.map((m) =>
          <PickerRow key={m.id} theme={theme}
          name={m.name} sub={`${inst.label} 가능 악기 아님`}
          warn dim selected={m.id === currentId}
          onClick={() => onPick(m.id)} />

          )}
        </div>
      </div>
    </div>);

}

function GroupLabel({ children, theme }) {
  return <div style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, letterSpacing: 0.6, textTransform: 'uppercase', padding: '14px 4px 6px' }}>{children}</div>;
}

function PickerRow({ name, sub, selected, onClick, theme, warn, italic, dim }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 12px',
      borderRadius: theme.radius >= 16 ? 12 : 4,
      background: selected ? theme.surfaceAlt : 'transparent',
      border: selected ? `2px solid ${theme.primary}` : '2px solid transparent',
      cursor: 'pointer', marginBottom: 4,
      opacity: dim ? 0.4 : 1
    }}>
      <MemberAvatar name={italic ? '—' : name} size={36} theme={theme} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: warn ? theme.danger : theme.text, fontStyle: italic ? 'italic' : 'normal' }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: warn ? theme.danger : theme.textMuted }}>{sub}</div>
      </div>
      {warn && <span style={{ fontSize: 16 }}>⚠️</span>}
      {selected && <span style={{ color: theme.primary, fontSize: 22, fontWeight: 800 }}>✓</span>}
    </div>);

}

// ─────────────────────────────────────────────────────────
// 결과 요약 시트 - 텍스트 형식 + 복사
function SummarySheet({ theme, members, week, roster, sameLeader, onClose }) {
  const [copied, setCopied] = useStateRoster(false);

  function nameOf(mid) {
    if (!mid) return '미배정';
    const m = members.find(x => x.id === mid);
    return m ? m.name : '미배정';
  }

  const text = useMemo(() => {
    const lines = [];
    lines.push(`📅 ${fmtDate(week.date)}`);
    lines.push(`2부/3부 인도자: ${sameLeader ? '같음' : '다름'}`);
    lines.push('');
    lines.push('2부');
    INSTRUMENTS.forEach(i => lines.push(`${i.label}: ${nameOf(roster.first[i.id])}`));
    lines.push('');
    lines.push('3부');
    INSTRUMENTS.forEach(i => lines.push(`${i.label}: ${nameOf(roster.second[i.id])}`));
    return lines.join('\n');
  }, [roster, members, week, sameLeader]);

  function copyText() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }).catch(() => {
        fallback();
      });
    } else fallback();
    function fallback() {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch(e) {}
      document.body.removeChild(ta);
    }
  }

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 100, display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.surface, width: '100%',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 0 32px',
        animation: 'slideUp 0.25s ease-out',
        maxHeight: '85%', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.border, margin: '0 auto 12px' }} />
        <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: '"Apple SD Gothic Neo"', fontSize: 22, fontWeight: 800 }}>최종 로스터</div>
          <div style={{ fontSize: 12, color: theme.textMuted }}>공유용 텍스트</div>
        </div>
        <div style={{ padding: '0 16px', overflowY: 'auto' }}>
          <pre style={{
            background: theme.surfaceAlt,
            border: `${theme.radius < 10 ? 2 : 1}px solid ${theme.border}`,
            borderRadius: theme.radius,
            padding: '14px 16px',
            margin: 0,
            fontFamily: '"Apple SD Gothic Neo", "SF Mono", monospace',
            fontSize: 14, fontWeight: 500, lineHeight: 1.7,
            color: theme.text, whiteSpace: 'pre-wrap', wordBreak: 'keep-all',
          }}>{text}</pre>
        </div>
        <div style={{ padding: '14px 20px 0', display: 'flex', gap: 8 }}>
          <Btn theme={theme} variant="outline" onClick={onClose} style={{ flex: 1 }}>닫기</Btn>
          <Btn theme={theme} variant="primary" onClick={copyText} style={{ flex: 2 }}>
            {copied ? '✓ 복사됨!' : '📋 복사하기'}
          </Btn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RosterScreen });