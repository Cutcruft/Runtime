import { style } from '@vanilla-extract/css'

// ── Context Menu ────────────────────────────────────────────────

export const menu = style({
  position: 'fixed',
  minWidth: '12rem',
  padding: '0.25rem',
  background: 'var(--rt-color-surface)',
  border: '1px solid var(--rt-color-border)',
  borderRadius: 'var(--rt-radius)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
  zIndex: 1100,
})

export const menuItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.35rem 0.6rem',
  borderRadius: 'var(--rt-radius-sm)',
  cursor: 'pointer',
  fontSize: 'var(--rt-font-size)',
  whiteSpace: 'nowrap',
  ':hover': {
    background: 'var(--rt-color-primary)',
    color: 'var(--rt-color-on-primary)',
  },
})

export const menuItemDisabled = style({
  opacity: 0.5,
  cursor: 'default',
  pointerEvents: 'none',
})

export const menuItemDanger = style({
  ':hover': {
    background: 'var(--rt-color-danger)',
    color: '#fff',
  },
})

export const menuItemSubmenu = style({
  ':hover': {
    background: 'var(--rt-color-primary)',
    color: 'var(--rt-color-on-primary)',
  },
})

export const menuIcon = style({
  width: '1rem',
  textAlign: 'center',
})

export const menuLabel = style({
  flex: 1,
})

export const menuShortcut = style({
  fontSize: '0.75rem',
  opacity: 0.7,
})

export const menuCaret = style({
  fontWeight: 700,
})

export const menuDivider = style({
  display: 'block',
  height: '1px',
  margin: '0.25rem 0',
  background: 'var(--rt-color-border)',
})

export const menuSubmenu = style({
  position: 'fixed',
  minWidth: '12rem',
  padding: '0.25rem',
  background: 'var(--rt-color-surface)',
  border: '1px solid var(--rt-color-border)',
  borderRadius: 'var(--rt-radius)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
  zIndex: 1100,
})

// ── Modal ───────────────────────────────────────────────────────

export const modalBackdrop = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1200,
})

export const modal = style({
  background: 'var(--rt-color-surface)',
  borderRadius: 'var(--rt-radius)',
  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.28)',
  maxHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

export const modalHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--rt-space) var(--rt-space-lg)',
  borderBottom: '1px solid var(--rt-color-border)',
})

export const modalTitle = style({
  margin: 0,
  fontSize: 'var(--rt-font-size-lg)',
})

export const modalClose = style({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 'var(--rt-font-size)',
  color: 'var(--rt-color-muted)',
})

export const modalBody = style({
  padding: 'var(--rt-space-lg)',
  overflowY: 'auto',
})

// ── Panel ───────────────────────────────────────────────────────

export const panelBackdrop = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.2)',
  zIndex: 1150,
})

export const panel = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  background: 'var(--rt-color-surface)',
  boxShadow: '0 0 32px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  flexDirection: 'column',
})

export const panelLeft = style({
  left: 0,
})

export const panelRight = style({
  right: 0,
})

export const panelBottom = style({
  left: 0,
  right: 0,
  bottom: 0,
  top: 'auto',
})

export const panelHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--rt-space) var(--rt-space-lg)',
  borderBottom: '1px solid var(--rt-color-border)',
})

export const panelTitle = style({
  margin: 0,
  fontSize: 'var(--rt-font-size-lg)',
})

export const panelClose = style({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 'var(--rt-font-size)',
  color: 'var(--rt-color-muted)',
})

export const panelBody = style({
  flex: 1,
  padding: 'var(--rt-space-lg)',
  overflowY: 'auto',
})

// ── Tooltip ─────────────────────────────────────────────────────

export const tooltip = style({
  position: 'fixed',
  zIndex: 1300,
  maxWidth: '18rem',
  padding: '0.4rem 0.6rem',
  background: 'var(--rt-color-inverse-bg, #222)',
  color: 'var(--rt-color-inverse-text, #fff)',
  borderRadius: 'var(--rt-radius-sm)',
  fontSize: 'var(--rt-font-size-sm)',
  pointerEvents: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
})
