// 멤버 관리 화면

const { useState: useStateMembers } = React;

function MembersScreen({ members, setMembers, theme }) {
  const [editingId, setEditingId] = useStateMembers(null);
  const [showNew, setShowNew] = useStateMembers(false);

  const editing = editingId === 'new' ? null : members.find(m => m.id === editingId);

  function saveMember(m) {
    if (m.id) {
      setMembers(members.map(x => x.id === m.id ? m : x));
    } else {
      const id = 'm' + Date.now();
      setMembers([...members, { ...m, id }]);
    }
    setEditingId(null); setShowNew(false);
  }
  function deleteMember(id) {
    setMembers(members.filter(x => x.id !== id));
    setEditingId(null);
  }

  return (
    <div style={{ padding: '0 0 100px', fontFamily: theme.fontBody, color: theme.text }}>
      {/* 헤더 */}
      <div style={{ padding: '20px 20px 12px' }}>
        <div style={{ fontFamily: '"Apple SD Gothic Neo"', fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>
          멤버 <span style={{ color: theme.primary }}>{members.filter(m=>m.active).length}</span>
          <span style={{ fontSize: 18, fontWeight: 500, color: theme.textMuted, marginLeft: 6 }}>/ {members.length}</span>
        </div>
        <div style={{ color: theme.textMuted, fontSize: 14, marginTop: 4 }}>찬양팀 악기 멤버 관리</div>
      </div>

      {/* 새 멤버 버튼 */}
      <div style={{ padding: '0 20px 12px' }}>
        <Btn theme={theme} variant="outline" style={{ width: '100%' }} onClick={() => setShowNew(true)}>+ 새 멤버 추가</Btn>
      </div>

      {/* 멤버 리스트 */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {members.map(m => (
          <div key={m.id}
            onClick={() => setEditingId(m.id)}
            style={{
              background: theme.surface,
              borderRadius: theme.radius,
              padding: '14px 16px',
              border: theme.radius < 10 ? `2px solid ${theme.border}` : `1px solid ${theme.border}`,
              boxShadow: theme.shadow,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: m.active ? 1 : 0.5,
            }}>
            <MemberAvatar name={m.name} size={44} theme={theme} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 17 }}>{m.name}</span>
                {!m.active && <span style={{ fontSize: 11, padding: '2px 6px', background: theme.surfaceAlt, color: theme.textMuted, borderRadius: 4 }}>비활성</span>}
                <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4,
                  background: m.defaultService === 'both' ? theme.primary : theme.surfaceAlt,
                  color: m.defaultService === 'both' ? theme.primaryFg : theme.textMuted,
                  fontWeight: 600,
                }}>
                  {m.defaultService === 'both' ? '둘 다' : m.defaultService === 'first' ? '2부' : '3부'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                {m.instruments.map(iid => {
                  const inst = getInstrument(iid);
                  return (
                    <div key={iid} style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '3px 8px 3px 4px',
                      background: theme.surfaceAlt,
                      borderRadius: theme.radius >= 16 ? 999 : 4,
                      fontSize: 12, fontWeight: 600,
                    }}>
                      <div style={{ width: 22, height: 22, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <InstrumentIcon id={iid} size={22} paletteName={theme.iconPalette || 'cute'} />
                      </div>
                      {inst.short}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ color: theme.textMuted, fontSize: 20 }}>›</div>
          </div>
        ))}
      </div>

      {/* 편집 시트 */}
      {(editing || showNew) && (
        <MemberEditSheet
          theme={theme}
          member={editing}
          onClose={() => { setEditingId(null); setShowNew(false); }}
          onSave={saveMember}
          onDelete={editing ? deleteMember : null}
        />
      )}
    </div>
  );
}

function MemberEditSheet({ theme, member, onClose, onSave, onDelete }) {
  const init = member || { name: '', instruments: [], defaultService: 'both', active: true, note: '' };
  const [m, setM] = useStateMembers(init);

  function toggleInst(id) {
    setM({ ...m, instruments: m.instruments.includes(id)
      ? m.instruments.filter(x => x !== id)
      : [...m.instruments, id] });
  }

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 100, display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn 0.2s',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.surface, width: '100%',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 20px 32px',
        animation: 'slideUp 0.25s ease-out',
        maxHeight: '85%', overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.border, margin: '0 auto 16px' }} />
        <div style={{ fontFamily: theme.fontHead, fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
          {member ? '멤버 수정' : '새 멤버'}
        </div>

        {/* 이름 */}
        <Field label="이름" theme={theme}>
          <input value={m.name} onChange={e => setM({...m, name: e.target.value})}
            placeholder="예: 김민수"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '12px 14px',
              border: `${theme.radius < 10 ? 2 : 1}px solid ${theme.border}`,
              borderRadius: theme.radius >= 16 ? 12 : 4,
              fontSize: 16, fontFamily: theme.fontBody,
              background: theme.surfaceAlt, color: theme.text,
              outline: 'none',
            }}/>
        </Field>

        {/* 악기 */}
        <Field label="가능 악기" theme={theme}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {INSTRUMENTS.map(inst => {
              const sel = m.instruments.includes(inst.id);
              return (
                <button key={inst.id} onClick={() => toggleInst(inst.id)}
                  style={{
                    border: `${theme.radius < 10 ? 2 : 1}px solid ${sel ? theme.primary : theme.border}`,
                    background: sel ? theme.primary : theme.surface,
                    color: sel ? theme.primaryFg : theme.text,
                    borderRadius: theme.radius >= 16 ? 14 : 4,
                    padding: '10px 6px',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    fontFamily: theme.fontBody, fontWeight: 700, fontSize: 12,
                  }}>
                  <div style={{ filter: sel ? 'none' : 'grayscale(0.4)', opacity: sel ? 1 : 0.85 }}>
                    <InstrumentIcon id={inst.id} size={44} paletteName={theme.iconPalette || 'cute'} />
                  </div>
                  {inst.short}
                </button>
              );
            })}
          </div>
        </Field>

        {/* 기본 가능 예배 */}
        <Field label="기본 가능 예배" theme={theme}>
          <SegmentedToggle theme={theme}
            value={m.defaultService}
            onChange={v => setM({...m, defaultService: v})}
            options={[
              { value: 'first', label: '2부만' },
              { value: 'second', label: '3부만' },
              { value: 'both', label: '둘 다' },
            ]} />
        </Field>

        {/* 활성 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 14px',
          background: theme.surfaceAlt,
          borderRadius: theme.radius >= 16 ? 14 : 4,
          marginTop: 16,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>활성 멤버</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>비활성이면 자동 배정에서 제외</div>
          </div>
          <Switch on={m.active} onChange={v => setM({...m, active: v})} theme={theme} />
        </div>

        {/* 메모 */}
        <Field label="메모" theme={theme}>
          <input value={m.note} onChange={e => setM({...m, note: e.target.value})}
            placeholder="(선택) 특이사항"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '12px 14px',
              border: `${theme.radius < 10 ? 2 : 1}px solid ${theme.border}`,
              borderRadius: theme.radius >= 16 ? 12 : 4,
              fontSize: 15, fontFamily: theme.fontBody,
              background: theme.surfaceAlt, color: theme.text,
              outline: 'none',
            }}/>
        </Field>

        {/* 액션 */}
        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          {onDelete && (
            <Btn theme={theme} variant="outline" onClick={() => onDelete(m.id)}
              style={{ color: theme.danger, borderColor: theme.danger }}>삭제</Btn>
          )}
          <Btn theme={theme} variant="ghost" onClick={onClose} style={{ flex: 1 }}>취소</Btn>
          <Btn theme={theme} variant="primary" onClick={() => onSave(m)} style={{ flex: 1.5 }} disabled={!m.name || m.instruments.length === 0}>저장</Btn>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, theme }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: theme.textMuted, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function SegmentedToggle({ value, onChange, options, theme }) {
  return (
    <div style={{
      display: 'flex',
      background: theme.surfaceAlt,
      padding: 3,
      borderRadius: theme.radius >= 16 ? 12 : 4,
      gap: 2,
    }}>
      {options.map(o => {
        const sel = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)}
            style={{
              flex: 1, border: 'none', cursor: 'pointer',
              padding: '10px 8px',
              borderRadius: theme.radius >= 16 ? 10 : 3,
              background: sel ? theme.surface : 'transparent',
              color: sel ? theme.primary : theme.textMuted,
              boxShadow: sel ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              fontFamily: theme.fontBody, fontWeight: 700, fontSize: 14,
            }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function Switch({ on, onChange, theme }) {
  return (
    <button onClick={() => onChange(!on)}
      style={{
        width: 50, height: 30, border: 'none',
        borderRadius: theme.radius >= 16 ? 999 : 4,
        background: on ? theme.primary : theme.border,
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.15s',
      }}>
      <div style={{
        width: 24, height: 24,
        borderRadius: theme.radius >= 16 ? '50%' : 2,
        background: '#fff',
        position: 'absolute', top: 3,
        left: on ? 23 : 3,
        transition: 'left 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

Object.assign(window, { MembersScreen, Field, SegmentedToggle, Switch });
