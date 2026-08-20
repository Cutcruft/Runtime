import { h } from 'preact'
import { render } from 'preact'
import { configStore } from './store/config'
import { i18nStore } from './store/i18n'
import { themeStore } from './store/theme'
import { sessionStore } from './store/session'
import { routerStore } from './store/router'
import { overlayService } from './overlay/overlayService'
import { loadPluginComponents } from './plugin/pluginLoader'
import { emitShortcutAction, initShortcuts, registerShortcut } from './events/ShortcutService'
import { initSubscriptionEngine } from './events/SubscriptionEngine'
import { subscribeEvent } from './events/eventBus'
import { pageStore } from './store/page'
import './styles/global.css'
import './styles/builtin.css'
import type { RuntimeEvent } from './protocol/envelope'

const isDocs = location.pathname === '/docs'

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

  if (isDocs) {
    const { default: DocsPage } = await import('./components/DocsPage')
    render(h(DocsPage, null), document.getElementById('app')!)
    return
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

  await loadPluginComponents().catch(() => {})

  const { default: App } = await import('./App')
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
