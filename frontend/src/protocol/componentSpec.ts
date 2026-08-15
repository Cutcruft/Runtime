import type { ComponentDefinition } from './types'

// ---------------------------------------------------------------
// Binding specification
// ---------------------------------------------------------------

export interface DataBinding {
  /** Command id used to load data (e.g. "demo.list") */
  command: string
  /** Static params merged with context-resolved params */
  params?: Record<string, unknown>
  /** Entity type to auto-refresh on object.changed events */
  entityType?: string
}

export type ActionSpec =
  | { action: 'command'; command: string; params?: Record<string, unknown> }
  | { action: 'navigate'; page: string }
  | { action: 'toast'; message: string }

export interface ActionBinding {
  /** Component event name: click, submit, rowSelect, rowDelete, change, tabsChange, … */
  event: string
  spec: ActionSpec
  /** Optional confirmation message shown before executing */
  confirm?: string
}

/** Runtime context available to bindings (row, form values, page, …) */
export interface BindingContext {
  row?: Record<string, unknown>
  values?: Record<string, unknown>
  page?: string | null
  /** Arbitrary event payload merged by interactive components (selection, tabs, …) */
  payload?: Record<string, unknown>
}

// ---------------------------------------------------------------
// Base spec shared by every component
// ---------------------------------------------------------------

export interface BaseComponentConfig {
  id?: string
  title?: string
  tooltip?: string
  className?: string
  /** Arbitrary CSS property overrides, e.g. { marginTop: '0.5rem', fontSize: '12px' } */
  style?: Record<string, string>
  hidden?: boolean
  disabled?: boolean
  loading?: boolean
  emptyText?: string
  data?: DataBinding
  actions?: ActionBinding[]
  /** Children, used by container components (Card, Tabs, Grid, Space) */
  components?: ComponentDefinition[]
}

// ---------------------------------------------------------------
// Individual component configs
// ---------------------------------------------------------------

export interface TextConfig extends BaseComponentConfig {
  text?: string
  /** html tag: h1..h6, p, span, strong, em, small */
  tag?: string
  size?: string
  weight?: string
  color?: string
  align?: 'left' | 'center' | 'right'
}

export interface ImageConfig extends BaseComponentConfig {
  src?: string
  alt?: string
  fit?: 'cover' | 'contain' | 'fill' | 'none'
  width?: string
  height?: string
}

export type ButtonVariant = 'default' | 'primary' | 'danger' | 'ghost' | 'link'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonConfig extends BaseComponentConfig {
  label?: string
  variant?: ButtonVariant
  size?: ButtonSize
  /** Emoji or text glyph shown before the label */
  icon?: string
  shortcutKeys?: string[]
  /** Convenience: executes this command on click (equivalent to an actions/click binding) */
  command?: string
  params?: Record<string, unknown>
}

export type BadgeTone = 'neutral' | 'gray' | 'blue' | 'green' | 'red' | 'amber' | 'purple'

export interface BadgeConfig extends BaseComponentConfig {
  text?: string
  tone?: BadgeTone
}

export interface DividerConfig extends BaseComponentConfig {
  text?: string
  dashed?: boolean
}

export interface SpaceConfig extends BaseComponentConfig {
  direction?: 'horizontal' | 'vertical'
  gap?: string
  align?: 'start' | 'center' | 'end' | 'stretch'
  wrap?: boolean
}

export interface CardConfig extends BaseComponentConfig {
  title?: string
  subtitle?: string
  bordered?: boolean
  padding?: string
  /** Header-level buttons rendered on the right side of the card header */
  headerActions?: Array<{ label?: string; variant?: ButtonVariant; command?: string; params?: Record<string, unknown> }>
}

export interface TabsItemConfig {
  id: string
  label: string
  components?: ComponentDefinition[]
  disabled?: boolean
}

export interface TabsConfig extends BaseComponentConfig {
  tabs?: TabsItemConfig[]
  activeTab?: string
}

export interface GridConfig extends BaseComponentConfig {
  columns?: number
  gap?: string
}

export interface StatConfig extends BaseComponentConfig {
  label?: string
  /** Static value, or provided via data binding */
  value?: string | number
  /** For data bindings: pick this key from the result object */
  valueKey?: string
  prefix?: string
  suffix?: string
  precision?: number
  tone?: 'default' | 'green' | 'red' | 'blue' | 'amber'
  trend?: 'up' | 'down' | 'flat'
}

export interface ListConfig extends BaseComponentConfig {
  /** Which field of each row to render as the primary label */
  labelField?: string
  /** Optional secondary field rendered right-aligned */
  valueField?: string
  /** Optional nested component rendered per row (context provides `row`) */
  itemTemplate?: ComponentDefinition
  itemKey?: string
}

export type ColumnRender = 'text' | 'badge' | 'boolean'

export interface TableColumnConfig {
  key: string
  label?: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  render?: ColumnRender
  /** For render: 'badge' — map a value to a badge tone */
  badge?: { toneField?: string; tones?: Record<string, BadgeTone> }
}

export interface TableRowAction {
  label: string
  command?: string
  params?: Record<string, unknown>
  spec?: ActionSpec
  confirm?: string
  variant?: 'default' | 'danger'
}

export interface TablePaginationConfig {
  pageSize?: number
  pageSizeOptions?: number[]
}

export interface TableConfig extends BaseComponentConfig {
  columns?: TableColumnConfig[]
  /** Convenience: deletes a row via this command with { id } params */
  deleteCommand?: string
  searchable?: boolean
  /** Default sortability for columns without explicit `sortable` */
  sortable?: boolean
  selectable?: boolean
  pagination?: TablePaginationConfig | false
  rowActions?: TableRowAction[]
  showRefresh?: boolean
  showRowCount?: boolean
}

export type FormFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'

export interface FormFieldOptions {
  command: string
  params?: Record<string, unknown>
  valueKey: string
  labelKey: string
}

export interface FormFieldConfig {
  name: string
  label?: string
  type?: FormFieldType
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  rows?: number
  defaultValue?: string | number | boolean
  disabled?: boolean
  options?: FormFieldOptions
}

export interface FormLayoutConfig {
  columns?: number
  gap?: string
}

export interface FormConfig extends BaseComponentConfig {
  command?: string
  submitLabel?: string
  resetLabel?: string
  fields?: FormFieldConfig[]
  layout?: FormLayoutConfig
  showReset?: boolean
}

export interface InputConfig extends BaseComponentConfig {
  label?: string
  placeholder?: string
  type?: 'text' | 'number' | 'email' | 'password'
  defaultValue?: string | number
}

export interface SelectConfig extends BaseComponentConfig {
  label?: string
  placeholder?: string
  options?: FormFieldOptions
  defaultValue?: string
}

export interface TextareaConfig extends BaseComponentConfig {
  label?: string
  placeholder?: string
  rows?: number
  defaultValue?: string
}

export interface CheckboxConfig extends BaseComponentConfig {
  label?: string
  defaultValue?: boolean
}
