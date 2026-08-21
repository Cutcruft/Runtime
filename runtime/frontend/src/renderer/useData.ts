import { useSignal, useSignalEffect } from '@preact/signals'
import { dataStore } from '../store/data'
import { sessionStore } from '../store/session'
import { loadData, type LoadResult } from './bindingEngine'
import type { BindingContext, DataBinding } from '../protocol/componentSpec'

/**
 * Loads data for a component binding and keeps it fresh:
 * - reloads when the binding/context changes;
 * - subscribes to the entity type so server-side object.changed events reach this
 *   component, which bumps the revision signal and triggers an auto-reload
 *   (no manual "Refresh" button);
 * - tracks loading/error state.
 */
export function useData(
  binding: () => DataBinding | undefined,
  context: () => BindingContext
) {
  const value = useSignal<unknown>(null)
  const error = useSignal<string | null>(null)
  const loading = useSignal(false)

  async function reload(): Promise<void> {
    const current = binding()
    if (!current?.command) {
      value.value = null
      error.value = null
      loading.value = false
      return
    }
    loading.value = true
    const result: LoadResult = await loadData(current, context())
    value.value = result.value
    error.value = result.error
    loading.value = false
  }

  // V7.3: reactively reload whenever the entity's revision signal changes OR the
  // binding changes. Also subscribe to the entity type so server-side mutations
  // (object.changed) invalidate the cache → revision bump → auto-reload.
  useSignalEffect(() => {
    const entityType = binding()?.entityType
    if (entityType) {
      // Subscribe so server object.changed events reach this component.
      sessionStore.subscribe(entityType)
      // Subscribing to this signal's value inside the effect re-runs on revision bump.
      void dataStore.revisionSignal(entityType).value
    }
    // Trigger read of binding to re-run when it changes.
    binding()
    reload()
  })

  return { value, error, loading, reload }
}

