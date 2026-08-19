import { watch } from 'vue'
import { configStore } from './config'
import { pageStore } from './page'
import type { RoutingMode } from '../protocol/types'
import { globalSingleton } from '../utils/globalSingleton'

const routerState = globalSingleton('__cc_router', () => ({
  applying: false,
  initialized: false
}))

function pagePath(pageId: string): string {
  return `/page/${encodeURIComponent(pageId)}`
}

function urlFor(pageId: string): string {
  return configStore.routing.mode === 'history' ? pagePath(pageId) : `#${pagePath(pageId)}`
}

function parsePageFromUrl(): string | null {
  const hash = window.location.hash
  if (hash.startsWith('#/page/')) {
    return decodeURIComponent(hash.slice('#/page/'.length))
  }
  const path = window.location.pathname
  if (path.startsWith('/page/')) {
    return decodeURIComponent(path.slice('/page/'.length))
  }
  return null
}

function handleLocationChange(): void {
  const raw = parsePageFromUrl()
  if (raw === null) return
  routerState.applying = true
  try {
    const resolved = resolvePage(raw)
    pageStore.restore(resolved)
    if (resolved !== raw) {
      window.history.replaceState(null, '', urlFor(resolved))
    }
  } finally {
    routerState.applying = false
  }
}

/** Follow `redirects` chains; returns the final page id (or the input when no rule matches). */
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
  get mode(): RoutingMode {
    return configStore.routing.mode
  },

  get isEmbed(): boolean {
    if (window.location.pathname === '/embed') return true
    return new URLSearchParams(window.location.search).has('embed')
  },

  get embedPage(): string | null {
    return new URLSearchParams(window.location.search).get('page')
  },

  /** Navigate to a page, resolving redirects and syncing the URL. */
  open(pageId: string): void {
    pageStore.openPage(resolvePage(pageId))
  },

  init(): void {
    if (routerState.initialized) return
    routerState.initialized = true

    if (this.isEmbed) {
      const target = this.embedPage ?? configStore.app?.landingPageId ?? null
      if (target) pageStore.restore(resolvePage(target))
      return
    }

    const deepLink = parsePageFromUrl()
    if (deepLink) {
      handleLocationChange()
    } else {
      pageStore.init()
    }

    watch(
      () => pageStore.activePageId,
      (pageId) => {
        if (routerState.applying || !pageId) return
        const expected = urlFor(pageId)
        const current = configStore.routing.mode === 'history'
          ? window.location.pathname + window.location.search
          : window.location.hash
        if (current === expected) return
        window.history.pushState(null, '', expected)
      }
    )

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
  }
}
