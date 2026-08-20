import { signal } from '@preact/signals'
import type { PageDefinition, LayerDefinition } from '../protocol/types'
import { globalSingleton } from '../utils/globalSingleton'

/**
 * Reactive store for per-page layer visibility overrides.
 * Defaults come from config; this store holds runtime toggles.
 */
function createLayerStore() {
  /** pageId → (layerId → visible override) */
  const overrides = globalSingleton('__cc_layer', () => signal(new Map<string, Map<string, boolean>>()))

  function setVisible(pageId: string, layerId: string, visible: boolean) {
    const current = new Map(overrides.value)
    let pageMap = current.get(pageId)
    if (!pageMap) {
      pageMap = new Map()
      current.set(pageId, pageMap)
    } else {
      pageMap = new Map(pageMap)
      current.set(pageId, pageMap)
    }
    pageMap.set(layerId, visible)
    overrides.value = current
  }

  function toggle(pageId: string, layerId: string): boolean {
    const current = isVisible(pageId, layerId, true)
    setVisible(pageId, layerId, !current)
    return !current
  }

  function isVisible(pageId: string, layerId: string, configDefault: boolean): boolean {
    return overrides.value.get(pageId)?.get(layerId) ?? configDefault
  }

  function isLayerVisible(pageId: string, layer: LayerDefinition): boolean {
    return isVisible(pageId, layer.id, layer.visible ?? true)
  }

  function getVisibleLayers(pageId: string, layers: LayerDefinition[]): LayerDefinition[] {
    return layers
      .filter(l => isLayerVisible(pageId, l))
      .sort((a, b) => a.order - b.order)
  }

  function hasLayers(page: PageDefinition): boolean {
    return Array.isArray(page.layers) && page.layers.length > 0
  }

  /** Handle a layer.visibility event from WS. */
  function handleLayerEvent(payload: { pageId: string; layerId: string; visible: boolean }) {
    setVisible(payload.pageId, payload.layerId, payload.visible)
  }

  return {
    overrides,
    setVisible,
    toggle,
    isVisible,
    isLayerVisible,
    getVisibleLayers,
    hasLayers,
    handleLayerEvent
  }
}

export const layerStore = createLayerStore()
