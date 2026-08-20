import { style } from '@vanilla-extract/css'

// ── Primitives ──────────────────────────────────────────────────

export const container = style({
  minWidth: 0,
  minHeight: 0,
})

export const containerUnknown = style({
  padding: '0.5rem',
  border: '1px dashed var(--rt-color-border)',
  borderRadius: 'var(--rt-radius-sm)',
  background: 'var(--rt-color-surface)',
  color: 'var(--rt-color-muted)',
})

export const containerUnknownPre = style({
  margin: '0.25rem 0 0',
  fontSize: '0.75rem',
})

export const page = style({})

export const pageTitle = style({
  margin: '0 0 var(--rt-space-lg)',
  fontSize: 'var(--rt-font-size-xl)',
})

export const section = style({
  display: 'grid',
  alignItems: 'start',
  marginBottom: 'var(--rt-space-lg)',
})

export const layer = style({
  position: 'relative',
  minHeight: 0,
})

export const layerHidden = style({
  display: 'none',
})

export const stack = style({
  display: 'flex',
  minWidth: 0,
  minHeight: 0,
})

export const stackVertical = style({
  flexDirection: 'column',
})

export const stackHorizontal = style({
  flexDirection: 'row',
})

export const stackWrap = style({
  flexWrap: 'wrap',
})

export const grid = style({
  display: 'grid',
  minWidth: 0,
  minHeight: 0,
})

export const slot = style({
  minWidth: 0,
  minHeight: 0,
})

// ── Tabs ────────────────────────────────────────────────────────

export const tabsbar = style({
  display: 'flex',
  alignItems: 'stretch',
  background: 'var(--rt-color-surface)',
  borderBottom: '1px solid var(--rt-color-border)',
  padding: '0.25rem 0.5rem 0',
  gap: '0.25rem',
  overflow: 'hidden',
})

export const tabsbarScroll = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '0.25rem',
  overflowX: 'auto',
  scrollbarWidth: 'thin',
})

export const tabsbarTab = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  maxWidth: '14rem',
  padding: '0.35rem 0.6rem',
  border: '1px solid transparent',
  borderBottom: 'none',
  borderRadius: 'var(--rt-radius-sm) var(--rt-radius-sm) 0 0',
  background: 'transparent',
  color: 'var(--rt-color-muted)',
  fontFamily: 'inherit',
  fontSize: 'var(--rt-font-size)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  ':hover': {
    background: 'var(--rt-color-bg)',
    color: 'var(--rt-color-text)',
  },
})

export const tabsbarTabActive = style({
  background: 'var(--rt-color-bg)',
  color: 'var(--rt-color-text)',
  borderColor: 'var(--rt-color-border)',
})

export const tabsbarTitle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const tabsbarClose = style({
  flex: '0 0 auto',
  padding: '0 0.2rem',
  borderRadius: '4px',
  lineHeight: 1,
  color: 'var(--rt-color-muted)',
  ':hover': {
    background: 'var(--rt-color-border)',
    color: 'var(--rt-color-text)',
  },
})

// ── Toast ───────────────────────────────────────────────────────

export const toastViewport = style({
  position: 'fixed',
  bottom: '1rem',
  right: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  zIndex: 1000,
})

export const toast = style({
  padding: '0.6rem 1rem',
  borderRadius: 'var(--rt-radius)',
  background: '#333',
  color: '#fff',
  fontSize: 'var(--rt-font-size)',
  boxShadow: 'var(--rt-shadow)',
  cursor: 'pointer',
  maxWidth: '20rem',
})

export const toastError = style({
  background: 'var(--rt-color-danger)',
})

export const toastSuccess = style({
  background: 'var(--rt-color-success)',
})
