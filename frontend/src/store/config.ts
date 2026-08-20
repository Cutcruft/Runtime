import { signal } from '@preact/signals'
import type { WorkspaceConfig } from '../protocol/types'
import { globalSingleton } from '../utils/globalSingleton'

/**
 * Sections of the workspace config fetched separately (V3: /config split).
 * Each maps to the top-level keys of WorkspaceConfiguration it provides.
 */
export const CONFIG_SECTIONS = {
  core: ['app', 'routing', 'transport', 'protocol', 'dev', 'collaboration'],
  pages: ['pages', 'navigation'],
  commands: ['commands'],
  entities: ['entities'],
  i18n: ['i18n'],
  overlays: ['overlays', 'overlayTriggers', 'shortcuts', 'subscriptions'],
  components: ['pluginComponents']
} as const

export type ConfigSection = keyof typeof CONFIG_SECTIONS

const { config, pollState } = globalSingleton('__cc_cfg', () => ({
  config: signal<Partial<WorkspaceConfig> | null>(null),
  pollState: {
    pollTimer: null as ReturnType<typeof setInterval> | null,
    lastConfigJson: '',
    loadedSections: new Set<ConfigSection>()
  }
}))

export const configStore = {
  get value(): Partial<WorkspaceConfig> | null {
    return config.value
  },
  get loaded(): boolean {
    return config.value !== null
  },
  get loadedSections(): Set<ConfigSection> {
    return pollState.loadedSections
  },
  get app() {
    return config.value?.app
  },
  get navigation() {
    return config.value?.navigation ?? []
  },
  get pages() {
    return config.value?.pages ?? []
  },
  get shortcuts() {
    return config.value?.shortcuts ?? []
  },
  get subscriptions() {
    return config.value?.subscriptions ?? []
  },
  get commands() {
    return config.value?.commands ?? []
  },
  get entities() {
    return config.value?.entities ?? []
  },
  get overlays() {
    return config.value?.overlays ?? []
  },
  get overlayTriggers() {
    return config.value?.overlayTriggers ?? []
  },
  get pluginComponents() {
    return config.value?.pluginComponents ?? []
  },
  get transport() {
    return config.value?.transport
  },
  get theme() {
    return config.value?.app?.theme
  },
  get i18n() {
    return config.value?.i18n ?? null
  },
  get routing() {
    return config.value?.routing ?? { mode: 'hash' as const, redirects: [] }
  },
  get protocol() {
    return config.value?.protocol ?? { messages: [] }
  },
  get dev() {
    return config.value?.dev ?? { enabled: false, pollIntervalMs: 0 }
  },
  get collaboration() {
    return config.value?.collaboration ?? { enabled: false, cursorsEnabled: false }
  },

  /** Loads a specific config section from /config/<workspace>/<section> (V3+V5). */
  async loadSection(section: ConfigSection, workspace?: string): Promise<void> {
    const base = workspace ? `/config/${encodeURIComponent(workspace)}` : '/config'
    const response = await fetch(`${base}/${section}`)
    if (!response.ok) {
      throw new Error(`Failed to load config section '${section}': HTTP ${response.status}`)
    }
    const data = (await response.json()) as Partial<WorkspaceConfig>
    // Merge the fetched section's keys into the live config.
    const current = config.value ?? {}
    config.value = { ...current, ...data }
    pollState.loadedSections.add(section)
    if (section === 'core') {
      pollState.lastConfigJson = JSON.stringify(data)
    }
  },

  /**
   * V5: switches the shell to a different workspace. Clears the loaded config and
   * reloads core + shell sections from /config/<workspace>/... The session store
   * must be reconnected to the new workspace (sessionStore.setWorkspace).
   */
  async setWorkspace(workspace: string): Promise<void> {
    this.stopPolling()
    config.value = null
    pollState.loadedSections.clear()
    pollState.lastConfigJson = ''
    await this.loadSection('core', workspace)
    await Promise.all([
      this.loadShellSectionsFor(workspace).catch((e) => console.error('Failed to load shell sections:', e)),
      this.loadSection('i18n', workspace).catch((e) => console.error('Failed to load i18n:', e))
    ])
    this.startPollingIfNeeded()
  },

  async loadShellSectionsFor(workspace: string): Promise<void> {
    const needed: ConfigSection[] = ['pages', 'overlays', 'components', 'commands', 'entities']
    await Promise.all(
      needed.filter((s) => !pollState.loadedSections.has(s)).map((s) => this.loadSection(s, workspace))
    )
  },

  /** Loads core section + i18n (lightweight startup), deferring the rest. */
  async load(): Promise<void> {
    await this.loadSection('core')
    this.startPollingIfNeeded()
  },

  /** Loads the sections needed by the full shell (pages, nav, overlays, components). */
  async loadShellSections(): Promise<void> {
    const needed: ConfigSection[] = ['pages', 'overlays', 'components', 'commands', 'entities']
    await Promise.all(
      needed.filter((s) => !pollState.loadedSections.has(s)).map((s) => this.loadSection(s))
    )
  },

  /** Loads i18n when a workspace context is needed. */
  async loadI18n(): Promise<void> {
    if (pollState.loadedSections.has('i18n')) return
    await this.loadSection('i18n')
  },

  startPollingIfNeeded() {
    if (pollState.pollTimer) return
    const dev = config.value?.dev
    if (!dev?.enabled || dev.pollIntervalMs <= 0) return
    pollState.pollTimer = setInterval(() => {
      this.pollForChanges()
    }, dev.pollIntervalMs)
  },
  async pollForChanges() {
    try {
      // Poll only the core section (lightweight); other sections reload on demand
      // or via the commands.reloaded WS event.
      const response = await fetch('/config/core')
      if (!response.ok) return
      const json = await response.text()
      if (json !== pollState.lastConfigJson) {
        console.log('[dev] Config core changed, reloading...')
        const data = JSON.parse(json) as Partial<WorkspaceConfig>
        const current = config.value ?? {}
        config.value = { ...current, ...data }
        pollState.lastConfigJson = json
      }
    } catch {
      // Silently ignore polling errors
    }
  },
  stopPolling() {
    if (pollState.pollTimer) {
      clearInterval(pollState.pollTimer)
      pollState.pollTimer = null
    }
  }
}
