/**
 * PluginContext — the primary API surface that each plugin receives.
 *
 * Created per-plugin during bootstrap. Provides a scoped, safe subset of the
 * runtime: registries, storage, entities, events, modals, shortcuts, theming,
 * animations, clipboard, audit log, formatting, and icon utilities.
 */

import { registerComponent, unregisterComponent } from '../../renderer/componentRegistry'
import { registerEditor, unregisterEditor } from '../../editor/editorRegistry'
import { registerShortcut, mountShortcut, emitShortcutAction } from '../../events/ShortcutService'
import { subscribeEvent } from '../../events/eventBus'
import { emitPluginEvent, onPluginEvent, type PluginEvent } from './eventBus'
import { createPluginStorage, type PluginStorage } from './storage'
import { createEntityStore, type EntityStoreApi, type EntityStoreConfig } from './entityStore'
import { modalApi, type ModalApi } from './modal'
import { clipboardApi, type ClipboardApi } from './clipboard'
import { createAuditLog, type AuditLogApi } from './auditLog'
import { animationApi, type AnimationApi } from './animations'
import { themeStore } from '../../store/theme'
import { formatValue, formatNumber } from '../../renderer/format'
import { iconView } from '../../renderer/icon'
import { configStore } from '../../store/config'
import { pageStore } from '../../store/page'
import { routerStore } from '../../store/router'
import { sessionStore } from '../../store/session'
import { dataStore } from '../../store/data'
import { toasts } from '../../store/toasts'
import type { ShortcutEntry } from '../../protocol/types'
import type { ComponentType } from 'preact'

// ── Types ───────────────────────────────────────────────────────

export interface PluginContextOptions {
  pluginId: string
}

export interface PluginContext {
  /** Unique plugin identifier */
  readonly pluginId: string

  // ── Component Registry ──────────────────────────────────────────
  registerComponent(type: string, component: ComponentType): () => void
  unregisterComponent(type: string): void

  // ── Editor Registry ─────────────────────────────────────────────
  registerEditor(type: string, loader: () => Promise<{ default: ComponentType }>): () => void
  unregisterEditor(type: string): void

  // ── Shortcuts ───────────────────────────────────────────────────
  registerShortcut(entry: ShortcutEntry): () => void
  mountShortcut(entry: ShortcutEntry): () => void
  emitShortcutAction(entry: ShortcutEntry): void

  // ── Events ──────────────────────────────────────────────────────
  /** Emit a plugin event (listenable by other plugins via onPluginEvent) */
  emit(name: string, payload?: unknown): void
  /** Listen for plugin events (from any plugin) */
  on(name: string, handler: (event: PluginEvent) => void): () => void
  /** Listen for global runtime events */
  onRuntimeEvent(handler: (event: import('../../protocol/envelope').RuntimeEvent) => void): () => void

  // ── Storage ─────────────────────────────────────────────────────
  readonly storage: PluginStorage

  // ── Entity Store ────────────────────────────────────────────────
  createEntityStore(config: Omit<EntityStoreConfig, 'pluginId'>): EntityStoreApi

  // ── Modals / Overlays ───────────────────────────────────────────
  readonly modal: ModalApi

  // ── Clipboard ───────────────────────────────────────────────────
  readonly clipboard: ClipboardApi

  // ── Audit Log ───────────────────────────────────────────────────
  createAuditLog(maxSize?: number): AuditLogApi

  // ── Animations ──────────────────────────────────────────────────
  readonly animation: AnimationApi

  // ── Theme (read-only) ───────────────────────────────────────────
  readonly theme: typeof themeStore
  /** Register plugin-contributed theme tokens */
  registerThemeTokens(tokens: Record<string, string>): () => void

  // ── Router ──────────────────────────────────────────────────────
  readonly router: {
    open(pageId: string): void
    get activePageId(): string | null
  }

  // ── Format / Icon utilities ─────────────────────────────────────
  format: typeof formatValue
  formatNumber: typeof formatNumber
  icon: typeof iconView

  // ── Config access (read-only) ───────────────────────────────────
  readonly config: typeof configStore
  readonly session: typeof sessionStore
  readonly data: typeof dataStore
  readonly toasts: typeof toasts
}

// ── Factory ────────────────────────────────────────────────────

export function createPluginContext(options: PluginContextOptions): PluginContext {
  const { pluginId } = options
  const storage = createPluginStorage(pluginId)
  const cleanupFns: Array<() => void> = []

  return {
    pluginId,

    // ── Component Registry ──────────────────────────────────────────
    registerComponent(type, component) {
      const unsub = registerComponent(type, component)
      cleanupFns.push(unsub)
      return unsub
    },
    unregisterComponent(type) {
      unregisterComponent(type)
    },

    // ── Editor Registry ─────────────────────────────────────────────
    registerEditor(type, loader) {
      const unsub = registerEditor(type, loader)
      cleanupFns.push(unsub)
      return unsub
    },
    unregisterEditor(type) {
      unregisterEditor(type)
    },

    // ── Shortcuts ───────────────────────────────────────────────────
    registerShortcut(entry) {
      const unsub = registerShortcut(entry)
      cleanupFns.push(unsub)
      return unsub
    },
    mountShortcut(entry) {
      // mountShortcut doesn't return a cleanup fn in the current API
      mountShortcut(entry)
    },
    emitShortcutAction(entry) {
      emitShortcutAction(entry)
    },

    // ── Events ──────────────────────────────────────────────────────
    emit(name, payload) {
      emitPluginEvent({ from: pluginId, name, payload })
    },
    on(name, handler) {
      const unsub = onPluginEvent(name, handler)
      cleanupFns.push(unsub)
      return unsub
    },
    onRuntimeEvent(handler) {
      const unsub = subscribeEvent(handler)
      cleanupFns.push(unsub)
      return unsub
    },

    // ── Storage ─────────────────────────────────────────────────────
    storage,

    // ── Entity Store ────────────────────────────────────────────────
    createEntityStore(config) {
      return createEntityStore({ ...config, pluginId })
    },

    // ── Modals / Overlays ───────────────────────────────────────────
    modal: modalApi,

    // ── Clipboard ───────────────────────────────────────────────────
    clipboard: clipboardApi,

    // ── Audit Log ───────────────────────────────────────────────────
    createAuditLog(maxSize) {
      return createAuditLog(maxSize)
    },

    // ── Animations ──────────────────────────────────────────────────
    animation: animationApi,

    // ── Theme ───────────────────────────────────────────────────────
    theme: themeStore,

    registerThemeTokens(tokens) {
      const unsub = themeStore.registerPluginTokens(pluginId, tokens)
      cleanupFns.push(unsub)
      return unsub
    },

    // ── Router ──────────────────────────────────────────────────────
    router: {
      open(pageId) { routerStore.open(pageId) },
      get activePageId() { return pageStore.activePageId }
    },

    // ── Format / Icon ───────────────────────────────────────────────
    format: formatValue,
    formatNumber,
    icon: iconView,

    // ── Config access ───────────────────────────────────────────────
    config: configStore,
    session: sessionStore,
    data: dataStore,
    toasts,

    /** @internal cleanup — called when plugin is unloaded */
    __cleanup() {
      cleanupFns.forEach((fn) => fn())
      cleanupFns.length = 0
      storage.clear()
    }
  } as PluginContext & { __cleanup(): void }
}
