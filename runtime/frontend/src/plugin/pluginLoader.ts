/**
 * Plugin Loader — dynamically loads plugin-provided frontend components
 * (editors, custom components) from /config pluginComponents[] entries.
 *
 * Each plugin component bundle is an ES module that:
 *   - imports { useCfg, useData, ... } from '@cutcrft/runtime-client'
 *   - exports default a Preact component
 *
 * The loader fetches /config at startup, reads pluginComponents[],
 * and dynamically imports each bundle URL.
 */

import { configStore } from '../store/config'
import { registerEditorComponent } from '../renderer/editorRegistry'
import { registerComponent } from '../renderer/componentRegistry'

const loadedBundles = new Set<string>()

/** Map component type names to editor keys used by the renderer. */
const EDITOR_TYPE_MAP: Record<string, string> = {
  Canvas: 'canvas2d',
  RichText: 'richtext',
  Diagram: 'diagram',
  Scene3D: 'scene3d'
}

/**
 * Migration aliases: old type names → new editor keys.
 * Allows configs using PascalCase type names (e.g. "Canvas") to resolve
 * to the correct editor bundle registered under the legacy key ("canvas2d").
 */
const MIGRATION_ALIASES: Record<string, string> = {
  canvas: 'canvas2d',
  richtext: 'richtext',
  diagram: 'diagram',
  scene3d: 'scene3d'
}

/**
 * Load all plugin-provided frontend components declared in the workspace config.
 * Called once after configStore.load() during bootstrap.
 *
 * Strategy:
 *  - Editors: register lazy loaders only (import on demand when a page uses them).
 *  - Generic components: import in parallel for fast startup.
 */
export async function loadPluginComponents(): Promise<void> {
  const pluginComponents = configStore.value?.pluginComponents
  if (!pluginComponents?.length) return

  const editors: typeof pluginComponents = []
  const generics: typeof pluginComponents = []

  for (const entry of pluginComponents) {
    if (loadedBundles.has(entry.bundleUrl)) continue
    const editorKey = EDITOR_TYPE_MAP[entry.type]
    if (editorKey) {
      editors.push(entry)
    } else {
      generics.push(entry)
    }
  }

  // Eagerly import editor components to avoid defineAsyncComponent + :key re-render crash
  const editorResults = await Promise.allSettled(
    editors.map(async (entry) => {
      const editorKey = EDITOR_TYPE_MAP[entry.type]
      if (!editorKey) return
      if (entry.cssUrl) injectCss(entry.cssUrl)

      const module = await import(/* @vite-ignore */ entry.bundleUrl)
      const component = module.default ?? module
      registerEditorComponent(editorKey, component)
      for (const [alias, key] of Object.entries(MIGRATION_ALIASES)) {
        if (key === editorKey && alias !== editorKey) {
          registerEditorComponent(alias, component)
        }
      }
      loadedBundles.add(entry.bundleUrl)
      console.log(`[PluginLoader] Loaded editor "${entry.type}" from ${entry.bundleUrl}`)
    })
  )

  const failedEditors = editorResults.filter((r) => r.status === 'rejected')
  if (failedEditors.length > 0) {
    console.warn(`[PluginLoader] ${failedEditors.length}/${editors.length} editor bundles failed to load`)
  }

  // Import generic components in parallel
  const results = await Promise.allSettled(
    generics.map(async (entry) => {
      if (entry.cssUrl) injectCss(entry.cssUrl)
      const module = await import(/* @vite-ignore */ entry.bundleUrl)
      const component = module.default ?? module
      registerComponent(entry.type, component)
      loadedBundles.add(entry.bundleUrl)
      console.log(`[PluginLoader] Loaded "${entry.type}" from ${entry.bundleUrl}`)
    })
  )

  const failed = results.filter((r) => r.status === 'rejected')
  if (failed.length > 0) {
    console.warn(`[PluginLoader] ${failed.length}/${generics.length} component bundles failed to load`)
  }
}

/**
 * Inject a CSS link tag into the document head if not already present.
 */
function injectCss(href: string): void {
  if (document.querySelector(`link[href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}
