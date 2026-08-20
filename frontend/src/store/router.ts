import { configStore } from './config'
import { pageStore } from './page'

export function resolvePage(pageId: string): string {
  const redirects = configStore.routing.redirects
  if (redirects.length === 0) return pageId
  const visited = new Set<string>()
  let current = pageId
  while (!visited.has(current)) {
    visited.add(current)
    const rule = redirects.find((entry) => entry.from === current)
    if (!rule) return current
    current = rule.to
  }
  return current
}

export const routerStore = {
  get isEmbed(): boolean {
    return window.location.pathname === '/embed'
  },

  get embedPage(): string | null {
    return new URLSearchParams(window.location.search).get('page')
  },

  open(pageId: string): void {
    pageStore.openPage(resolvePage(pageId))
  },

  init(): void {
    if (routerStore.isEmbed) {
      const target = routerStore.embedPage ?? configStore.app?.landingPageId ?? null
      if (target) pageStore.openPage(resolvePage(target))
    } else {
      pageStore.init()
    }
  }
}
