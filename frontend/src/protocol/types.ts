export interface ThemePalette {
  bg: string
  surface: string
  text: string
  muted: string
  border: string
  primary: string
  primaryHover: string
  danger: string
  success: string
  warning: string
  info: string
}

export interface ThemeTypography {
  fontFamily?: string
  headingFont?: string
  monospaceFont?: string
  baseSize?: string
  scale?: Record<string, string>
}

export interface ThemeRadii {
  sm?: string
  md?: string
  lg?: string
  xl?: string
}

export interface ThemeSpacing {
  xs?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
}

export interface ThemeMotion {
  duration?: Record<string, string>
  easing?: Record<string, string>
}

export interface AppTheme {
  mode: string
  tokens: Record<string, string>
  palette?: Record<'light' | 'dark', ThemePalette>
  typography?: ThemeTypography
  radii?: ThemeRadii
  spacing?: ThemeSpacing
  motion?: ThemeMotion
}

export interface ShellAction {
  id: string
  label?: string
  icon?: string
  action: string
  command?: string
  params?: Record<string, unknown>
  page?: string
  variant?: string
}

export interface ShellTopbar {
  brand?: boolean
  actions?: ShellAction[]
}

export interface ShellSidebar {
  groups?: NavigationEntry[]
}

/** V7.4: declarative app shell (topbar/sidebar) provided by a plugin via the App definition. */
export interface AppShell {
  topbar?: ShellTopbar
  sidebar?: ShellSidebar
}

export interface AppConfiguration {
  title: string
  logo: string | null
  layout: string
  landingPageId: string | null
  theme: AppTheme
  shell?: AppShell
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

export interface EntityFieldSchema {
  name: string
  type: string
  required?: boolean
  description?: string
  enumValues?: string[]
  min?: number
  max?: number
  pattern?: string
  reference?: string
  defaultValue?: unknown
}

export interface EntitySchema {
  type: string
  titleField?: string
  idField?: string
  fields?: EntityFieldSchema[]
}

export interface EntityEntry {
  type: string
  schema?: EntitySchema
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
  app: AppConfiguration
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


