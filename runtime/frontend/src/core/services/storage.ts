/**
 * Scoped localStorage wrapper for plugins.
 * Each plugin gets its own namespace: `cc.plugins.<pluginId>.<key>`.
 */

export interface PluginStorage {
  get(key: string): string | null
  set(key: string, value: string): void
  remove(key: string): void
  clear(): void
  keys(): string[]
}

const PREFIX = 'cc.plugins.'

export function createPluginStorage(pluginId: string): PluginStorage {
  const ns = `${PREFIX}${pluginId}.`

  return {
    get(key: string): string | null {
      return localStorage.getItem(ns + key)
    },

    set(key: string, value: string): void {
      localStorage.setItem(ns + key, value)
    },

    remove(key: string): void {
      localStorage.removeItem(ns + key)
    },

    clear(): void {
      const toRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith(ns)) toRemove.push(k)
      }
      toRemove.forEach((k) => localStorage.removeItem(k))
    },

    keys(): string[] {
      const result: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k && k.startsWith(ns)) {
          result.push(k.slice(ns.length))
        }
      }
      return result
    }
  }
}
