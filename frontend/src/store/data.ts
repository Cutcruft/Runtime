import { signal } from '@preact/signals'
import { sessionStore } from './session'
import { toasts } from './toasts'
import { globalSingleton } from '../utils/globalSingleton'

interface EntityCache {
  revision: number
  rows: unknown[]
  loading: boolean
  error: string | null
}

const caches = globalSingleton('__cc_data', () => signal(new Map<string, EntityCache>()))

/** Memoized per-entity revision signals so components can react to changes. */
const revisionSignals = new Map<string, ReturnType<typeof signal<number>>>()

function updateCache(entityType: string, updater: (cache: EntityCache) => void): void {
  const current = caches.value
  const cache = current.get(entityType) ?? { revision: 0, rows: [], loading: false, error: null }
  updater(cache)
  const next = new Map(current)
  next.set(entityType, cache)
  caches.value = next
  revisionSignal(entityType).value = cache.revision
}

/** Returns a reactive signal whose value is the entity's revision. */
function revisionSignal(entityType: string) {
  let sig = revisionSignals.get(entityType)
  if (!sig) {
    sig = signal(0)
    revisionSignals.set(entityType, sig)
  }
  return sig
}

export const dataStore = {
  get caches(): Map<string, EntityCache> {
    return caches.value
  },
  invalidate(entityType: string): void {
    updateCache(entityType, c => { c.revision += 1 })
  },
  revision(entityType: string): number {
    return caches.value.get(entityType)?.revision ?? 0
  },
  /** Reactive revision signal for `entityType` — components subscribe to this. */
  revisionSignal(entityType: string): ReturnType<typeof signal<number>> {
    return revisionSignal(entityType)
  },
  rows(entityType: string): unknown[] {
    return caches.value.get(entityType)?.rows ?? []
  },
  loading(entityType: string): boolean {
    return caches.value.get(entityType)?.loading ?? false
  },
  error(entityType: string): string | null {
    return caches.value.get(entityType)?.error ?? null
  },
  async loadList(entityType: string, command: string, params: unknown): Promise<void> {
    updateCache(entityType, c => { c.loading = true; c.error = null })
    // Subscribe to server-side object.changed for this entity type so subsequent
    // mutations refresh the cache without a manual reload.
    sessionStore.subscribe(entityType)
    try {
      const result = await sessionStore.execute(command, params ?? {})
      if (result.status === 'ERROR') {
        updateCache(entityType, c => { c.error = result.error ?? 'Command failed'; c.rows = [] })
      } else {
        updateCache(entityType, c => { c.rows = Array.isArray(result.value) ? result.value : [] })
      }
    } catch (error) {
      updateCache(entityType, c => { c.error = String(error); c.rows = [] })
    } finally {
      updateCache(entityType, c => { c.loading = false })
    }
  },
  clearAll(): void {
    caches.value = new Map()
  },
  refreshAll(): void {
    const next = new Map(caches.value)
    for (const [key, cache] of next) {
      next.set(key, { ...cache, revision: cache.revision + 1 })
    }
    caches.value = next
    for (const [key, cache] of next) revisionSignal(key).value = cache.revision
  },
  reportCommandError(command: string, error: unknown): void {
    toasts.push({ message: `Command '${command}' failed: ${String(error)}`, kind: 'error' })
  }
}

