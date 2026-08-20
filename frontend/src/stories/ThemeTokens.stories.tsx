import type { Meta, StoryObj } from '@storybook/preact'
import { applyTheme, themeStore } from '../store/theme'
import { configStore } from '../store/config'

/**
 * Theme reference — documents the typed workspace theme tokens
 * (palette / typography / radii / spacing / motion) as applied to CSS variables.
 */
const swatches = [
  '--rt-color-bg', '--rt-color-surface', '--rt-color-text', '--rt-color-muted',
  '--rt-color-border', '--rt-color-primary', '--rt-color-primary-hover',
  '--rt-color-danger', '--rt-color-success', '--rt-color-warning', '--rt-color-info'
]

const TokenRow = ({ name }: { name: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
    <span style={{ width: '200px', fontFamily: 'monospace', fontSize: '12px' }}>{name}</span>
    <span
      style={{
        width: '40px', height: '24px', borderRadius: '6px',
        border: '1px solid var(--rt-color-border)', background: `var(${name})`
      }}
    />
    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--rt-color-muted)' }}>
      {getComputedStyle(document.documentElement).getPropertyValue(name).trim()}
    </span>
  </div>
)

const Meta = {
  title: 'Design Tokens/Theme',
  tags: ['autodocs'],
  render: () => {
    if (configStore.loaded) {
      applyTheme()
      themeStore.init()
    }
    return (
      <div style={{ padding: '16px', maxWidth: '720px' }}>
        <h2 style={{ margin: '0 0 8px' }}>Theme tokens</h2>
        <p style={{ color: 'var(--rt-color-muted)' }}>Resolved from the workspace config (typed theme).</p>
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 8px' }}>Palette</h3>
          {swatches.map((name) => <TokenRow key={name} name={name} />)}
        </section>
        <section>
          <h3 style={{ margin: '0 0 8px' }}>Radii & spacing</h3>
          {['--rt-radius-sm', '--rt-radius', '--rt-radius-lg', '--rt-space-xs', '--rt-space-sm', '--rt-space', '--rt-space-lg'].map((name) => (
            <TokenRow key={name} name={name} />
          ))}
        </section>
      </div>
    )
  }
} satisfies Meta

export default Meta

type Story = StoryObj<typeof Meta>

export const Light: Story = {}
