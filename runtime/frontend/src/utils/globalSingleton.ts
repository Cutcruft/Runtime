/**
 * Cross-bundle singleton helper.
 *
 * runtimeClient.js is a separate Vite library build that bundles its own copies
 * of stores, registries, and composables. Without this helper, plugin bundles
 * that import from '@cutcrft/runtime-client' get DUPLICATE reactive state that
 * is never initialized by the main app.
 *
 * Using globalThis ensures all module instances (main bundle, runtimeClient,
 * plugin bundles) share the same reactive state.
 */
export function globalSingleton<T>(key: string, factory: () => T): T {
  const g = globalThis as Record<string, unknown>
  if (!g[key]) g[key] = factory()
  return g[key] as T
}
