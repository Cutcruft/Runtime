import { h } from 'preact'
import { render } from 'preact'
import { configStore } from './store/config'
import { i18nStore } from './store/i18n'
import { themeStore } from './store/theme'
import { sessionStore } from './store/session'
import { routerStore } from './store/router'
import { overlayService } from './overlay/overlayService'
import { loadPluginComponents } from './plugin/pluginLoader'
import { resolveComponent } from './renderer/componentRegistry'
import { emitShortcutAction, initShortcuts, registerShortcut } from './events/ShortcutService'
import { initSubscriptionEngine } from './events/SubscriptionEngine'
import { subscribeEvent } from './events/eventBus'
import { pageStore } from './store/page'
import './styles/global.css'
import type { RuntimeEvent } from './protocol/envelope'

function routeActionEvents(event: RuntimeEvent): void {
  if (event.kind === 'navigation.request') {
    const page = event.payload.page
    if (typeof page === 'string') routerStore.open(page)
  } else if (event.kind === 'command.request') {
    const command = event.payload.command
    if (typeof command === 'string') {
      sessionStore.executeCommand(command, event.payload.params ?? {}).catch(() => {})
    }
  }
}

async function bootstrap(): Promise<void> {
  // V5: boot into the persisted/URL workspace (fall back to default).
  const activeWs = sessionStore.workspaceId ?? readPersistedWorkspace()
  try {
    if (activeWs) {
      await configStore.setWorkspace(activeWs)
    } else {
      await configStore.load()
    }
  } catch (error) {
    console.error('Failed to load workspace config:', error)
  }

  if (!configStore.loaded) return
  await Promise.all([
    configStore.loadShellSections().catch((e) => console.error('Failed to load shell sections:', e)),
    configStore.loadI18n().catch((e) => console.error('Failed to load i18n:', e))
  ])

  i18nStore.init(configStore.i18n)
  themeStore.init()
  routerStore.init()
  overlayService.registerWorkspace(configStore.overlays, configStore.overlayTriggers)

  // V9.3: load module bundles (ui-base app.js + components, editors) into the registry.
  await loadPluginComponents().catch(() => {})

  // Resolve the AppShell primitive registered by the ui-base module.
  const App = resolveComponent('App') ?? resolveComponent('app')
  if (!App) {
    console.error('[main] AppShell (App) not registered — did ui-base module load?')
    return
  }
  render(h(App, null), document.getElementById('app')!)

  sessionStore.init()

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
}

import { initGestureListener } from './events/GestureListener'

function readPersistedWorkspace(): string | null {
  try {
    return localStorage.getItem('cc.workspaceId')
  } catch { return null }
}

bootstrap()
