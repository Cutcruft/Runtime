import type { RuntimeEvent } from '../protocol/envelope'
import { globalSingleton } from '../utils/globalSingleton'

type Handler = (event: RuntimeEvent) => void

const { handlers } = globalSingleton('__cc_evbus', () => ({
  handlers: new Set<Handler>()
}))

export function subscribeEvent(handler: Handler): () => void {
  handlers.add(handler)
  return () => handlers.delete(handler)
}

export function emitEvent(event: RuntimeEvent): void {
  handlers.forEach((handler) => handler(event))
}
