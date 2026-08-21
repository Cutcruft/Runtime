import { signal } from '@preact/signals'
import { configStore } from './config'
import { globalSingleton } from '../utils/globalSingleton'
import type { AppTheme } from '../protocol/types'

export type ThemeMode = 'auto' | 'light' | 'dark'

const STORAGE_KEY = 'cc.theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')

const { mode, pluginTokens } = globalSingleton('__cc_theme', () => ({
  mode: signal<ThemeMode>(loadMode()),
  pluginTokens: new Map<string, Record<string, string>>()
}))

/**
 * Fallback palette used when the workspace config does not declare a typed theme.
 * Keyed by resolved mode (light/dark).
 */
const DEFAULT_PALETTES: Record<'light' | 'dark', Record<string, string>> = {
  light: {
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
    'color-info': '#0066cc'
  },
  dark: {
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
    'color-info': '#4d9fff'
  }
}

const DEFAULT_RADII: Record<string, string> = { sm: '6px', md: '8px', lg: '12px', xl: '16px' }
const DEFAULT_SPACING: Record<string, string> = { xs: '4px', sm: '8px', md: '12px', lg: '20px', xl: '32px' }

function loadMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
  return 'auto'
}

function resolveMode(m: ThemeMode): 'light' | 'dark' {
  return m === 'auto' ? (media.matches ? 'dark' : 'light') : m
}

/** Flattens the typed workspace theme into flat --rt-* token values. */
function flattenTypedTheme(effective: 'light' | 'dark'): Record<string, string> {
  const theme: AppTheme | undefined = configStore.theme
  if (!theme) return {}

  const tokens: Record<string, string> = {}

  // Palette: prefer typed semantic roles, fall back to raw tokens / defaults.
  const palette = theme.palette?.[effective]
  if (palette) {
    const map: Record<string, string> = {
      'color-bg': palette.bg,
      'color-surface': palette.surface,
      'color-text': palette.text,
      'color-muted': palette.muted,
      'color-border': palette.border,
      'color-primary': palette.primary,
      'color-primary-hover': palette.primaryHover,
      'color-danger': palette.danger,
      'color-success': palette.success,
      'color-warning': palette.warning,
      'color-info': palette.info
    }
    Object.assign(tokens, map)
  } else {
    // Legacy: use flat tokens with .light/.dark suffix semantics, else defaults.
    Object.assign(tokens, DEFAULT_PALETTES[effective])
    for (const [name, value] of Object.entries(theme.tokens ?? {})) {
      if (name.endsWith('.light') && effective !== 'light') continue
      if (name.endsWith('.dark') && effective !== 'dark') continue
      tokens[name.replace(/\.(light|dark)$/, '')] = value
    }
  }

  // Typography
  const typography = theme.typography ?? {}
  if (typography.fontFamily) tokens['font-family'] = typography.fontFamily
  if (typography.headingFont) tokens['heading-font'] = typography.headingFont
  if (typography.monospaceFont) tokens['monospace-font'] = typography.monospaceFont
  if (typography.baseSize) tokens['font-size'] = typography.baseSize
  if (typography.scale) {
    for (const [name, value] of Object.entries(typography.scale)) tokens[`font-size-${name}`] = value
  }

  // Radii
  const radii = theme.radii ?? {}
  for (const [name, value] of Object.entries(DEFAULT_RADII)) tokens[`radius-${name}`] = radii[name as keyof typeof radii] ?? value
  tokens['radius'] = radii['md' as keyof typeof radii] ?? DEFAULT_RADII['md']

  // Spacing
  const spacing = theme.spacing ?? {}
  for (const [name, value] of Object.entries(DEFAULT_SPACING)) tokens[`space-${name}`] = spacing[name as keyof typeof spacing] ?? value
  tokens['space'] = spacing['md' as keyof typeof spacing] ?? DEFAULT_SPACING['md']

  // Motion
  const motion = theme.motion ?? {}
  if (motion.duration) {
    for (const [name, value] of Object.entries(motion.duration)) tokens[`duration-${name}`] = value
  }
  if (motion.easing) {
    for (const [name, value] of Object.entries(motion.easing)) tokens[`easing-${name}`] = value
  }

  // Raw token overrides (highest priority within config).
  for (const [name, value] of Object.entries(theme.tokens ?? {})) {
    if (name.endsWith('.light') && effective !== 'light') continue
    if (name.endsWith('.dark') && effective !== 'dark') continue
    tokens[name.replace(/\.(light|dark)$/, '')] = value
  }

  return tokens
}

export function applyTheme(): void {
  const effective = resolveMode(mode.value)
  const root = document.documentElement
  root.dataset.theme = effective
  const tokens = flattenTypedTheme(effective)
  // Plugin-contributed tokens (highest priority).
  for (const [, pluginTokenMap] of pluginTokens) {
    for (const [name, value] of Object.entries(pluginTokenMap)) {
      tokens[name] = value
    }
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
  },

  /** Register plugin-contributed theme tokens. Returns an unregister function. */
  registerPluginTokens(pluginId: string, tokens: Record<string, string>): () => void {
    pluginTokens.set(pluginId, tokens)
    applyTheme()
    return () => {
      pluginTokens.delete(pluginId)
      applyTheme()
    }
  },

  /** Get the resolved value of a theme token */
  getToken(name: string): string | undefined {
    return getComputedStyle(document.documentElement).getPropertyValue(`--rt-${name}`).trim() || undefined
  },

  /** Get all currently resolved token values */
  getTokens(): Record<string, string> {
    const style = getComputedStyle(document.documentElement)
    const result: Record<string, string> = {}
    for (let i = 0; i < style.length; i++) {
      const prop = style[i]
      if (prop.startsWith('--rt-')) {
        result[prop.slice(5)] = style.getPropertyValue(prop).trim()
      }
    }
    return result
  }
}
