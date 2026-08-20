import { globalStyle, style } from '@vanilla-extract/css'

export const docs = style({
  maxWidth: '56rem',
  margin: '0 auto',
  padding: 'var(--rt-space-lg) var(--rt-space)',
  fontFamily: 'var(--rt-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  lineHeight: 1.6
})

globalStyle(`${docs} h1`, {
  margin: '0 0 var(--rt-space-xs)',
  fontSize: '1.75rem'
})

globalStyle(`${docs} h2`, {
  fontSize: '1.25rem',
  margin: '0 0 var(--rt-space-sm)',
  paddingBottom: 'var(--rt-space-xs)',
  borderBottom: '1px solid var(--rt-color-border)'
})

globalStyle(`${docs} h3`, {
  fontSize: '1.05rem',
  margin: '0 0 var(--rt-space-xs)',
  color: 'var(--rt-color-muted)'
})

globalStyle(`${docs} h4`, {
  margin: '0 0 var(--rt-space-xs)',
  fontSize: '0.9rem',
  color: 'var(--rt-color-muted)'
})

globalStyle(`${docs} p`, {
  margin: '0 0 var(--rt-space-sm)'
})

globalStyle(`${docs} table`, {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 'var(--rt-font-size)'
})

globalStyle(`${docs} th, ${docs} td`, {
  textAlign: 'left',
  padding: '0.35rem var(--rt-space-sm)',
  borderBottom: '1px solid var(--rt-color-border)'
})

globalStyle(`${docs} th`, {
  background: 'var(--rt-color-bg)',
  fontWeight: 600,
  fontSize: 'var(--rt-font-size-sm)'
})

globalStyle(`${docs} code`, {
  fontFamily: '"SF Mono", Menlo, monospace',
  fontSize: '0.9em'
})

globalStyle(`${docs} pre`, {
  background: 'var(--rt-color-bg)',
  border: '1px solid var(--rt-color-border)',
  borderRadius: 'var(--rt-radius-sm)',
  padding: 'var(--rt-space-sm)',
  overflowX: 'auto',
  fontSize: '0.85em',
  margin: '0'
})

globalStyle(`${docs} dl`, {
  margin: '0'
})

globalStyle(`${docs} dt`, {
  color: 'var(--rt-color-muted)',
  fontSize: 'var(--rt-font-size-sm)'
})

globalStyle(`${docs} dd`, {
  margin: '0 0 var(--rt-space-xs)'
})

export const subtitle = style({
  margin: '0',
  color: 'var(--rt-color-muted)'
})

export const cmd = style({
  background: 'var(--rt-color-surface)',
  border: '1px solid var(--rt-color-border)',
  borderRadius: 'var(--rt-radius)',
  padding: 'var(--rt-space-sm) var(--rt-space)',
  marginBottom: 'var(--rt-space-sm)'
})

export const cmdHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--rt-space-sm)',
  flexWrap: 'wrap'
})

export const cmdId = style({
  fontWeight: 600
})

export const cmdDesc = style({
  margin: '0.3rem 0 0',
  color: 'var(--rt-color-text)',
  fontSize: 'var(--rt-font-size)'
})

export const badge = style({
  fontSize: '0.7rem',
  padding: '0.1rem 0.4rem',
  borderRadius: 'var(--rt-radius-sm)',
  background: 'var(--rt-color-bg)',
  border: '1px solid var(--rt-color-border)',
  color: 'var(--rt-color-muted)',
  textTransform: 'uppercase'
})

export const badgeMuted = style({
  opacity: 0.7
})

export const params = style({
  marginTop: 'var(--rt-space-sm)'
})

export const steps = style({
  marginTop: 'var(--rt-space-sm)'
})

export const protoEnvelope = style({
  margin: 'var(--rt-space-sm) 0'
})

export const protoExample = style({
  margin: 'var(--rt-space-sm) 0'
})

export const direction = style({
  textTransform: 'capitalize'
})
