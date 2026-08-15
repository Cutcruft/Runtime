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
}

export type ShortcutScope = 'global' | 'page' | 'component'
export type ShortcutAction = 'navigate' | 'command' | 'event'

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

export interface CommandEntry {
  id: string
  description: string
}

export interface EntityEntry {
  type: string
}

export interface TransportConfig {
  wsPath: string
}

export interface WorkspaceConfig {
  app: AppShell
  navigation: NavigationEntry[]
  pages: PageDefinition[]
  shortcuts: ShortcutEntry[]
  subscriptions: SubscriptionEntry[]
  commands: CommandEntry[]
  entities: EntityEntry[]
  transport: TransportConfig
}

export interface TableColumnsConfig {
  key: string
  label?: string
}

export interface FormFieldOptions {
  command: string
  valueKey: string
  labelKey: string
}

export interface FormFieldConfig {
  name: string
  label?: string
  type: 'text' | 'select' | 'number'
  options?: FormFieldOptions
  placeholder?: string
}
