/**
 * AuditLog — in-memory undo/redo stack for plugin actions.
 * Each plugin gets its own audit log instance.
 */

export interface AuditEntry {
  id: string
  description: string
  timestamp: number
  data?: unknown
}

export interface AuditLogApi {
  /** Push a new action to the audit log */
  push(description: string, data?: unknown): AuditEntry
  /** Undo the last action, returns the undone entry */
  undo(): AuditEntry | null
  /** Redo the last undone action, returns the redone entry */
  redo(): AuditEntry | null
  /** Check if undo is available */
  canUndo(): boolean
  /** Check if redo is available */
  canRedo(): boolean
  /** Get the undo stack */
  undoStack(): AuditEntry[]
  /** Get the redo stack */
  redoStack(): AuditEntry[]
  /** Clear all history */
  clear(): void
}

let idCounter = 0

export function createAuditLog(maxSize: number = 100): AuditLogApi {
  const undoStack: AuditEntry[] = []
  const redoStack: AuditEntry[] = []

  return {
    push(description: string, data?: unknown): AuditEntry {
      const entry: AuditEntry = {
        id: `audit_${++idCounter}`,
        description,
        timestamp: Date.now(),
        data
      }
      undoStack.push(entry)
      // Clear redo stack on new action
      redoStack.length = 0
      // Enforce max size
      if (undoStack.length > maxSize) {
        undoStack.splice(0, undoStack.length - maxSize)
      }
      return entry
    },

    undo(): AuditEntry | null {
      const entry = undoStack.pop()
      if (!entry) return null
      redoStack.push(entry)
      return entry
    },

    redo(): AuditEntry | null {
      const entry = redoStack.pop()
      if (!entry) return null
      undoStack.push(entry)
      return entry
    },

    canUndo(): boolean {
      return undoStack.length > 0
    },

    canRedo(): boolean {
      return redoStack.length > 0
    },

    undoStack(): AuditEntry[] {
      return [...undoStack]
    },

    redoStack(): AuditEntry[] {
      return [...redoStack]
    },

    clear(): void {
      undoStack.length = 0
      redoStack.length = 0
    }
  }
}
