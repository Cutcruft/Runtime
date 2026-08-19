/**
 * @cutcrft/plugin-sdk
 *
 * The official SDK for building CutCruft frontend plugins.
 * Provides type definitions and helper utilities.
 *
 * Usage:
 *   import { definePlugin, useCfg, useData } from '@cutcrft/plugin-sdk'
 */

import type { Component, Ref } from 'vue'

// ── Core types (self-contained) ─────────────────────────────────

export interface ShortcutEntry {
  id: string
  keys: string[]
  action: 'navigate' | 'command' | 'event' | 'pageBack' | 'pageForward'
  page?: string
  command?: string
  params?: Record<string, unknown>
  scope?: 'global' | 'page' | 'component'
  label?: string
}

export interface RuntimeEvent {
  kind: string
  payload?: unknown
  source?: string
  ts: number
}

export type PluginEvent = RuntimeEvent

export interface PluginStorage {
  get<T = unknown>(key: string): T | null
  set<T = unknown>(key: string, value: T): void
  remove(key: string): void
  keys(): string[]
  clear(): void
}

export interface EntityStoreConfig {
  entityType: string
  pageId?: string
  transform?: (item: any) => any
  subscribe?: (ids: string[]) => void
}

export interface EntityStoreApi {
  items: Ref<any[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  load(): Promise<void>
  create(data: Record<string, unknown>): Promise<any>
  update(id: string, data: Record<string, unknown>): Promise<any>
  remove(id: string): Promise<void>
  invalidate(): void
  selectedId: Ref<string | null>
  select(id: string | null): void
  selected: Ref<any | null>
}

export interface ModalHandle {
  close(): void
  result: Promise<unknown>
}

export interface MenuItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  separator?: boolean
  action?: () => void
  children?: MenuItem[]
}

export interface ModalApi {
  open(component: Component, props?: Record<string, unknown>): ModalHandle
  menu(items: MenuItem[], anchor?: { x: number; y: number }): ModalHandle
  panel(component: Component, props?: Record<string, unknown>): ModalHandle
  tooltip(text: string, anchor?: { x: number; y: number }): ModalHandle
  closeAll(): void
}

export interface ClipboardApi {
  readText(): Promise<string>
  writeText(text: string): Promise<void>
  read(): Promise<{ type: string; data: unknown } | null>
  write(data: unknown): Promise<void>
}

export interface AnimationApi {
  apply(el: HTMLElement, keyframes: Keyframe[], options?: KeyframeAnimationOptions): Animation | null
  toggleClass(el: HTMLElement, className: string, duration?: number): void
  clear(el: HTMLElement): void
}

export interface ThemeApi {
  readonly mode: 'auto' | 'light' | 'dark'
  setMode(mode: 'auto' | 'light' | 'dark'): void
  cycle(): void
  getToken(name: string): string | undefined
  getTokens(): Record<string, string>
}

export interface RouterApi {
  open(pageId: string): void
  readonly activePageId: string | null
}

// ── Plugin manifest ─────────────────────────────────────────────

export interface PluginManifest {
  id: string
  name: string
  version: string
  description?: string
  dependencies?: string[]
}

// ── Plugin setup context ────────────────────────────────────────

export interface PluginSetupContext {
  registerComponent(type: string, component: Component): () => void
  registerEditor(type: string, loader: () => Promise<{ default: Component }>): () => void
  registerShortcut(entry: ShortcutEntry): () => void
  emit(name: string, payload?: unknown): void
  on(name: string, handler: (event: PluginEvent) => void): () => void
  onRuntimeEvent(handler: (event: RuntimeEvent) => void): () => void
  storage: PluginStorage
  createEntityStore(config: EntityStoreConfig): EntityStoreApi
  modal: ModalApi
  clipboard: ClipboardApi
  animation: AnimationApi
  theme: ThemeApi
  router: RouterApi
  registerThemeTokens(tokens: Record<string, string>): () => void
  config: any
  session: any
  toasts: any
}

export interface PluginDefinition {
  manifest: PluginManifest
  setup: (ctx: PluginSetupContext) => void | Promise<void>
  teardown?: () => void | Promise<void>
}

// ── definePlugin helper ─────────────────────────────────────────

/**
 * Define a CutCruft plugin with full type safety.
 *
 * @example
 * ```ts
 * import { definePlugin } from '@cutcrft/plugin-sdk'
 *
 * export default definePlugin({
 *   manifest: { id: 'my-plugin', name: 'My Plugin', version: '1.0.0' },
 *   setup(ctx) {
 *     ctx.registerComponent('MyWidget', MyWidget)
 *   }
 * })
 * ```
 */
export function definePlugin(definition: PluginDefinition): PluginDefinition {
  return definition
}
