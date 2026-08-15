import { configStore } from '../store/config'

const LIGHT_TOKENS: Record<string, string> = {
  'color-bg': '#f5f6f8',
  'color-surface': '#ffffff',
  'color-text': '#1c1c1c',
  'color-muted': '#666666',
  'color-border': '#e2e2e2',
  'color-primary': '#0066cc',
  'color-primary-hover': '#0052a3',
  'color-danger': '#b00020',
  'color-success': '#1b7f3b',
  'color-warning': '#b26a00',
  'color-info': '#0066cc',
  'radius-sm': '6px',
  'radius': '8px',
  'radius-lg': '12px',
  'shadow': '0 2px 8px rgba(0, 0, 0, 0.12)',
  'space-xs': '0.25rem',
  'space-sm': '0.5rem',
  'space': '0.75rem',
  'space-lg': '1.25rem',
  'font-size-sm': '0.75rem',
  'font-size': '0.875rem',
  'font-size-lg': '1rem',
  'font-size-xl': '1.25rem'
}

const DARK_TOKENS: Record<string, string> = {
  'color-bg': '#16181d',
  'color-surface': '#1f2329',
  'color-text': '#e8e8e8',
  'color-muted': '#9aa0a6',
  'color-border': '#343a42',
  'color-primary': '#4d9fff',
  'color-primary-hover': '#6fb1ff',
  'color-danger': '#ff6b6b',
  'color-success': '#4cd07d',
  'color-warning': '#ffc24d',
  'color-info': '#4d9fff',
  'radius-sm': '6px',
  'radius': '8px',
  'radius-lg': '12px',
  'shadow': '0 2px 8px rgba(0, 0, 0, 0.4)',
  'space-xs': '0.25rem',
  'space-sm': '0.5rem',
  'space': '0.75rem',
  'space-lg': '1.25rem',
  'font-size-sm': '0.75rem',
  'font-size': '0.875rem',
  'font-size-lg': '1rem',
  'font-size-xl': '1.25rem'
}

export function applyTheme(): void {
  const theme = configStore.theme
  const mode = theme?.mode ?? 'light'
  const root = document.documentElement
  root.dataset.theme = mode
  const tokens = { ...(mode === 'dark' ? DARK_TOKENS : LIGHT_TOKENS), ...(theme?.tokens ?? {}) }
  for (const [name, value] of Object.entries(tokens)) {
    root.style.setProperty(`--rt-${name}`, value)
  }
}
