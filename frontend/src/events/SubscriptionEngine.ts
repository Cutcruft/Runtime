import { subscribeEvent } from './eventBus'
import { configStore } from '../store/config'
import { dataStore } from '../store/data'
import { sessionStore } from '../store/session'
import { toasts } from '../store/toasts'
import type { RuntimeEvent } from '../protocol/envelope'
import type { SubscriptionEntry } from '../protocol/types'

export function initSubscriptionEngine(): () => void {
  return subscribeEvent((event: RuntimeEvent) => {
    for (const subscription of configStore.subscriptions ?? []) {
      if (event.kind !== subscription.event) continue
      if (!matchesFilter(subscription, event.payload)) continue
      runAction(subscription, event)
    }
  })
}

function matchesFilter(subscription: SubscriptionEntry, payload: Record<string, unknown>): boolean {
  const filter = subscription.filter
  if (!filter) return true
  return Object.entries(filter).every(([key, value]) => payload[key] === value)
}

function runAction(subscription: SubscriptionEntry, event: RuntimeEvent): void {
  switch (subscription.action) {
    case 'refresh': {
      if (subscription.target) dataStore.invalidate(subscription.target)
      break
    }
    case 'command': {
      if (subscription.command) {
        sessionStore.execute(subscription.command, subscription.params ?? {}).catch((error) => {
          toasts.push({ message: `Command '${subscription.command}' failed: ${error}`, kind: 'error' })
        })
      }
      break
    }
    case 'toast': {
      toasts.push({
        message:
          (subscription.params?.message as string) ??
          `${subscription.event} received${'objectId' in event.payload ? ` (${String(event.payload.objectId)})` : ''}`,
        kind: 'info'
      })
      break
    }
  }
}
