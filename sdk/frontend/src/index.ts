/**
 * @cutcrft/plugin-sdk
 *
 * Public TypeScript API for building CutCruft frontend modules & plugins.
 *
 * Modules (ui-base, editor-*) import primitives/editors from this package;
 * the core runtime's importmap resolves this to the built SDK bundle.
 *
 * What lives here:
 *   - Stores (config/session/data/i18n/...)
 *   - Registries (component/editor) — the "HashMap type → class" registration
 *   - Renderer helpers (bindingEngine, useData, useCfg, ...)
 *   - Core services (storage/entity store/modal/clipboard/audit/animation)
 *   - Protocol types (config, component specs, envelopes)
 *
 * What does NOT live here: UI primitives (Button/Table/...) live in the ui-base
 * module; editors (RichText/Diagram/...) live in the editor modules. They register
 * themselves through the registries exported below.
 */

// ── Config & Data composables ──────────────────────────────────
export { useCfg, withDefaults } from './renderer/useConfig'
export { useData } from './renderer/useData'
export { useContainerQuery } from './renderer/useContainerQuery'

// ── Action & Binding engine ────────────────────────────────────
export {
  resolveParam,
  resolveParams,
  loadData,
  dispatchAction,
  findAction,
  runAction
} from './renderer/bindingEngine'
export type { LoadResult } from './renderer/bindingEngine'

// ── V6: model-driven binding (entityType / fields / disabledWhen) ──
export {
  entitySchema,
  isDisabledByModel,
  buildModelParams,
  missingRequiredFields
} from './renderer/modelBinding'

// ── Formatting ─────────────────────────────────────────────────
export { formatValue, formatNumber } from './renderer/format'
export { iconView } from './renderer/icon'
export type { IconView } from './renderer/icon'

// ── Stores ─────────────────────────────────────────────────────
export { configStore } from './store/config'
export { sessionStore } from './store/session'
export { dataStore } from './store/data'
export { i18nStore, useI18n } from './store/i18n'
export { pageStore } from './store/page'
export { routerStore } from './store/router'
export { themeStore } from './store/theme'
export { applyTheme } from './store/theme'
export { toasts } from './store/toasts'
export { cursorStore } from './store/cursors'
export { presenceStore } from './store/presence'
export { layerStore } from './store/layer'

// ── Shortcut service ───────────────────────────────────────────
export { mountShortcut, registerShortcut, emitShortcutAction, listShortcuts, reassignShortcut, formatCombo } from './events/ShortcutService'

// ── Overlay service (data) ─────────────────────────────────────
export { overlayService } from './overlay-service'
export type { OverlayInstance, OverlayAnchor, GestureSource } from './overlay-service'

// ── Event bus ──────────────────────────────────────────────────
export { subscribeEvent, emitEvent } from './events/eventBus'
export type { RuntimeEvent } from './protocol/envelope'
export type { FieldError, CommandResultPayload, WsEnvelope } from './protocol/envelope'

// ── Field errors (structured validation errors from command results) ──
/** Returns field→message map from a command result payload (fieldErrors[] → {field: message}). */
export function fieldErrorMap(result: { fieldErrors?: Array<{ field: string; message: string }> }): Record<string, string> {
  const map: Record<string, string> = {}
  for (const fe of result.fieldErrors ?? []) {
    map[fe.field] = fe.message
  }
  return map
}

// ── Registry (HashMap type → component) ────────────────────────
export { registerComponent, resolveComponent, registeredTypes, unregisterComponent } from './renderer/componentRegistry'
export { registerEditor, registerEditorComponent, resolveEditor, isEditorType, registeredEditorTypes, unregisterEditor } from './editor-registry'
export type { EditorLoader } from './editor-registry'

// ── Renderer host (renders a component tree by type from the registry) ──
export { Container, Container as ComponentHost } from './primitives/Container'

// ── Plugin/Module Context (new API for module authors) ─────────
export { createPluginContext } from './services/pluginContext'
export type { PluginContext, PluginContextOptions } from './services/pluginContext'

// ── Core Services ──────────────────────────────────────────────
export {
  emitPluginEvent,
  onPluginEvent,
  clearPluginEventHandlers,
  createPluginStorage,
  createEntityStore,
  modalApi,
  clipboardApi,
  createAuditLog,
  animationApi
} from './services'
export type {
  PluginEvent,
  PluginStorage,
  EntityStoreApi,
  EntityStoreConfig,
  AuditLogApi,
  AuditEntry,
  ModalApi,
  ModalOptions,
  MenuOptions,
  MenuItem,
  PanelOptions,
  ModalHandle,
  ClipboardApi,
  AnimationApi,
  AnimationOptions
} from './services'

// ── Types (for module/plugin TypeScript consumers) ─────────────
export type {
  BaseComponentConfig,
  EditorBaseConfig,
  EditorSaveSpec,
  DataBinding,
  ActionBinding,
  ActionSpec,
  BindingContext,
  OverlayDefinition,
  OverlayTriggerSpec,
  MenuItemSpec,
  OverlayKind,
  OverlayPlacement,
  GestureEventName,
  RichTextConfig,
  RichTextToolbarButton,
  RichTextContentFormat,
  MentionSpec,
  DiagramConfig,
  DiagramToolbarButton,
  DiagramNodeSpec,
  DiagramEdgeSpec,
  DiagramContent,
  DiagramStencilNodeSpec,
  DiagramLayoutType,
  Scene3DConfig,
  Scene3DToolbarButton,
  Scene3DObjectKind,
  Scene3DObjectSpec,
  Scene3DContent,
  Scene3DCameraConfig,
  Scene3DLightConfig,
  Scene3DFogConfig,
  Canvas2DConfig,
  Canvas2DTool,
  Canvas2DToolbarButton,
  Canvas2DPoint,
  Canvas2DElement,
  Canvas2DContent,
  TextConfig,
  ImageConfig,
  ButtonConfig,
  BadgeConfig,
  CardConfig,
  TabsConfig,
  GridConfig,
  TableConfig,
  FormConfig,
  ListConfig,
  StatConfig,
  AvatarConfig,
  ProgressConfig,
  AccordionConfig,
  InputConfig,
  SelectConfig,
  TextareaConfig,
  CheckboxConfig,
  SpaceConfig,
  DividerConfig,
  FrameConfig,
  FormFieldConfig,
  FormLayoutConfig,
  BadgeTone,
  TableColumnConfig,
  TableRowAction,
  TablePaginationConfig,
  TabsItemConfig,
  AccordionItemConfig,
  ButtonVariant,
  ButtonSize
} from './protocol/componentSpec'

export type {
  ComponentDefinition,
  SectionDefinition,
  PageDefinition,
  LayerDefinition,
  NavigationEntry,
  ShortcutEntry,
  SubscriptionEntry,
  CommandEntry,
  EntityEntry,
  OverlayEntry,
  OverlayTriggerEntry,
  WorkspaceConfig,
  AppShell,
  I18nConfiguration,
  RoutingConfig,
  ProtocolDocs,
  DevModeInfo,
  CollaborationConfig
} from './protocol/types'
