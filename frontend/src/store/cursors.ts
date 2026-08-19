import { reactive } from 'vue'
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
  state: reactive<CursorState>({ cursors: new Map() }),
  listeners: new Set<Listener>()
}))

const STALE_MS = 10_000

function notify(): void {
  for (const fn of listeners) fn()
}

export const cursorStore = {
  get all(): RemoteCursor[] {
    return Array.from(state.cursors.values())
  },

  getCursorsForObject(entityType: string, objectId: string): RemoteCursor[] {
    return this.all.filter(c => c.entityType === entityType && c.objectId === objectId)
  },

  getCursorsBySession(sessionId: string): RemoteCursor[] {
    return this.all.filter(c => c.sessionId === sessionId)
  },

  updateCursor(cursor: Omit<RemoteCursor, 'lastSeen'>) {
    state.cursors.set(cursor.sessionId, {
      ...cursor,
      lastSeen: Date.now()
    })
    notify()
  },

  removeCursor(sessionId: string) {
    state.cursors.delete(sessionId)
    notify()
  },

  removeObjectCursors(entityType: string, objectId: string) {
    for (const [key, cursor] of state.cursors) {
      if (cursor.entityType === entityType && cursor.objectId === objectId) {
        state.cursors.delete(key)
      }
    }
    notify()
  },

  purgeStale() {
    const now = Date.now()
    for (const [key, cursor] of state.cursors) {
      if (now - cursor.lastSeen > STALE_MS) {
        state.cursors.delete(key)
      }
    }
    notify()
  },

  clear() {
    state.cursors.clear()
    notify()
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn)
    return () => { listeners.delete(fn) }
  }
}
