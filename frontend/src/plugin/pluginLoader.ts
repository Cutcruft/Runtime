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
 */
export async function loadPluginComponents(): Promise<void> {
  const pluginComponents = configStore.value?.pluginComponents
  if (!pluginComponents?.length) return

  for (const entry of pluginComponents) {
    if (loadedBundles.has(entry.bundleUrl)) continue

    try {
      // Inject CSS if present
      if (entry.cssUrl) {
        injectCss(entry.cssUrl)
      }

      const module = await import(/* @vite-ignore */ entry.bundleUrl)
      const component = module.default ?? module

      // Editor types: register as lazy editor loader
      const editorKey = EDITOR_TYPE_MAP[entry.type]
      if (editorKey) {
        registerEditor(editorKey, () => module)
        // Register migration aliases so both "Canvas" and "canvas2d" configs work
        for (const [alias, key] of Object.entries(MIGRATION_ALIASES)) {
          if (key === editorKey && alias !== editorKey) {
            registerEditor(alias, () => module)
          }
        }
      } else {
        // Generic component: register immediately
        registerComponent(entry.type, component)
      }

      loadedBundles.add(entry.bundleUrl)
      console.log(`[PluginLoader] Loaded "${entry.type}" from ${entry.bundleUrl}`)
    } catch (err) {
      console.error(`[PluginLoader] Failed to load "${entry.type}" from ${entry.bundleUrl}:`, err)
    }
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
