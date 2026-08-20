import { style } from '@vanilla-extract/css'

export const overlay = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingTop: '15vh',
  zIndex: 900,
})

export const palette = style({
  width: 'min(36rem, 90vw)',
  background: 'var(--rt-color-surface)',
  borderRadius: '10px',
  boxShadow: 'var(--rt-shadow)',
  overflow: 'hidden',
})

export const input = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.9rem 1rem',
  border: 'none',
  borderBottom: '1px solid var(--rt-color-border)',
  fontSize: '1rem',
  outline: 'none',
  background: 'var(--rt-color-surface)',
  color: 'var(--rt-color-text)',
})

export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: '0.5rem',
  maxHeight: '40vh',
  overflowY: 'auto',
})

export const group = style({
  padding: '0.5rem 0.75rem 0.25rem',
  fontSize: 'var(--rt-font-size-sm)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--rt-color-muted)',
})

export const item = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.75rem',
  padding: '0.5rem 0.75rem',
  borderRadius: '6px',
  cursor: 'pointer',
  ':hover': {
    background: 'var(--rt-color-bg)',
  },
})

export const itemActive = style({
  background: 'var(--rt-color-bg)',
})

export const icon = style({
  width: '1.1rem',
  textAlign: 'center',
  color: 'var(--rt-color-muted)',
})

export const id = style({
  fontFamily: 'monospace',
  fontSize: '0.85rem',
  color: 'var(--rt-color-primary)',
})

export const idPage = style({
  color: 'var(--rt-color-muted)',
})

export const description = style({
  fontSize: '0.85rem',
  color: 'var(--rt-color-muted)',
})

export const empty = style({
  padding: '1rem',
  textAlign: 'center',
  color: '#999',
  fontSize: '0.875rem',
})
