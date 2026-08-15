import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'

export type EditorLoader = () => Promise<{ default: Component } | Component>

const loaders = new Map<string, EditorLoader>()
const cache = new Map<string, Component>()

/** Lazily register an editor type. The loader is a dynamic `import()` so Vite code-splits it. */
export function registerEditor(type: string, loader: EditorLoader): void {
  loaders.set(type.toLowerCase(), loader)
}

export function isEditorType(type: string): boolean {
  return loaders.has(type.toLowerCase())
}

/** Resolves an editor to an async component, memoized per type. */
export function resolveEditor(type: string): Component | null {
  const key = type.toLowerCase()
  const cached = cache.get(key)
  if (cached) return cached
  const loader = loaders.get(key)
  if (!loader) return null
  const asyncComponent = defineAsyncComponent({
    loader: async () => {
      const module = await loader()
      return ('default' in module ? module.default : module) as Component
    }
  })
  cache.set(key, asyncComponent)
  return asyncComponent
}

export function registeredEditorTypes(): string[] {
  return [...loaders.keys()]
}
