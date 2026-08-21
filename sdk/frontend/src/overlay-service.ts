import { signal } from '@preact/signals'
import { sessionStore } from './store/session'
import { toasts } from './store/toasts'
import { i18nStore } from './store/i18n'
import { runAction, resolveParams } from './renderer/bindingEngine'
import type { OverlayEntry, OverlayTriggerEntry, MenuItemEntry } from './protocol/types'
import type {
  ActionSpec,
  BindingContext,
  GestureEventName,
  MenuItemSpec,
  OverlayDefinition,
  OverlayKind,
  OverlayPlacement,
  OverlayTriggerSpec
} from './protocol/componentSpec'
import { globalSingleton } from './utils/globalSingleton'

export interface OverlayAnchor {
  x: number
  y: number
}

export interface OverlayInstance {
  uid: number
  overlayId: string
  definition: OverlayDefinition
  anchor: OverlayAnchor | null
  context: BindingContext
}

export interface GestureSource {
  event: GestureEventName
  componentType?: string
  objectType?: string
  componentId?: string
  x: number
  y: number
  row?: Record<string, unknown>
}

const { overlaysSignal, overlayState } = globalSingleton('__cc_overlay', () => ({
  overlaysSignal: signal<OverlayInstance[]>([]),
  overlayState: { uidCounter: 0 }
}))

const definitions = globalSingleton('__cc_overlay_defs', () => new Map<string, OverlayDefinition>())
const triggers = globalSingleton('__cc_overlay_triggers', () => [] as OverlayTriggerSpec[])

function nextUid(): number {
  overlayState.uidCounter += 1
  return overlayState.uidCounter
}

const OVERLAY_KINDS: OverlayKind[] = ['menu', 'modal', 'panel', 'tooltip']
const GESTURE_EVENTS: GestureEventName[] = ['contextmenu', 'dblclick', 'selection', 'hover', 'drag']
const SIDES = ['left', 'right', 'bottom'] as const
const PLACEMENTS: OverlayPlacement[] = ['top', 'right', 'bottom', 'left']

function toMenuItem(item: MenuItemEntry): MenuItemSpec {
  return {
    label: item.label,
    icon: item.icon,
    command: item.command,
    params: item.params,
    spec: item.spec as ActionSpec | undefined,
    confirm: item.confirm,
    items: item.items?.map(toMenuItem),
    divider: item.divider,
    disabled: item.disabled,
    danger: item.danger,
    shortcut: item.shortcut
  }
}

function toDefinition(entry: OverlayEntry): OverlayDefinition {
  return {
    id: entry.id,
    kind: (OVERLAY_KINDS.includes(entry.kind as OverlayKind) ? entry.kind : 'menu') as OverlayKind,
    title: entry.title,
    content: entry.content,
    items: entry.items?.map(toMenuItem),
    width: entry.width,
    side: (SIDES.includes(entry.side as (typeof SIDES)[number]) ? entry.side : undefined) as OverlayDefinition['side'],
    text: entry.text,
    placement: (PLACEMENTS.includes(entry.placement as OverlayPlacement) ? entry.placement : undefined) as OverlayPlacement
  }
}

function toTrigger(entry: OverlayTriggerEntry): OverlayTriggerSpec {
  return {
    event: (GESTURE_EVENTS.includes(entry.event as GestureEventName) ? entry.event : 'contextmenu') as GestureEventName,
    componentType: entry.componentType,
    objectType: entry.objectType,
    componentId: entry.componentId,
    overlay: entry.overlay,
    anchor: entry.anchor === 'center' ? 'center' : 'pointer'
  }
}

function matches(trigger: OverlayTriggerSpec, source: GestureSource): boolean {
  if (trigger.event !== source.event) return false
  if (trigger.componentType && trigger.componentType.toLowerCase() !== (source.componentType ?? '').toLowerCase()) {
    return false
  }
  if (trigger.objectType && trigger.objectType !== source.objectType) return false
  if (trigger.componentId && trigger.componentId !== source.componentId) return false
  return true
}

