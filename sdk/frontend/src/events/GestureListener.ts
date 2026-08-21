import { overlayService, type GestureSource } from '../overlay-service'

/**
 * Global gesture interception: context menu, double-click, selection, drag.
 *
 * Reads `data-gesture-*` attributes up the DOM tree from the event target so any
 * component can participate without providing/injecting. Rows can add
 * `data-gesture-object-type` + `data-gesture-id` to scope triggers to an entity row.
 */
export function initGestureListener(): () => void {
  const ATTR_TYPE = 'data-gesture-type'
  const ATTR_OBJECT_TYPE = 'data-gesture-object-type'
  const ATTR_COMPONENT_ID = 'data-gesture-component-id'
  const ATTR_ROW = 'data-gesture-row'

  function collect(target: EventTarget | null): { type?: string; objectType?: string; componentId?: string; row?: Record<string, unknown> } {
    const result: { type?: string; objectType?: string; componentId?: string; row?: Record<string, unknown> } = {}
    let node: HTMLElement | null = target instanceof HTMLElement ? target : null
    while (node && !(result.type && result.objectType)) {
      if (!result.type && node.getAttribute(ATTR_TYPE)) {
        result.type = node.getAttribute(ATTR_TYPE) ?? undefined
      }
      if (!result.objectType && node.getAttribute(ATTR_OBJECT_TYPE)) {
        result.objectType = node.getAttribute(ATTR_OBJECT_TYPE) ?? undefined
      }
      if (!result.componentId && node.getAttribute(ATTR_COMPONENT_ID)) {
        result.componentId = node.getAttribute(ATTR_COMPONENT_ID) ?? undefined
      }
      if (!result.row) {
        const raw = node.getAttribute(ATTR_ROW)
        if (raw) {
          try {
            result.row = JSON.parse(raw) as Record<string, unknown>
          } catch {
            /* ignore malformed row data */
          }
        }
      }
      node = node.parentElement
    }
    return result
  }

  function buildSource(
    event: GestureSource['event'],
    original: { clientX: number; clientY: number },
    target: EventTarget | null
  ): GestureSource {
    const info = collect(target)
    return {
      event,
      componentType: info.type,
      objectType: info.objectType,
      componentId: info.componentId,
      row: info.row,
      x: original.clientX,
      y: original.clientY
    }
  }

  function onContextMenu(e: MouseEvent): void {
    const opened = overlayService.onGesture(buildSource('contextmenu', e, e.target))
    if (opened) e.preventDefault()
  }

  function onDblClick(e: MouseEvent): void {
    overlayService.onGesture(buildSource('dblclick', e, e.target))
  }

  function onSelectionChange(): void {
    const selection = window.getSelection()
    const anchor = selection?.anchorNode
    const element = anchor instanceof HTMLElement ? anchor : anchor?.parentElement ?? null
    if (!element) return
    const rect = element.getBoundingClientRect()
    overlayService.onGesture(
      buildSource('selection', { clientX: rect.left, clientY: rect.bottom }, element)
    )
  }

  window.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('dblclick', onDblClick)
  document.addEventListener('selectionchange', onSelectionChange)

  return () => {
    window.removeEventListener('contextmenu', onContextMenu)
    window.removeEventListener('dblclick', onDblClick)
    document.removeEventListener('selectionchange', onSelectionChange)
  }
}
