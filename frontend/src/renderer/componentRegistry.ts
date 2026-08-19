import type { Component } from 'vue'
import { ref } from 'vue'
import { globalSingleton } from '../utils/globalSingleton'

const { registry, registryVersion } = globalSingleton('__cc_cr', () => ({
  registry: new Map<string, Component>(),
  registryVersion: ref(0)
}))

function register(type: string, component: Component): void {
  registry.set(type.toLowerCase(), component)
  registryVersion.value++
}

/** Register a custom component type (used by plugin bundles). Returns an unregister fn. */
export function registerComponent(type: string, component: Component): () => void {
  register(type, component)
  return () => {
    registry.delete(type.toLowerCase())
    registryVersion.value++
  }
}

export function resolveComponent(type: string): Component | null {
  // Touch ref so computed re-evaluates when registry changes
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


