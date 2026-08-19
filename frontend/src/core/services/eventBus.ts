import type { RuntimeEvent } from '../../protocol/envelope'
import { globalSingleton } from '../../utils/globalSingleton'

type Handler = (event: RuntimeEvent) => void

const { handlers } = globalSingleton('__cc_core_evbus', () => ({
  handlers: new Set<Handler>()
}))

export function subscribeEvent(handler: Handler): () => void {
  handlers.add(handler)
  return () => handlers.delete(handler)
}

export function emitEvent(event: RuntimeEvent): void {
  handlers.forEach((handler) => handler(event))
}

// ── Plugin-scoped event bus ──────────────────────────────────────
// Allows plugins to communicate with each other via namespaced events
// without leaking into the global runtime event bus.

export interface PluginEvent {
  /** Sender plugin ID */
  from: string
  /** Event name (arbitrary string, recommended: "pluginId:eventName") */
  name: string
  /** Arbitrary payload */
  payload?: unknown
}

type PluginEventHandler = (event: PluginEvent) => void

const { pluginHandlers } = globalSingleton('__cc_pl_evbus', () => ({
  pluginHandlers: new Map<string, Set<PluginEventHandler>>()
}))

export function emitPluginEvent(event: PluginEvent): void {
  // Dispatch to wildcard listeners
  const wildcardHandlers = pluginHandlers.get('*')
  if (wildcardHandlers) {
    wildcardHandlers.forEach((h) => h(event))
  }
  // Dispatch to specific event name listeners
  const specificHandlers = pluginHandlers.get(event.name)
  if (specificHandlers) {
    specificHandlers.forEach((h) => h(event))
  }
}

export function onPluginEvent(eventName: string, handler: PluginEventHandler): () => void {
  let set = pluginHandlers.get(eventName)
  if (!set) {
    set = new Set()
    pluginHandlers.set(eventName, set)
  }
  set.add(handler)
  return () => {
    set!.delete(handler)
    if (set!.size === 0) pluginHandlers.delete(eventName)
  }
}

export function clearPluginEventHandlers(): void {
  pluginHandlers.clear()
}
