import { sessionStore } from '../store/session'
import { dataStore } from '../store/data'
import { toasts } from '../store/toasts'
import { emitPluginEvent, type PluginEvent } from './eventBus'

/**
 * Frontend Entity Store — a reactive, command-backed CRUD API
 * that plugins can use to list, get, create, update, and delete entities.
 *
 * All mutations go through backend commands (sessionStore.execute).
 * The store auto-invalidates caches when mutations succeed.
 */

export interface EntityRecord {
  id: string
  [key: string]: unknown
}

export interface EntityStoreConfig {
  entityType: string
  /** Command ID prefix (e.g. "document" → "document.list", "document.save", etc.) */
  commandPrefix: string
  /** Plugin ID that owns this store */
  pluginId: string
}

export interface EntityListParams {
  filter?: Record<string, unknown>
  sort?: string
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface EntityStoreApi {
  /** List entities, returns rows and total count */
  list(params?: EntityListParams): Promise<{ rows: EntityRecord[]; total: number }>
  /** Get a single entity by ID */
  get(id: string): Promise<EntityRecord | null>
  /** Create a new entity, returns the created record */
  create(data: Record<string, unknown>): Promise<EntityRecord>
  /** Update an existing entity by ID */
  update(id: string, data: Record<string, unknown>): Promise<EntityRecord>
  /** Delete an entity by ID */
  remove(id: string): Promise<void>
  /** Subscribe to entity change events */
  onChange(handler: (event: PluginEvent) => void): () => void
  /** Invalidate the local cache for this entity type */
  invalidate(): void
}

function reportError(command: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  toasts.push({ message: `${command}: ${message}`, kind: 'error' })
}

export function createEntityStore(config: EntityStoreConfig): EntityStoreApi {
  const { entityType, commandPrefix, pluginId } = config

  return {
    async list(params?: EntityListParams): Promise<{ rows: EntityRecord[]; total: number }> {
      try {
        await dataStore.loadList(entityType, `${commandPrefix}.list`, params ?? {})
        const rows = dataStore.rows(entityType) as EntityRecord[]
        return { rows, total: rows.length }
      } catch (error) {
        reportError(`${commandPrefix}.list`, error)
        return { rows: [], total: 0 }
      }
    },

    async get(id: string): Promise<EntityRecord | null> {
      try {
        const result = await sessionStore.execute(`${commandPrefix}.get`, { id })
        if (result.status === 'ERROR' || !result.value) return null
        return result.value as EntityRecord
      } catch (error) {
        reportError(`${commandPrefix}.get`, error)
        return null
      }
    },

    async create(data: Record<string, unknown>): Promise<EntityRecord> {
      try {
        const result = await sessionStore.execute(`${commandPrefix}.save`, { data })
        if (result.status === 'ERROR') throw new Error(result.error ?? 'Create failed')
        dataStore.invalidate(entityType)
        emitPluginEvent({ from: pluginId, name: `${entityType}.created`, payload: result.value })
        return result.value as EntityRecord
      } catch (error) {
        reportError(`${commandPrefix}.save`, error)
        throw error
      }
    },

    async update(id: string, data: Record<string, unknown>): Promise<EntityRecord> {
      try {
        const result = await sessionStore.execute(`${commandPrefix}.save`, { id, data })
        if (result.status === 'ERROR') throw new Error(result.error ?? 'Update failed')
        dataStore.invalidate(entityType)
        emitPluginEvent({ from: pluginId, name: `${entityType}.updated`, payload: result.value })
        return result.value as EntityRecord
      } catch (error) {
        reportError(`${commandPrefix}.save`, error)
        throw error
      }
    },

    async remove(id: string): Promise<void> {
      try {
        const result = await sessionStore.execute(`${commandPrefix}.delete`, { id })
        if (result.status === 'ERROR') throw new Error(result.error ?? 'Delete failed')
        dataStore.invalidate(entityType)
        emitPluginEvent({ from: pluginId, name: `${entityType}.deleted`, payload: { id } })
      } catch (error) {
        reportError(`${commandPrefix}.delete`, error)
        throw error
      }
    },

    onChange(handler: (event: PluginEvent) => void): () => void {
      const unsub1 = import('./eventBus').then(({ onPluginEvent }) =>
        onPluginEvent(`${entityType}.created`, handler)
      )
      const unsub2 = import('./eventBus').then(({ onPluginEvent }) =>
        onPluginEvent(`${entityType}.updated`, handler)
      )
      const unsub3 = import('./eventBus').then(({ onPluginEvent }) =>
        onPluginEvent(`${entityType}.deleted`, handler)
      )
      return () => {
        unsub1.then((fn) => fn())
        unsub2.then((fn) => fn())
        unsub3.then((fn) => fn())
      }
    },

    invalidate(): void {
      dataStore.invalidate(entityType)
    }
  }
}
