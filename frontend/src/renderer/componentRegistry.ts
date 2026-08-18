import type { Component } from 'vue'

const registry = new Map<string, Component>()

function register(type: string, component: Component): void {
  registry.set(type.toLowerCase(), component)
}

/** Register a custom component type (used by plugin bundles). Returns an unregister fn. */
export function registerComponent(type: string, component: Component): () => void {
  register(type, component)
  return () => registry.delete(type.toLowerCase())
}

export function resolveComponent(type: string): Component | null {
  return registry.get(type.toLowerCase()) ?? null
}

export function registeredTypes(): string[] {
  return [...registry.keys()]
}


