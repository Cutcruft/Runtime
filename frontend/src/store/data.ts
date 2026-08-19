import { reactive } from 'vue'
import { sessionStore } from './session'
import { toasts } from './toasts'
import { globalSingleton } from '../utils/globalSingleton'

interface EntityCache {
  revision: number
  rows: unknown[]
  loading: boolean
  error: string | null
}

const caches = globalSingleton('__cc_data', () => reactive(new Map<string, EntityCache>()))

function ensure(entityType: string): EntityCache {
  let cache = caches.get(entityType)
  if (!cache) {
    cache = { revision: 0, rows: [], loading: false, error: null }
    caches.set(entityType, cache)
  }
  return cache
}

export const dataStore = {
  get caches(): Map<string, EntityCache> {
    return caches
  },
  invalidate(entityType: string): void {
    ensure(entityType).revision += 1
  },
  revision(entityType: string): number {
    return ensure(entityType).revision
  },
  rows(entityType: string): unknown[] {
    return ensure(entityType).rows
  },
  loading(entityType: string): boolean {
    return ensure(entityType).loading
  },
  error(entityType: string): string | null {
    return ensure(entityType).error
  },
  async loadList(entityType: string, command: string, params: unknown): Promise<void> {
    const cache = ensure(entityType)
    cache.loading = true
    cache.error = null
    try {
      const result = await sessionStore.execute(command, params ?? {})
      if (result.status === 'ERROR') {
        cache.error = result.error ?? 'Command failed'
        cache.rows = []
      } else {
        cache.rows = Array.isArray(result.value) ? result.value : []
      }
    } catch (error) {
      cache.error = String(error)
      cache.rows = []
    } finally {
      cache.loading = false
    }
  },
  clearAll(): void {
    caches.clear()
  },
  refreshAll(): void {
    caches.forEach((cache) => {
      cache.revision += 1
    })
  },
  reportCommandError(command: string, error: unknown): void {
    toasts.push({ message: `Command '${command}' failed: ${String(error)}`, kind: 'error' })
  }
}
