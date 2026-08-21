import { overlayService } from '../overlay-service'
import type { BindingContext } from '../protocol/componentSpec'

/**
 * Simplified Modal/Panel/Menu API for plugins.
 * Wraps the overlay system with a plugin-friendly interface.
 */

export interface ModalApi {
  /** Open a modal dialog with a component definition */
  open(options: ModalOptions): ModalHandle
  /** Open a context menu at pointer position */
  menu(options: MenuOptions): ModalHandle
  /** Open a side panel */
  panel(options: PanelOptions): ModalHandle
  /** Show a tooltip near an element */
  tooltip(options: TooltipOptions): ModalHandle
  /** Close all open overlays */
  closeAll(): void
}

export interface ModalOptions {
  title?: string
  /** Component definition to render inside the modal */
  content?: { type: string; config: Record<string, unknown>; id?: string }
  width?: string
  context?: BindingContext
}

export interface MenuOptions {
  items: MenuItem[]
  x: number
  y: number
  context?: BindingContext
}

export interface MenuItem {
  label: string
  icon?: string
  command?: string
  params?: Record<string, unknown>
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  items?: MenuItem[]
}

export interface PanelOptions {
  title?: string
  content?: { type: string; config: Record<string, unknown>; id?: string }
  side?: 'left' | 'right' | 'bottom'
  width?: string
  context?: BindingContext
}

export interface TooltipOptions {
  text: string
  target?: HTMLElement
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

export interface ModalHandle {
  close(): void
}

let overlayIdCounter = 0

function registerOverlay(definition: Parameters<typeof overlayService.registerDefinitions>[0]): string {
  const id = `__plugin_overlay_${++overlayIdCounter}`
  overlayService.registerDefinitions([{ ...definition[0], id }])
  return id
}

function toOverlayItems(items: MenuItem[]): Parameters<typeof overlayService.registerDefinitions>[0][0]['items'] {
  return items.map((item) => ({
    label: item.label,
    icon: item.icon,
    command: item.command,
    params: item.params,
    disabled: item.disabled,
    danger: item.danger,
    divider: item.divider,
    items: item.items ? toOverlayItems(item.items) : undefined
  }))
}

export const modalApi: ModalApi = {
  open(options: ModalOptions): ModalHandle {
    const overlayId = registerOverlay([{
      id: '',
      kind: 'modal',
      title: options.title,
      content: options.content,
      width: options.width
    }])
    const instance = overlayService.open(overlayId, null, options.context ?? {})
    return {
      close() {
        if (instance) overlayService.close(instance.uid)
      }
    }
  },

  menu(options: MenuOptions): ModalHandle {
    const overlayId = registerOverlay([{
      id: '',
      kind: 'menu',
      items: toOverlayItems(options.items)
    }])
    const instance = overlayService.open(overlayId, { x: options.x, y: options.y }, options.context ?? {})
    return {
      close() {
        if (instance) overlayService.close(instance.uid)
      }
    }
  },

  panel(options: PanelOptions): ModalHandle {
    const overlayId = registerOverlay([{
      id: '',
      kind: 'panel',
      title: options.title,
      content: options.content,
      side: options.side ?? 'right',
      width: options.width
    }])
    const instance = overlayService.open(overlayId, null, options.context ?? {})
    return {
      close() {
        if (instance) overlayService.close(instance.uid)
      }
    }
  },

  tooltip(_options: TooltipOptions): ModalHandle {
    // Tooltip rendering is handled by the overlay system;
    // for now, return a no-op handle.
    return { close() {} }
  },

  closeAll(): void {
    overlayService.closeAll()
  }
}
