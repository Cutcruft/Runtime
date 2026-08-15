import { ref } from 'vue'
import { configStore } from './config'

const activePageId = ref<string | null>(null)
const openPages = ref<string[]>([])
const backStack = ref<string[]>([])
const forwardStack = ref<string[]>([])

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
    const landing = configStore.app?.landingPageId
    if (landing) this.openPage(landing)
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
