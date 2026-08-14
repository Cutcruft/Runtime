import { createApp } from 'vue'
import App from './App.vue'

export interface WorkspaceConfig {
  navigation: Array<{ id: string; label: string; pageId?: string }>
  pages: Array<{ id: string; title: string }>
  components: Array<{ type: string; config: Record<string, any> }>
  commands: Array<{ id: string; description: string }>
  entities: Array<{ type: string }>
}

const app = createApp(App)

async function init() {
  try {
    const response = await fetch('/config')
    const config = (await response.json()) as WorkspaceConfig
    app.config.globalProperties.$config = config
    app.provide('config', config)
  } catch (e) {
    console.error('Failed to load workspace config:', e)
  }
  app.mount('#app')
}

init()
