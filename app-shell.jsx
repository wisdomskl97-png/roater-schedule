// 찬양팀 로스터 앱 - 메인 앱 컴포넌트
// theme prop: 'cute' | 'bold' (디자인 시스템 분기)

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────
// 테마 정의
const THEMES = {
  cute: {
    bg: '#FFF7F9',
    surface: '#FFFFFF',
    surfaceAlt: '#FDF2F8',
    border: '#FCE7F3',
    text: '#3F1F2E',
    textMuted: '#9F6B82',
    primary: '#EC4899',
    primaryFg: '#FFFFFF',
    accent: '#A78BFA',
    accent2: '#FBBF24',
    danger: '#E11D48',
    success: '#10B981',
    fontHead: '"Apple SD Gothic Neo", -apple-system, system-ui, sans-serif',
    fontBody: '"Apple SD Gothic Neo", -apple-system, system-ui, sans-serif',
    radius: 20,
    shadow: '0 4px 20px rgba(236,72,153,0.08), 0 1px 2px rgba(63,31,46,0.04)',
    iconStyle: 'iso',
  },
  bold: {
    bg: '#F4F1EA',
    surface: '#FFFFFF',
    surfaceAlt: '#FAFAFA',
    border: '#1C1917',
    text: '#0C0A09',
    textMuted: '#57534E',
    primary: '#FACC15',
    primaryFg: '#0C0A09',
    accent: '#0C0A09',
    accent2: '#DC2626',
    danger: '#DC2626',
    success: '#15803D',
    fontHead: '"Apple SD Gothic Neo", -apple-system, system-ui, sans-serif',
    fontBody: '"Apple SD Gothic Neo", -apple-system, system-ui, sans-serif',
    radius: 4,
    shadow: '4px 4px 0 #0C0A09',
    iconStyle: 'iso',
  },
};

// ─────────────────────────────────────────────────────────
// 작은 헬퍼들
function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  const days = ['일','월','화','수','목','금','토'];
  return `${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

function getMember(members, id) { return members.find(m => m.id === id); }
function getInstrument(id) { return INSTRUMENTS.find(i => i.id === id); }

// ─────────────────────────────────────────────────────────
// 공용: 멤버 칩 (이름 + 작은 아바타)
function MemberAvatar({ name, size = 32, theme }) {
  const initial = name ? name.slice(-2) : '?';
  const hash = name ? name.charCodeAt(0) + name.charCodeAt(name.length - 1) : 0;
  const hue = (hash * 47) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: theme.radius >= 16 ? '50%' : 4,
      background: `oklch(0.85 0.08 ${hue})`,
      color: `oklch(0.3 0.08 ${hue})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: theme.fontBody, fontWeight: 600,
      fontSize: size * 0.42, flexShrink: 0,
      border: theme.iconStyle === 'iso' && theme.radius < 10 ? `2px solid ${theme.border}` : 'none',
    }}>{initial}</div>
  );
}

// ─────────────────────────────────────────────────────────
// 공용: 버튼
function Btn({ children, onClick, variant = 'primary', theme, style = {}, disabled }) {
  const base = {
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: theme.fontBody, fontWeight: 600,
    padding: '12px 18px', borderRadius: theme.radius >= 16 ? 14 : 4,
    fontSize: 15, transition: 'transform 0.08s, box-shadow 0.15s',
    opacity: disabled ? 0.4 : 1,
  };
  let v;
  if (variant === 'primary') {
    v = { background: theme.primary, color: theme.primaryFg, boxShadow: theme.radius < 10 ? `3px 3px 0 ${theme.border}` : 'none' };
  } else if (variant === 'ghost') {
    v = { background: 'transparent', color: theme.text };
  } else if (variant === 'outline') {
    v = { background: theme.surface, color: theme.text, border: `${theme.radius < 10 ? 2 : 1}px solid ${theme.border}` };
  } else if (variant === 'danger') {
    v = { background: theme.danger, color: '#fff' };
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...v, ...style }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'translate(1px,1px)'; }}
      onMouseUp={e => e.currentTarget.style.transform = ''}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >{children}</button>
  );
}

// ─────────────────────────────────────────────────────────
// 탭바 (하단)
function TabBar({ active, onChange, theme }) {
  const tabs = [
    { id: 'week', label: '이번 주', emoji: '🗓️' },
    { id: 'roster', label: '로스터', emoji: '🎵' },
    { id: 'members', label: '멤버', emoji: '👥' },
  ];
  return (
    <div style={{
      display: 'flex', gap: 0,
      background: theme.surface,
      borderTop: `${theme.radius < 10 ? 2 : 1}px solid ${theme.border}`,
      padding: '8px 8px 24px',
      position: 'relative', zIndex: 30,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              cursor: 'pointer', padding: '8px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: isActive ? theme.primary : theme.textMuted,
              fontFamily: theme.fontBody, fontWeight: isActive ? 700 : 500, fontSize: 11,
            }}>
            <div style={{
              fontSize: 22, transition: 'transform 0.2s',
              transform: isActive ? 'scale(1.15)' : 'scale(1)',
              filter: theme.iconStyle === 'iso' && !isActive ? 'grayscale(0.5)' : 'none',
            }}>{t.emoji}</div>
            <div>{t.label}</div>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { THEMES, fmtDate, getMember, getInstrument, MemberAvatar, Btn, TabBar });
