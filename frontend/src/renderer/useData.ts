import { onMounted, ref, watch, type Ref } from 'vue'
import { dataStore } from '../store/data'
import { loadData, type LoadResult } from './bindingEngine'
import type { BindingContext, DataBinding } from '../protocol/componentSpec'

export function useData(
  binding: () => DataBinding | undefined,
  context: () => BindingContext
): { value: Ref<unknown>; error: Ref<string | null>; loading: Ref<boolean>; reload: () => Promise<void> } {
  const value = ref<unknown>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

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

  watch(
    () => {
      const entityType = binding()?.entityType
      return entityType ? dataStore.revision(entityType) : 0
    },
    () => reload()
  )
  watch(binding, () => reload())

  onMounted(() => reload())

  return { value, error, loading, reload }
}
