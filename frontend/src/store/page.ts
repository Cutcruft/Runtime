import { ref, watch } from 'vue'
import { configStore } from './config'
import { globalSingleton } from '../utils/globalSingleton'

const STORAGE_KEY = 'cc.openPages'
const STORAGE_ACTIVE = 'cc.activePage'

const { activePageId, openPages, backStack, forwardStack } = globalSingleton('__cc_page', () => ({
  activePageId: ref<string | null>(null),
  openPages: ref<string[]>([]),
  backStack: ref<string[]>([]),
  forwardStack: ref<string[]>([])
}))

function persistTabs(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(openPages.value))
    if (activePageId.value) localStorage.setItem(STORAGE_ACTIVE, activePageId.value)
    else localStorage.removeItem(STORAGE_ACTIVE)
  } catch { /* localStorage unavailable */ }
}

function loadPersistedTabs(): { openPages: string[]; activePageId: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const pages = raw ? JSON.parse(raw) as string[] : []
    const active = localStorage.getItem(STORAGE_ACTIVE)
    return { openPages: pages, activePageId: active }
  } catch { return { openPages: [], activePageId: null } }
}

function existingIndex(pageId: string): number {
  return openPages.value.indexOf(pageId)
}

export const pageStore = {
  get activePageId(): string | null {
    return activePageId.value
  },
  get openPages(): string[] {
    return openPages.value
  },
  get canGoBack(): boolean {
    return backStack.value.length > 0
  },
  get canGoForward(): boolean {
    return forwardStack.value.length > 0
  },

  init(): void {
    const persisted = loadPersistedTabs()
    if (persisted.openPages.length > 0) {
      const validPageIds = new Set(configStore.pages.map(p => p.id))
      openPages.value = persisted.openPages.filter(id => validPageIds.has(id))
      if (persisted.activePageId && validPageIds.has(persisted.activePageId)) {
        activePageId.value = persisted.activePageId
      } else if (openPages.value.length > 0) {
        activePageId.value = openPages.value[0]
      }
      persistTabs()
    } else {
      const landing = configStore.app?.landingPageId
      if (landing) this.openPage(landing)
    }
  },

  /** Set the active page from a URL deep-link / browser back-forward without touching history stacks. */
  restore(pageId: string): void {
    if (pageId === activePageId.value) return
    if (existingIndex(pageId) === -1) openPages.value.push(pageId)
    activePageId.value = pageId
  },

  openPage(pageId: string): void {
    if (pageId === activePageId.value) return
    const index = existingIndex(pageId)
    if (index === -1) openPages.value.push(pageId)
    if (activePageId.value !== null) backStack.value.push(activePageId.value)
    forwardStack.value = []
    activePageId.value = pageId
  },

  closeTab(pageId: string): void {
    const index = existingIndex(pageId)
    if (index === -1) return
    openPages.value.splice(index, 1)
    backStack.value = backStack.value.filter((id) => id !== pageId)
    forwardStack.value = forwardStack.value.filter((id) => id !== pageId)
    if (activePageId.value === pageId) {
      const next = openPages.value[index] ?? openPages.value[index - 1] ?? null
      activePageId.value = next
      if (next) backStack.value.push(next)
    }
  },

  closeOthers(pageId: string): void {
    openPages.value = [pageId]
    backStack.value = backStack.value.filter((id) => id === pageId)
    forwardStack.value = []
    activePageId.value = pageId
  },

  closeAll(): void {
    openPages.value = []
    backStack.value = []
    forwardStack.value = []
    activePageId.value = null
  },

  back(): void {
    const previous = backStack.value.pop()
    if (previous === undefined) return
    if (activePageId.value !== null) forwardStack.value.push(activePageId.value)
    activePageId.value = previous
    if (existingIndex(previous) === -1) openPages.value.push(previous)
  },

  forward(): void {
    const next = forwardStack.value.pop()
    if (next === undefined) return
    if (activePageId.value !== null) backStack.value.push(activePageId.value)
    activePageId.value = next
    if (existingIndex(next) === -1) openPages.value.push(next)
  }
}

watch([activePageId, openPages], persistTabs, { deep: true })
