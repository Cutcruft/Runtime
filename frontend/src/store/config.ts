import { ref } from 'vue'
import type { WorkspaceConfig } from '../protocol/types'

const config = ref<WorkspaceConfig | null>(null)
let pollTimer: ReturnType<typeof setInterval> | null = null
let lastConfigJson = ''

export const configStore = {
  get value(): WorkspaceConfig | null {
    return config.value
  },
  get loaded(): boolean {
    return config.value !== null
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
  get transport() {
    return config.value?.transport
  },
  get theme() {
    return config.value?.app.theme
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
  async load(): Promise<void> {
    const response = await fetch('/config')
    if (!response.ok) {
      throw new Error(`Failed to load config: HTTP ${response.status}`)
    }
    const data = (await response.json()) as WorkspaceConfig
    config.value = data
    lastConfigJson = JSON.stringify(data)
    this.startPollingIfNeeded()
  },
  startPollingIfNeeded() {
    if (pollTimer) return
    const dev = config.value?.dev
    if (!dev?.enabled || dev.pollIntervalMs <= 0) return
    pollTimer = setInterval(() => {
      this.pollForChanges()
    }, dev.pollIntervalMs)
  },
  async pollForChanges() {
    try {
      const response = await fetch('/config')
      if (!response.ok) return
      const json = await response.text()
      if (json !== lastConfigJson) {
        console.log('[dev] Config changed, reloading...')
        const data = JSON.parse(json) as WorkspaceConfig
        config.value = data
        lastConfigJson = json
      }
    } catch {
      // Silently ignore polling errors
    }
  },
  stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }
}
