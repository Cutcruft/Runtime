import { computed, type ComputedRef } from 'vue'
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
  return computed(() => withDefaults(config, defaults))
}
