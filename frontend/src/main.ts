import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'
import { configStore } from './store/config'
import { sessionStore } from './store/session'
import { registerBuiltinComponents } from './renderer/componentRegistry'
import { emitShortcutAction, initShortcuts, registerShortcut } from './events/ShortcutService'
import { initSubscriptionEngine } from './events/SubscriptionEngine'
import { subscribeEvent } from './events/eventBus'
import type { RuntimeEvent } from './protocol/envelope'

registerBuiltinComponents()

function routeActionEvents(event: RuntimeEvent): void {
  if (event.kind === 'navigation.request') {
    const page = event.payload.page
    if (typeof page === 'string') configStore.navigate(page)
  } else if (event.kind === 'command.request') {
    const command = event.payload.command
    if (typeof command === 'string') {
      sessionStore.executeCommand(command, event.payload.params ?? {}).catch(() => {
        /* error toast already shown by the session store */
      })
    }
  }
}

async function bootstrap(): Promise<void> {
  try {
    await configStore.load()
  } catch (error) {
    console.error('Failed to load workspace config:', error)
  }

  createApp(App).mount('#app')

  if (!configStore.loaded) return

  initShortcuts({
    getActivePage: () => configStore.activePageId,
    dispatch: emitShortcutAction
  })
  configStore.shortcuts.forEach((shortcut) => registerShortcut(shortcut))
  initSubscriptionEngine()
  subscribeEvent(routeActionEvents)
  sessionStore.init()
}

bootstrap()
