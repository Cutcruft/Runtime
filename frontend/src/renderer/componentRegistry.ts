import type { ComponentType } from 'preact'
import { signal } from '@preact/signals'
import { globalSingleton } from '../utils/globalSingleton'

const { registry, registryVersion } = globalSingleton('__cc_cr', () => ({
  registry: new Map<string, ComponentType>(),
  registryVersion: signal(0)
}))

function register(type: string, component: ComponentType): void {
  registry.set(type.toLowerCase(), component)
  registryVersion.value++
}

/** Register a custom component type (used by plugin bundles). Returns an unregister fn. */
export function registerComponent(type: string, component: ComponentType): () => void {
  register(type, component)
  return () => {
    registry.delete(type.toLowerCase())
    registryVersion.value++
  }
}

export function resolveComponent(type: string): ComponentType | null {
  // Touch signal so computed re-evaluates when registry changes
  void registryVersion.value
  return registry.get(type.toLowerCase()) ?? null
}

export function registeredTypes(): string[] {
  return [...registry.keys()]
}

export function unregisterComponent(type: string): void {
  registry.delete(type.toLowerCase())
  registryVersion.value++
}
