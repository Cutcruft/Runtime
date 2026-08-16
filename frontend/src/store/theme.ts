import { ref } from 'vue'
import { configStore } from './config'

export type ThemeMode = 'auto' | 'light' | 'dark'

const STORAGE_KEY = 'cc.theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')
const mode = ref<ThemeMode>(loadMode())

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

function loadMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
  return 'auto'
}

function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'auto' ? (media.matches ? 'dark' : 'light') : mode
}

export function applyTheme(): void {
  const effective = resolveMode(mode.value)
  const root = document.documentElement
  root.dataset.theme = effective
  const tokens = {
    ...(effective === 'dark' ? DARK_TOKENS : LIGHT_TOKENS)
  }
  for (const [name, value] of Object.entries(configStore.theme?.tokens ?? {})) {
    if (name.endsWith('.light') && effective !== 'light') continue
    if (name.endsWith('.dark') && effective !== 'dark') continue
    tokens[name.replace(/\.(light|dark)$/, '')] = value
  }
  for (const [name, value] of Object.entries(tokens)) {
    root.style.setProperty(`--rt-${name}`, value)
  }
}

export const themeStore = {
  get mode(): ThemeMode {
    return mode.value
  },
  setMode(next: ThemeMode): void {
    mode.value = next
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme()
  },
  cycle(): void {
    const order: ThemeMode[] = ['light', 'dark', 'auto']
    const index = order.indexOf(mode.value)
    this.setMode(order[(index + 1) % order.length])
  },
  init(): void {
    media.addEventListener('change', () => {
      if (mode.value === 'auto') applyTheme()
    })
    applyTheme()
  }
}
