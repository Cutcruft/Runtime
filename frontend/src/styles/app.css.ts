import { globalStyle, style } from '@vanilla-extract/css'

globalStyle('*, *::before, *::after', { boxSizing: 'border-box' })
globalStyle('body', {
  margin: 0,
  fontFamily: 'system-ui, sans-serif',
  background: 'var(--rt-color-bg)',
  color: 'var(--rt-color-text)',
})

export const runtime = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
})

export const body = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
})

export const content = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
})

export const contentPage = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '1.5rem',
  maxWidth: '72rem',
  margin: '0 auto',
  width: '100%',
})

export const topbar = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem 1.5rem',
  padding: '0.5rem 1.5rem',
  background: 'var(--rt-color-surface)',
  borderBottom: '1px solid var(--rt-color-border)',
})

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

export const logo = style({
  height: '1.75rem',
  width: '1.75rem',
  objectFit: 'contain',
})

export const title = style({
  margin: 0,
  fontSize: '1.1rem',
})

export const nav = style({
  display: 'flex',
  gap: '0.25rem',
  flex: 1,
})

export const link = style({
  padding: '0.4rem 0.75rem',
  borderRadius: 'var(--rt-radius-sm)',
  color: 'var(--rt-color-muted)',
  textDecoration: 'none',
  cursor: 'pointer',
  fontSize: 'var(--rt-font-size)',
  ':hover': {
    background: 'var(--rt-color-bg)',
    color: 'var(--rt-color-text)',
  },
})

export const linkActive = style({
  background: 'var(--rt-color-bg)',
  color: 'var(--rt-color-primary)',
  fontWeight: 600,
})

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginLeft: 'auto',
})

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '1.9rem',
  height: '1.9rem',
  padding: '0 0.4rem',
  border: '1px solid var(--rt-color-border)',
  borderRadius: 'var(--rt-radius-sm)',
  background: 'var(--rt-color-surface)',
  color: 'var(--rt-color-text)',
  cursor: 'pointer',  font: 'inherit',
  ':hover': {
    background: 'var(--rt-color-bg)',
  },
  ':disabled': {
    opacity: 0.4,
    cursor: 'default',
  },
})

export const workspaceSelect = style({
  height: '1.9rem',
  padding: '0 0.4rem',
  border: '1px solid var(--rt-color-border)',
  borderRadius: 'var(--rt-radius-sm)',
  background: 'var(--rt-color-surface)',
  color: 'var(--rt-color-text)',
  fontSize: 'var(--rt-font-size-sm)',
  cursor: 'pointer',
})

export const status = style({
  padding: '0.15rem 0.5rem',
  borderRadius: '999px',
  fontSize: 'var(--rt-font-size-sm)',
  fontWeight: 600,
  background: 'var(--rt-color-bg)',
  color: 'var(--rt-color-muted)',
})

export const statusOk = style({
  background: 'var(--rt-color-success)',
  color: '#fff',
})

export const statusErr = style({
  background: 'var(--rt-color-danger)',
  color: '#fff',
})

export const empty = style({
  padding: '3rem',
  textAlign: 'center',
  background: 'var(--rt-color-surface)',
  border: '1px dashed var(--rt-color-border)',
  borderRadius: 'var(--rt-radius)',
})

export const runtimeEmbed = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
})

export const runtimeEmbedContent = style({
  maxWidth: 'none',
})
