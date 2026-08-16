import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'
import { configStore } from './store/config'
import { i18nStore } from './store/i18n'
import { sessionStore } from './store/session'
import { registerBuiltinComponents } from './renderer/componentRegistry'
import { emitShortcutAction, initShortcuts, registerShortcut } from './events/ShortcutService'
import { initSubscriptionEngine } from './events/SubscriptionEngine'
import { subscribeEvent } from './events/eventBus'
import { overlayService } from './overlay/overlayService'
import { initGestureListener } from './events/GestureListener'
import { registerEditor } from './editor/editorRegistry'
import { pageStore } from './store/page'
import { routerStore } from './store/router'
import type { RuntimeEvent } from './protocol/envelope'

registerBuiltinComponents()
registerEditor('richtext', () => import('./editor/UiRichText.vue'))
registerEditor('diagram', () => import('./editor/UiDiagram.vue'))
registerEditor('scene3d', () => import('./editor/UiScene3D.vue'))
registerEditor('canvas2d', () => import('./editor/UiCanvas.vue'))

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

  i18nStore.init(configStore.i18n)
  routerStore.init()
  overlayService.registerWorkspace(configStore.overlays, configStore.overlayTriggers)
  createApp(App).mount('#app')

  if (!configStore.loaded) return

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
