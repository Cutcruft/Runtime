import { ref } from 'vue'
import type { WorkspaceConfig } from '../protocol/types'

const config = ref<WorkspaceConfig | null>(null)

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
  async load(): Promise<void> {
    const response = await fetch('/config')
    if (!response.ok) {
      throw new Error(`Failed to load config: HTTP ${response.status}`)
    }
    const data = (await response.json()) as WorkspaceConfig
    config.value = data
  }
}
