export interface AppTheme {
  mode: string
  tokens: Record<string, string>
}

export interface AppShell {
  title: string
  logo: string | null
  layout: string
  landingPageId: string | null
  theme: AppTheme
}

export interface NavigationEntry {
  id: string
  label: string
  pageId?: string
  order?: number
  pluginId?: string
  group?: string
  icon?: string
}

export interface ComponentDefinition {
  type: string
  config: Record<string, unknown>
}

export interface SectionDefinition {
  id: string
  layout: string
  columns: number
  components: ComponentDefinition[]
}

export interface PageDefinition {
  id: string
  title: string
  sections: SectionDefinition[]
  layers?: LayerDefinition[]
}

export interface LayerDefinition {
  id: string
  title?: string
  order: number
  visible?: boolean
  opacity?: number
  position?: LayerPosition
  pointerEvents?: 'auto' | 'none' | 'pass-through'
  className?: string
  style?: Record<string, string>
  sections: SectionDefinition[]
}

export interface LayerPosition {
  type?: 'relative' | 'absolute' | 'fixed'
  top?: string
  left?: string
  right?: string
  bottom?: string
  width?: string
  height?: string
}

export type ShortcutScope = 'global' | 'page' | 'component'
export type ShortcutAction = 'navigate' | 'command' | 'event' | 'pageBack' | 'pageForward'

export interface ShortcutEntry {
  id: string
  keys: string[]
  action: ShortcutAction
  command?: string
  params?: Record<string, unknown>
  page?: string
  scope: ShortcutScope
}

export type SubscriptionAction = 'refresh' | 'command' | 'toast'

export interface SubscriptionEntry {
  id: string
  event: string
  filter?: Record<string, unknown>
  action: SubscriptionAction
  target?: string
  command?: string
  params?: Record<string, unknown>
}

export interface CommandParameterEntry {
  name: string
  type: string
  required: boolean
  description: string
}

export interface CommandEntry {
  id: string
  description: string
  group?: string
  type?: string
  visibility?: string
  steps?: string[]
  parameters?: CommandParameterEntry[]
}

export interface EntityEntry {
  type: string
}

export interface MenuItemEntry {
  label: string
  icon?: string
  command?: string
  params?: Record<string, unknown>
  spec?: Record<string, unknown>
  confirm?: string
  items?: MenuItemEntry[]
  divider?: boolean
  disabled?: boolean
  danger?: boolean
  shortcut?: string
}

export interface OverlayEntry {
  id: string
  kind: string
  title?: string
  content?: ComponentDefinition
  items?: MenuItemEntry[]
  width?: string
  side?: string
  text?: string
  placement?: string
}

export interface OverlayTriggerEntry {
  event: string
  componentType?: string
  objectType?: string
  componentId?: string
  overlay: string
  anchor?: string
}

export interface PluginComponentEntry {
  type: string
  pluginId: string
  name: string
  version: string
  bundleUrl: string
  cssUrl?: string
  schema?: Record<string, unknown>
  capabilities?: string[]
}

export interface TransportConfig {
  wsPath: string
}

export interface ProtocolMessageDoc {
  type: string
  direction: string
  description: string
}

export interface ProtocolDocs {
  messages: ProtocolMessageDoc[]
}

export type RoutingMode = 'hash' | 'history'

export interface RedirectRule {
  from: string
  to: string
}

export interface RoutingConfig {
  mode: RoutingMode
  redirects: RedirectRule[]
}

export interface I18nConfiguration {
  defaultLocale: string
  locales: string[]
  messages: Record<string, Record<string, string>>
}

export interface DevModeInfo {
  enabled: boolean
  pollIntervalMs: number
}

export interface WorkspaceConfig {
  app: AppShell
  navigation: NavigationEntry[]
  pages: PageDefinition[]
  shortcuts: ShortcutEntry[]
  subscriptions: SubscriptionEntry[]
  commands: CommandEntry[]
  entities: EntityEntry[]
  overlays: OverlayEntry[]
  overlayTriggers: OverlayTriggerEntry[]
  pluginComponents: PluginComponentEntry[]
  i18n: I18nConfiguration
  transport: TransportConfig
  routing: RoutingConfig
  protocol: ProtocolDocs
  dev: DevModeInfo
  collaboration: CollaborationConfig
}

export interface CollaborationConfig {
  enabled: boolean
  cursorsEnabled: boolean
}


