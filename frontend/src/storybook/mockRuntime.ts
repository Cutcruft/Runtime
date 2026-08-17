import { registerBuiltinComponents } from '../renderer/componentRegistry'
import { configToUiDocsCatalog } from './configAdapter'
import type { WorkspaceConfig } from '../protocol/types'
import type { ThemeMode } from '../store/theme'

const runtimeConfig: WorkspaceConfig = {
  app: {
    title: 'Runtime UIDocs',
    logo: null,
    layout: 'sidebar',
    landingPageId: 'uidocs',
    theme: {
      mode: 'auto',
      tokens: {
        'color-bg.light': '#f5f6f8',
        'color-bg.dark': '#16181d',
        'color-surface.light': '#ffffff',
        'color-surface.dark': '#1f2329',
        'color-text.light': '#1c1c1c',
        'color-text.dark': '#e8e8e8',
        'color-muted.light': '#666666',
        'color-muted.dark': '#9aa0a6',
        'color-border.light': '#e2e2e2',
        'color-border.dark': '#343a42',
        'color-primary.light': '#0066cc',
        'color-primary.dark': '#4d9fff',
        'radius-sm': '6px',
        'radius': '8px',
        'radius-lg': '12px',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space': '0.75rem',
        'space-lg': '1.25rem',
        'font-size-sm': '0.75rem',
        'font-size': '0.875rem',
        'font-size-lg': '1rem',
        'font-size-xl': '1.25rem'
      }
    }
  },
  navigation: [],
  pages: [
    {
      id: 'uidocs',
      title: 'UIDocs',
      sections: [
        {
          id: 'basic',
          layout: 'grid',
          columns: 2,
          components: [
            { type: 'Text', config: { text: 'Runtime themed text' } },
            { type: 'Button', config: { label: 'Run command', tone: 'primary' } },
            { type: 'Card', config: { title: 'Card from /config-shaped fixture', components: [{ type: 'Badge', config: { label: 'UIDocs', tone: 'blue' } }] } }
          ]
        }
      ]
    }
  ],
  shortcuts: [],
  subscriptions: [],
  commands: [],
  entities: [],
  overlays: [],
  overlayTriggers: [],
  i18n: { defaultLocale: 'en', locales: ['en'], messages: { en: {} } },
  transport: { wsPath: '/ws' },
  routing: { mode: 'hash', redirects: [] },
  protocol: { messages: [] },
  dev: { enabled: true, pollIntervalMs: 1000 },
  collaboration: { enabled: false, cursorsEnabled: false }
}

const catalog = configToUiDocsCatalog(runtimeConfig)
let registered = false

function effectiveMode(mode: unknown): 'light' | 'dark' {
  if (mode === 'dark') return 'dark'
  if (mode === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyStorybookRuntime(mode: unknown = runtimeConfig.app.theme.mode): void {
  if (!registered) {
    registerBuiltinComponents()
    registered = true
  }
  const current = effectiveMode(mode as ThemeMode)
  const root = document.documentElement
  root.dataset.theme = current
  for (const [name, value] of Object.entries(catalog.theme.tokens)) {
    if (name.endsWith('.light') && current !== 'light') continue
    if (name.endsWith('.dark') && current !== 'dark') continue
    root.style.setProperty(`--rt-${name.replace(/\.(light|dark)$/, '')}`, value)
  }
}

export { runtimeConfig as mockWorkspaceConfig, catalog as mockUiDocsCatalog }
