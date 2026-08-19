/**
 * Plugin Loader — dynamically loads plugin-provided frontend components
 * (editors, custom components) from /config pluginComponents[] entries.
 *
 * Each plugin component bundle is an ES module that:
 *   - imports { ref, computed, ... } from 'vue'           (resolved by importmap)
 *   - imports { useCfg, useData, ... } from '@cutcrft/runtime-client'
 *   - exports default a Vue Component
 *
 * The loader fetches /config at startup, reads pluginComponents[],
 * and dynamically imports each bundle URL.
 */

import { configStore } from '../store/config'
import { registerEditor } from '../editor/editorRegistry'
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

  // Register lazy loaders for editors — they only import when a page needs them
  for (const entry of editors) {
    const editorKey = EDITOR_TYPE_MAP[entry.type]
    if (!editorKey) continue
    if (entry.cssUrl) injectCss(entry.cssUrl)

    const bundleUrl = entry.bundleUrl
    registerEditor(editorKey, () => import(/* @vite-ignore */ bundleUrl))
    for (const [alias, key] of Object.entries(MIGRATION_ALIASES)) {
      if (key === editorKey && alias !== editorKey) {
        registerEditor(alias, () => import(/* @vite-ignore */ bundleUrl))
      }
    }
    loadedBundles.add(bundleUrl)
    console.log(`[PluginLoader] Registered lazy editor "${entry.type}" from ${bundleUrl}`)
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
