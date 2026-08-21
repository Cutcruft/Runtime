import { signal } from '@preact/signals'
import { globalSingleton } from '../utils/globalSingleton'

export interface RemoteCursor {
  sessionId: string
  name: string
  color: string
  entityType: string
  objectId: string
  position: unknown
  selection?: unknown
  lastSeen: number
}

type Listener = () => void

interface CursorState {
  cursors: Map<string, RemoteCursor>
}

const { state, listeners } = globalSingleton('__cc_cursor', () => ({
  state: signal<CursorState>({ cursors: new Map() }),
  listeners: new Set<Listener>()
}))

const STALE_MS = 10_000

function notify(): void {
  for (const fn of listeners) fn()
}

export const cursorStore = {
  get all(): RemoteCursor[] {
    return Array.from(state.value.cursors.values())
  },

  getCursorsForObject(entityType: string, objectId: string): RemoteCursor[] {
    return this.all.filter(c => c.entityType === entityType && c.objectId === objectId)
  },

  getCursorsBySession(sessionId: string): RemoteCursor[] {
    return this.all.filter(c => c.sessionId === sessionId)
  },

  updateCursor(cursor: Omit<RemoteCursor, 'lastSeen'>) {
    const next = new Map(state.value.cursors)
    next.set(cursor.sessionId, { ...cursor, lastSeen: Date.now() })
    state.value = { cursors: next }
    notify()
  },

  removeCursor(sessionId: string) {
    const next = new Map(state.value.cursors)
    next.delete(sessionId)
    state.value = { cursors: next }
    notify()
  },

  removeObjectCursors(entityType: string, objectId: string) {
    const next = new Map(state.value.cursors)
    for (const [key, cursor] of next) {
      if (cursor.entityType === entityType && cursor.objectId === objectId) {
        next.delete(key)
      }
    }
    state.value = { cursors: next }
    notify()
  },

  purgeStale() {
    const now = Date.now()
    const next = new Map(state.value.cursors)
    for (const [key, cursor] of next) {
      if (now - cursor.lastSeen > STALE_MS) {
        next.delete(key)
      }
    }
    state.value = { cursors: next }
    notify()
  },

  clear() {
    state.value = { cursors: new Map() }
    notify()
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn)
    return () => { listeners.delete(fn) }
  }
}
