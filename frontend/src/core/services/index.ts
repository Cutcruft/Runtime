// ── Core Services — plugin-facing API surface ────────────────────

export { createPluginContext, type PluginContext, type PluginContextOptions } from './pluginContext'

// Sub-services (also usable standalone)
export { emitPluginEvent, onPluginEvent, clearPluginEventHandlers } from './eventBus'
export type { PluginEvent } from './eventBus'
export { createPluginStorage, type PluginStorage } from './storage'
export { createEntityStore, type EntityStoreApi, type EntityStoreConfig } from './entityStore'
export { modalApi, type ModalApi, type ModalOptions, type MenuOptions, type MenuItem, type PanelOptions, type TooltipOptions, type ModalHandle } from './modal'
export { clipboardApi, type ClipboardApi } from './clipboard'
export { createAuditLog, type AuditLogApi, type AuditEntry } from './auditLog'
export { animationApi, type AnimationApi, type AnimationOptions } from './animations'
