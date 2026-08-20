/**
 * CutCruft Runtime Client — public API surface for plugin bundles.
 *
 * Plugin components import from '@cutcrft/runtime-client' which resolves
 * via an importmap to this file (built as a standalone ESM bundle).
 *
 * Usage in a plugin:
 *   import { useCfg, useData, sessionStore } from '@cutcrft/runtime-client'
 *
 * Framework note: the core runtime is Preact + @preact/signals. Stores are
 * exported as signal objects (`.value`) — consume them via `useSignal`/
 * `computed` from '@preact/signals', or read `.value` directly. Editor
 * bundles built as Vue SFCs may also import 'vue' (resolved by importmap)
 * and use `useCfg`/`useData` as before.
 */

// ── Config & Data composables ──────────────────────────────────
export { useCfg, withDefaults } from '../renderer/useConfig'
export { useData } from '../renderer/useData'
export { useContainerQuery } from '../renderer/useContainerQuery'

// ── Action & Binding engine ────────────────────────────────────
export {
  resolveParam,
  resolveParams,
  loadData,
  dispatchAction,
  findAction,
  runAction
} from '../renderer/bindingEngine'
export type { LoadResult } from '../renderer/bindingEngine'

// ── V6: model-driven binding (entityType / fields / disabledWhen) ──
export {
  entitySchema,
  isDisabledByModel,
  buildModelParams,
  missingRequiredFields
} from '../renderer/modelBinding'

// ── Formatting ─────────────────────────────────────────────────
export { formatValue, formatNumber } from '../renderer/format'
export { iconView } from '../renderer/icon'
export type { IconView } from '../renderer/icon'

// ── Stores ─────────────────────────────────────────────────────
export { configStore } from '../store/config'
export { sessionStore } from '../store/session'
export { dataStore } from '../store/data'
export { i18nStore, useI18n } from '../store/i18n'
export { pageStore } from '../store/page'
export { routerStore } from '../store/router'
export { themeStore } from '../store/theme'
export { toasts } from '../store/toasts'
export { cursorStore } from '../store/cursors'
export { presenceStore } from '../store/presence'
export { layerStore } from '../store/layer'

// ── Core primitives (re-exported as named) ──────────────────────
export { Container, Page, Section, Layer, Tabs, ToastViewport as Toast, Stack, Grid, Slot, Portal } from '../core/primitives'

// ── Theme provider ──────────────────────────────────────────────
export { ThemeProvider } from '../core/ThemeProvider'

// ── Component host (backward-compat alias for plugin bundles) ────
export { Container as ComponentHost } from '../core/primitives'

// ── Shortcut service ───────────────────────────────────────────
export { mountShortcut, registerShortcut, emitShortcutAction, listShortcuts, reassignShortcut, formatCombo } from '../events/ShortcutService'

// ── Overlay service ────────────────────────────────────────────
export { overlayService } from '../overlay/overlayService'

// ── Event bus ──────────────────────────────────────────────────
export { subscribeEvent, emitEvent } from '../events/eventBus'
export type { RuntimeEvent } from '../protocol/envelope'
export type { FieldError, CommandResultPayload, WsEnvelope } from '../protocol/envelope'

// ── Field errors (structured validation errors from command results) ──
/** Returns field→message map from a command result payload (fieldErrors[] → {field: message}). */
export function fieldErrorMap(result: { fieldErrors?: Array<{ field: string; message: string }> }): Record<string, string> {
  const map: Record<string, string> = {}
  for (const fe of result.fieldErrors ?? []) {
    map[fe.field] = fe.message
  }
  return map
}

// ── Registry ───────────────────────────────────────────────────
export { registerComponent, resolveComponent, registeredTypes, unregisterComponent } from '../renderer/componentRegistry'
export { registerEditor, registerEditorComponent, resolveEditor, isEditorType, registeredEditorTypes, unregisterEditor } from '../editor/editorRegistry'
export type { EditorLoader } from '../editor/editorRegistry'

// ── Plugin Context (new API for plugin authors) ────────────────
export { createPluginContext } from '../core/services/pluginContext'
export type { PluginContext, PluginContextOptions } from '../core/services/pluginContext'

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
} from '../core/services'
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
} from '../core/services'

// ── Types (for plugin TypeScript consumers) ────────────────────
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
} from '../protocol/componentSpec'

export type {
  ComponentDefinition,
  SectionDefinition,
  PageDefinition,
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
} from '../protocol/types'
