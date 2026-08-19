import { createApp } from 'vue'
import App from './App.vue'
import DocsPage from './components/DocsPage.vue'
import './styles/global.css'
import { configStore } from './store/config'
import { i18nStore } from './store/i18n'
import { sessionStore } from './store/session'
import { emitShortcutAction, initShortcuts, registerShortcut } from './events/ShortcutService'
import { initSubscriptionEngine } from './events/SubscriptionEngine'
import { subscribeEvent } from './events/eventBus'
import { overlayService } from './overlay/overlayService'
import { initGestureListener } from './events/GestureListener'
import { loadPluginComponents } from './plugin/pluginLoader'
import { pageStore } from './store/page'
import { routerStore } from './store/router'
import type { RuntimeEvent } from './protocol/envelope'

const isDocs = location.pathname === '/docs'

function routeActionEvents(event: RuntimeEvent): void {
  if (event.kind === 'navigation.request') {
    const page = event.payload.page
    if (typeof page === 'string') routerStore.open(page)
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

  if (isDocs) {
    createApp(DocsPage).mount('#app')
    return
  }

  i18nStore.init(configStore.i18n)
  routerStore.init()
  overlayService.registerWorkspace(configStore.overlays, configStore.overlayTriggers)

  if (!configStore.loaded) return
  createApp(App).mount('#app')

  // Load plugin components after mount — registryVersion is reactive so
  // Container.vue re-evaluates when each plugin registers
  loadPluginComponents().catch(() => { /* individual errors logged by loader */ })

  initGestureListener()
  initShortcuts({
    getActivePage: () => pageStore.activePageId,
    dispatch: emitShortcutAction
  })
  configStore.shortcuts.forEach((shortcut) => registerShortcut(shortcut))
  registerShortcut({ id: 'page.back', keys: ['mod+[', 'alt+left'], action: 'pageBack', scope: 'global' })
  registerShortcut({ id: 'page.forward', keys: ['mod+]', 'alt+right'], action: 'pageForward', scope: 'global' })
  initSubscriptionEngine()
  subscribeEvent(routeActionEvents)
  sessionStore.init()
}

bootstrap()
