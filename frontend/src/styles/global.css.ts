import { globalStyle } from '@vanilla-extract/css'

// ── ui-button ───────────────────────────────────────────────────

globalStyle('.ui-button', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  border: '1px solid var(--rt-color-border)',
  borderRadius: 'var(--rt-radius-sm)',
  background: 'var(--rt-color-surface)',
  color: 'var(--rt-color-text)',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: 'var(--rt-font-size)',
  transition: 'background 0.15s ease',
})

globalStyle('.ui-button:hover:not(:disabled)', {
  background: 'var(--rt-color-bg)',
})

globalStyle('.ui-button:disabled', {
  opacity: 0.6,
  cursor: 'default',
})

globalStyle('.ui-button__icon', {
  lineHeight: 1,
})

globalStyle('.ui-button__icon--img', {
  width: '1.05em',
  height: '1.05em',
  objectFit: 'contain',
  verticalAlign: '-0.2em',
})

globalStyle('.ui-button__shortcut', {
  marginLeft: '0.35rem',
  padding: '0 0.3rem',
  border: '1px solid currentColor',
  borderRadius: '4px',
  fontSize: '0.65rem',
  opacity: 0.7,
})

globalStyle('.ui-button--small', {
  padding: '0.2rem 0.6rem',
  fontSize: 'var(--rt-font-size-sm)',
})

globalStyle('.ui-button--medium', {
  padding: '0.4rem 0.9rem',
})

globalStyle('.ui-button--large', {
  padding: '0.55rem 1.25rem',
  fontSize: 'var(--rt-font-size-lg)',
})

globalStyle('.ui-button--primary', {
  background: 'var(--rt-color-primary)',
  borderColor: 'var(--rt-color-primary)',
  color: '#fff',
})

globalStyle('.ui-button--primary:hover:not(:disabled)', {
  background: 'var(--rt-color-primary-hover)',
})

globalStyle('.ui-button--danger', {
  background: 'var(--rt-color-surface)',
  borderColor: 'var(--rt-color-danger)',
  color: 'var(--rt-color-danger)',
})

globalStyle('.ui-button--danger:hover:not(:disabled)', {
  background: '#fdecec',
})

globalStyle('[data-theme="dark"] .ui-button--danger:hover:not(:disabled)', {
  background: '#3a1d1d',
})

globalStyle('.ui-button--ghost', {
  background: 'transparent',
  borderColor: 'transparent',
})

globalStyle('.ui-button--ghost:hover:not(:disabled)', {
  background: 'var(--rt-color-bg)',
})

globalStyle('.ui-button--link', {
  background: 'transparent',
  borderColor: 'transparent',
  color: 'var(--rt-color-primary)',
})

globalStyle('.ui-button--link:hover:not(:disabled)', {
  textDecoration: 'underline',
})

// ── ui-badge ────────────────────────────────────────────────────

globalStyle('.ui-badge', {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.1rem 0.55rem',
  borderRadius: '999px',
  fontSize: 'var(--rt-font-size-sm)',
  fontWeight: 600,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
})

globalStyle('.ui-badge--neutral', {
  background: 'var(--rt-color-bg)',
  color: 'var(--rt-color-muted)',
  border: '1px solid var(--rt-color-border)',
})

globalStyle('.ui-badge--gray', {
  background: '#e8eaed',
  color: '#3c4043',
})

globalStyle('.ui-badge--blue', {
  background: '#e3edfb',
  color: '#0052a3',
})

globalStyle('.ui-badge--green', {
  background: '#dff3e3',
  color: '#1b7f3b',
})

globalStyle('.ui-badge--red', {
  background: '#fdecec',
  color: '#b00020',
})

globalStyle('.ui-badge--amber', {
  background: '#fff3d6',
  color: '#8a5a00',
})

globalStyle('.ui-badge--purple', {
  background: '#f0e8fb',
  color: '#6a2bb0',
})

globalStyle('[data-theme="dark"] .ui-badge--gray', {
  background: '#2a2f36',
  color: '#c9cdd1',
})

globalStyle('[data-theme="dark"] .ui-badge--blue', {
  background: '#1d3557',
  color: '#8ec7ff',
})

globalStyle('[data-theme="dark"] .ui-badge--green', {
  background: '#1b3a28',
  color: '#6fdc9a',
})

globalStyle('[data-theme="dark"] .ui-badge--red', {
  background: '#3a1d1d',
  color: '#ff9b9b',
})

globalStyle('[data-theme="dark"] .ui-badge--amber', {
  background: '#3a2f14',
  color: '#ffd27a',
})

globalStyle('[data-theme="dark"] .ui-badge--purple', {
  background: '#2e1f42',
  color: '#c9a3f5',
})
