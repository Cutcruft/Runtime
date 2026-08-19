import type { Component } from 'vue'
import { defineAsyncComponent, ref } from 'vue'
import { globalSingleton } from '../utils/globalSingleton'

export type EditorLoader = () => Promise<{ default: Component } | Component>

const { loaders, cache, editorRegistryVersion } = globalSingleton('__cc_er', () => ({
  loaders: new Map<string, EditorLoader>(),
  cache: new Map<string, Component>(),
  editorRegistryVersion: ref(0)
}))

/** Lazily register an editor type. The loader is a dynamic `import()` so Vite code-splits it. */
export function registerEditor(type: string, loader: EditorLoader): () => void {
  const key = type.toLowerCase()
  loaders.set(key, loader)
  editorRegistryVersion.value++
  return () => {
    loaders.delete(key)
    cache.delete(key)
    editorRegistryVersion.value++
  }
}

export function isEditorType(type: string): boolean {
  void editorRegistryVersion.value
  return loaders.has(type.toLowerCase())
}

/** Resolves an editor to an async component, memoized per type. */
export function resolveEditor(type: string): Component | null {
  void editorRegistryVersion.value
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

export function unregisterEditor(type: string): void {
  const key = type.toLowerCase()
  loaders.delete(key)
  cache.delete(key)
  editorRegistryVersion.value++
}