export const overlayService = {
  /** Raw signal for Preact signal integration. */
  get overlaysSignal() { return overlaysSignal },

  get overlays(): OverlayInstance[] {
    return overlaysSignal.value
  },

  /** Registers local (component-level) overlay definitions. Returns an unregister fn. */
  registerDefinitions(entries: OverlayDefinition[]): () => void {
    entries.forEach((entry) => definitions.set(entry.id, entry))
    return () => entries.forEach((entry) => definitions.delete(entry.id))
  },

  /** Registers workspace-level overlay definitions (from /config). */
  registerWorkspace(overlays: OverlayEntry[], workspaceTriggers: OverlayTriggerEntry[]): void {
    overlays.forEach((entry) => {
      definitions.set(entry.id, toDefinition(entry))
    })
    triggers.length = 0
    triggers.push(...workspaceTriggers.map(toTrigger))
  },

  registerLocalTriggers(entries: OverlayTriggerSpec[]): () => void {
    triggers.push(...entries)
    const start = triggers.length - entries.length
    return () => {
      triggers.splice(start, entries.length)
    }
  },

  open(
    overlayId: string,
    anchor: OverlayAnchor | null,
    context: BindingContext = {}
  ): OverlayInstance | null {
    const definition = definitions.get(overlayId)
    if (!definition) return null
    const current = overlaysSignal.value
    // Stacked menus close sibling menus; modals stack over menus.
    const closing = definition.kind === 'menu'
      ? current.filter((o) => o.definition.kind === 'menu')
      : current.filter((o) => o.definition.kind !== 'modal' && o.definition.kind !== 'panel')
    const closingUids = new Set(closing.map((o) => o.uid))
    const filtered = current.filter((o) => !closingUids.has(o.uid))
    const instance: OverlayInstance = {
      uid: nextUid(),
      overlayId,
      definition,
      anchor,
      context
    }
    overlaysSignal.value = [...filtered, instance]
    return instance
  },

  close(uid: number): void {
    overlaysSignal.value = overlaysSignal.value.filter((o) => o.uid !== uid)
  },

  closeAll(): void {
    overlaysSignal.value = []
  },

  /** Routes a gesture (from GestureListener) to the first matching trigger. Returns true if an overlay opened. */
  onGesture(source: GestureSource): boolean {
    const trigger = triggers.find((candidate) => matches(candidate, source))
    if (!trigger) return false
    const anchor = trigger.anchor === 'center' ? null : { x: source.x, y: source.y }
    const context: BindingContext = {
      payload: {
        componentType: source.componentType,
        objectType: source.objectType,
        componentId: source.componentId
      }
    }
    if (source.row) context.row = source.row
    return overlayService.open(trigger.overlay, anchor, context) !== null
  },

  /** Executes a menu item with the instance context. */
  async executeMenuItem(item: MenuItemSpec, instance: OverlayInstance): Promise<void> {
    if (item.disabled) return
    if (item.spec) {
      const handled = await runAction({ event: 'menu', spec: item.spec, confirm: item.confirm }, instance.context)
      if (handled) overlayService.close(instance.uid)
      return
    }
    if (item.command) {
      if (item.confirm && !window.confirm(i18nStore.tr(item.confirm))) return
      try {
        await sessionStore.executeCommand(item.command, resolveParams(item.params, instance.context))
        toasts.push({ message: `'${item.command}' ok`, kind: 'success' })
      } catch {
        /* error toast shown by executeCommand */
      }
      overlayService.close(instance.uid)
      return
    }
    overlayService.close(instance.uid)
  },

  async copyText(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value)
      toasts.push({ message: 'Copied to clipboard', kind: 'success' })
    } catch {
      /* clipboard unavailable */
    }
  }
}
