import { useSignal, computed } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { configStore } from '@cutcrft/plugin-sdk'
import { sessionStore } from '@cutcrft/plugin-sdk'
import { dataStore } from '@cutcrft/plugin-sdk'
import { i18nStore } from '@cutcrft/plugin-sdk'
import { pageStore } from '@cutcrft/plugin-sdk'
import { routerStore } from '@cutcrft/plugin-sdk'
import { themeStore } from '@cutcrft/plugin-sdk'
import { Page } from './primitives/Page'
import { ToastViewport } from './primitives/Toast'
import { Tabs } from './primitives/Tabs'
import { CommandPalette } from './components/CommandPalette'
import { Sidebar } from './components/Sidebar'
import { OverlayHost } from './overlay/OverlayHost'
import * as styles from './styles/app.css'

function isHttpLogo(logo: string): boolean {
  return logo.startsWith('http') || logo.startsWith('data:')
}

export default function App() {
  const t = i18nStore.t
  const tr = i18nStore.tr

  const app = computed(() => configStore.app)
  const layout = computed(() => app.value?.layout ?? 'topbar')
  const connected = computed(() => sessionStore.isConnected)
  const projectId = computed(() => sessionStore.projectId)
  const title = computed(() => tr(app.value?.title ?? 'Runtime'))
  const logo = computed(() => {
    const value = app.value?.logo
    return value && isHttpLogo(value) ? value : undefined
  })
  const drawerOpen = useSignal(false)
  const workspaces = useSignal<string[]>([])

  // V7.4: plugin-declared shell actions (from App definition).
  const shellActions = computed(() => configStore.app?.shell?.topbar?.actions ?? [])
  const hasCustomShell = computed(() => shellActions.value.length > 0)

  async function runShellAction(action: {
    action: string
    command?: string
    params?: Record<string, unknown>
    page?: string
  }): Promise<void> {
    if (action.action === 'navigate' && action.page) {
      routerStore.open(action.page)
      drawerOpen.value = false
    } else if (action.action === 'command' && action.command) {
      await sessionStore.executeCommand(action.command, action.params ?? {})
    }
  }

  useEffect(() => {
    fetch('/workspaces')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { workspaces?: string[] } | null) => {
        if (data?.workspaces?.length) workspaces.value = data.workspaces
      })
      .catch(() => {})
  }, [])

  async function switchWorkspace(id: string): Promise<void> {
    if (id === sessionStore.workspaceId) return
    await sessionStore.setWorkspace(id)
    // Full reload boots into the persisted workspace with all shell state reset.
    location.reload()
  }

  const activePage = computed(() =>
    configStore.pages.find((page) => page.id === pageStore.activePageId)
  )

  const pageContext = computed(() => ({ page: pageStore.activePageId }))
  const themeLabel = computed(() => {
    switch (themeStore.mode) {
      case 'dark': return '☾'
      case 'light': return '☀'
      default: return '◐'
    }
  })

  function navigateTo(pageId: string | undefined): void {
    if (pageId) {
      routerStore.open(pageId)
      drawerOpen.value = false
    }
  }

  async function createProject(): Promise<void> {
    try {
      await sessionStore.createProject()
    } catch (error) {
      dataStore.reportCommandError('project.create', error)
    }
  }

  useEffect(() => {
    themeStore.init()
  }, [])

  if (routerStore.isEmbed) {
    return (
      <div class={`${styles.runtime} ${styles.runtimeEmbed}`}>
        <main class={styles.content}>
          <div class={styles.contentPage}>
            {activePage.value ? (
              <Page key={activePage.value.id} page={activePage.value} context={pageContext.value} />
            ) : (
              <div class={styles.empty}><p>{t('core.app.pageNotFound')}</p></div>
            )}
          </div>
        </main>
        <ToastViewport />
        <CommandPalette />
        <OverlayHost />
      </div>
    )
  }

  return (
    <div class={`${styles.runtime} ${styles.runtime}`}>
      <header class={styles.topbar}>
        {layout.value === 'sidebar' && (
          <button
            class={styles.button}
            aria-expanded={drawerOpen.value}
            aria-label="Toggle navigation"
            onClick={() => { drawerOpen.value = !drawerOpen.value }}
          >☰</button>
        )}
        <div class={styles.brand}>
          {logo.value && <img src={logo.value} class={styles.logo} alt="" />}
          <h1 class={styles.title}>{title.value}</h1>
        </div>
        {layout.value !== 'sidebar' && (
          <nav class={styles.nav}>
            {configStore.navigation.map((item) => (
              <a
                key={item.id}
                class={`${styles.link}${pageStore.activePageId === item.pageId ? ` ${styles.linkActive}` : ''}`}
                onClick={(e: Event) => { e.preventDefault(); navigateTo(item.pageId) }}
              >
                {tr(item.label)}
              </a>
            ))}
          </nav>
        )}
        <div class={styles.actions}>
          {hasCustomShell.value ? (
            <>
              {workspaces.value.length > 1 ? (
                <select
                  class={styles.workspaceSelect}
                  value={sessionStore.workspaceId ?? 'default'}
                  title="Workspace"
                  onChange={(e: Event) => switchWorkspace((e.target as HTMLSelectElement).value)}
                >
                  {workspaces.value.map((id) => <option key={id} value={id}>{id}</option>)}
                </select>
              ) : null}
              {shellActions.value.map((action) => (
                <button
                  key={action.id}
                  class={styles.button}
                  title={action.label}
                  onClick={() => runShellAction(action)}
                >{action.icon ?? action.label}</button>
              ))}
            </>
          ) : (
            <>
              <button
                class={styles.button}
                disabled={!pageStore.canGoBack}
                title="Back"
                onClick={() => pageStore.back()}
              >←</button>
              <button
                class={styles.button}
                disabled={!pageStore.canGoForward}
                title="Forward"
                onClick={() => pageStore.forward()}
              >→</button>
              <button
                class={styles.button}
                title={`Theme: ${themeStore.mode}`}
                onClick={() => themeStore.cycle()}
              >{themeLabel.value}</button>
            </>
          )}
          <span class={`${styles.status} ${connected.value ? styles.statusOk : styles.statusErr}`}>
            {connected.value ? t('core.app.online') : t('core.app.offline')}
          </span>
          {projectId.value && <span class={styles.status}>{projectId.value.slice(0, 8)}</span>}
          {!projectId.value && (
            <button class="ui-button ui-button--primary" onClick={createProject}>
              {t('core.app.newProject')}
            </button>
          )}
        </div>
      </header>

      <div class={styles.body}>
        {layout.value === 'sidebar' && (
          <Sidebar open={drawerOpen.value} onClose={() => { drawerOpen.value = false }} />
        )}
        <main class={styles.content}>
          {pageStore.openPages.length > 0 && <Tabs />}
          {!projectId.value ? (
            <div class={styles.contentPage}>
              <div class={styles.empty}>
                <p>{t('core.app.noProject')}</p>
                <button class="ui-button ui-button--primary" onClick={createProject}>
                  {t('core.app.createProject')}
                </button>
              </div>
            </div>
          ) : activePage.value ? (
            <div class={`${styles.contentPage}${layout.value === 'sidebar' ? '' : ''}`}>
              <Page key={activePage.value.id} page={activePage.value} context={pageContext.value} />
            </div>
          ) : (
            <div class={styles.contentPage}>
              <div class={styles.empty}><p>{t('core.app.pageNotFound')}</p></div>
            </div>
          )}
        </main>
      </div>

      <ToastViewport />
      <CommandPalette />
      <OverlayHost />
    </div>
  )
}
