import { computed, type ComputedRef } from 'vue'
import { i18nStore } from '../store/i18n'
import type { BaseComponentConfig } from '../protocol/componentSpec'

export function withDefaults<T extends BaseComponentConfig>(
  config: Record<string, unknown>,
  defaults: T
): T {
  return { ...defaults, ...config } as T
}

export function useCfg<T extends BaseComponentConfig>(
  config: Record<string, unknown>,
  defaults: T
): ComputedRef<T> {
  return computed(() => i18nStore.deepTranslate(withDefaults(config, defaults)))
}
