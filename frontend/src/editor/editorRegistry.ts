import type { ComponentType } from 'preact'
import { signal } from '@preact/signals'
import { globalSingleton } from '../utils/globalSingleton'

export type EditorLoader = () => Promise<{ default: ComponentType } | ComponentType>

const { loaders, syncComponents, cache, editorRegistryVersion } = globalSingleton('__cc_er', () => ({
  loaders: new Map<string, EditorLoader>(),
  syncComponents: new Map<string, ComponentType>(),
  cache: new Map<string, ComponentType>(),
  editorRegistryVersion: signal(0)
}))

/** Register a fully-resolved editor component. */
export function registerEditorComponent(type: string, component: ComponentType): () => void {
  const key = type.toLowerCase()
  syncComponents.set(key, component)
  cache.set(key, component)
  editorRegistryVersion.value++
  return () => {
    syncComponents.delete(key)
    cache.delete(key)
    editorRegistryVersion.value++
  }
}

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
  const key = type.toLowerCase()
  return syncComponents.has(key) || loaders.has(key)
}

/**
 * Resolves an editor — sync components first, then async loaders.
 * Returns a lazy-loading wrapper component for async editors.
 */
export function resolveEditor(type: string): ComponentType | null {
  void editorRegistryVersion.value
  const key = type.toLowerCase()
  const cached = cache.get(key)
  if (cached) return cached
  const sync = syncComponents.get(key)
  if (sync) {
    cache.set(key, sync)
    return sync
  }
  const loader = loaders.get(key)
  if (!loader) return null
  // Return a lazy-loading component
  let loaded: ComponentType | null = null
  let loading: Promise<ComponentType> | null = null
  const LazyWrapper = (props: Record<string, unknown>) => {
    if (loaded) return (loaded as any)(props)
    if (!loading) {
      loading = loader().then((mod) => {
        loaded = ('default' in mod ? mod.default : mod) as ComponentType
        return loaded
      })
    }
    // During loading, render a placeholder
    return null
  }
  cache.set(key, LazyWrapper as ComponentType)
  return LazyWrapper
}

export function registeredEditorTypes(): string[] {
  return [...new Set([...syncComponents.keys(), ...loaders.keys()])]
}

export function unregisterEditor(type: string): void {
  const key = type.toLowerCase()
  loaders.delete(key)
  syncComponents.delete(key)
  cache.delete(key)
  editorRegistryVersion.value++
}
