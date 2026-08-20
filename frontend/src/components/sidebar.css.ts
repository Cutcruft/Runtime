import { style } from '@vanilla-extract/css'

export const sidebar = style({
  width: '14rem',
  flex: '0 0 auto',
  background: 'var(--rt-color-surface)',
  borderRight: '1px solid var(--rt-color-border)',
  overflowY: 'auto',
  padding: '0.5rem 0.5rem 1rem',
})

export const sidebarDrawer = style({
  '@media': {
    '(max-width: 48rem)': {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 40,
      width: 'min(18rem, 85vw)',
      transform: 'translateX(0)',
      transition: 'transform 0.2s ease',
      boxShadow: '0 0.5rem 2rem rgb(0 0 0 / 0.15)',
    },
  },
})

export const groupHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.5rem 0.5rem 0.25rem',
  fontSize: 'var(--rt-font-size-sm)',
  fontWeight: 600,
  color: 'var(--rt-color-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  cursor: 'pointer',
  userSelect: 'none',
})

export const caret = style({
  display: 'inline-block',
  fontSize: '0.6rem',
  transition: 'transform 0.15s ease',
})

export const caretOpen = style({
  transform: 'rotate(90deg)',
})

export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: '0 0 0.5rem',
})

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.4rem 0.5rem',
  borderRadius: 'var(--rt-radius-sm)',
  color: 'var(--rt-color-text)',
  textDecoration: 'none',
  cursor: 'pointer',
  fontSize: 'var(--rt-font-size)',
  ':hover': {
    background: 'var(--rt-color-bg)',
  },
})

export const itemActive = style({
  background: 'var(--rt-color-bg)',
  color: 'var(--rt-color-primary)',
  fontWeight: 600,
})

export const navIcon = style({
  width: '1.1rem',
  height: '1.1rem',
  textAlign: 'center',
  color: 'var(--rt-color-muted)',
})

export const navIconImg = style({
  objectFit: 'contain',
})

export const itemActiveIcon = style({
  color: 'var(--rt-color-primary)',
})

export const scrim = style({
  display: 'none',
  '@media': {
    '(max-width: 48rem)': {
      display: 'block',
      position: 'fixed',
      inset: 0,
      zIndex: 30,
      background: 'rgb(0 0 0 / 0.35)',
    },
  },
})
