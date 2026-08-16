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
  | { action: 'openModal'; overlay: string; params?: Record<string, unknown> }
  | { action: 'openPanel'; overlay: string; params?: Record<string, unknown> }
  | { action: 'openMenu'; overlay: string; params?: Record<string, unknown> }
  | { action: 'closeOverlay' }
  | { action: 'copyToClipboard'; value?: string }
  | { action: 'editor'; editor: string; command: string; params?: Record<string, unknown> }

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
// Overlay / gesture specification (context menus, modals, panels, tooltips)
// ---------------------------------------------------------------

export type OverlayKind = 'menu' | 'modal' | 'panel' | 'tooltip'

export interface MenuItemSpec {
  label: string
  icon?: string
  /** Execute a command with params (supports `$row.id`-style context resolution) */
  command?: string
  params?: Record<string, unknown>
  /** Arbitrary action instead of a command */
  spec?: ActionSpec
  confirm?: string
  items?: MenuItemSpec[]
  divider?: boolean
  disabled?: boolean
  danger?: boolean
  shortcut?: string
}

export type OverlayPlacement = 'top' | 'right' | 'bottom' | 'left'

/** Declarative definition of an overlay rendered by the overlay hosts. */
export interface OverlayDefinition {
  /** Referenced by triggers and actions */
  id: string
  kind: OverlayKind
  /** menu items (kind: menu) */
  items?: MenuItemSpec[]
  /** modal/panel heading */
  title?: string
  /** modal/panel body rendered via ComponentHost */
  content?: ComponentDefinition
  /** width for modal/panel, e.g. "520px" or "min(90vw, 40rem)" */
  width?: string
  /** panel docking side (kind: panel) */
  side?: 'left' | 'right' | 'bottom'
  /** tooltip text (kind: tooltip) */
  text?: string
  placement?: OverlayPlacement
}

export type GestureEventName = 'contextmenu' | 'dblclick' | 'selection' | 'hover' | 'drag'

/** Binds a gesture to an overlay (component-level or workspace-level). */
export interface OverlayTriggerSpec {
  event: GestureEventName
  /** Restrict to a component type (e.g. "Table") */
  componentType?: string
  /** Restrict to rows of an entity type (e.g. "demo.task") */
  objectType?: string
  /** Restrict to a component by id */
  componentId?: string
  /** OverlayDefinition id to open */
  overlay: string
  /** anchor: at pointer; center: centered (modals) */
  anchor?: 'pointer' | 'center'
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
  /** Local overlay definitions (menus, modals, panels, tooltips) */
  overlays?: OverlayDefinition[]
  /** Gesture bindings for local overlays */
  overlayTriggers?: OverlayTriggerSpec[]
}

// ---------------------------------------------------------------
// Editor base spec (RichText, Diagram, Scene3D, Canvas2D)
// ---------------------------------------------------------------

/** Persistence contract shared by every editor component. */
export interface EditorSaveSpec {
  /** Command that persists the editor content (e.g. "demo.document.save") */
  command: string
  /** Extra params merged with the saved content payload */
  params?: Record<string, unknown>
}

export interface EditorBaseConfig extends BaseComponentConfig {
  /** Loads initial content via a command; the editor binds its internal state to this */
  content?: DataBinding
  /** Save contract: content + params are sent to `save.command` */
  save?: EditorSaveSpec
  /** Disable editing, render as read-only */
  readonly?: boolean
  /** Fixed editor height, e.g. "480px" or "60vh" */
  height?: string
  placeholder?: string
}

// ---------------------------------------------------------------
// RichText (TipTap)
// ---------------------------------------------------------------

export type RichTextToolbarButton =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'blockquote'
  | 'codeBlock'
  | 'link'
  | 'image'
  | 'table'
  | 'undo'
  | 'redo'

export type RichTextContentFormat = 'html' | 'json'

/** @-mention autocomplete. Options are loaded via a plugin command (`[{id,label}]` or `{items:[…]}`). */
export interface MentionSpec {
  /** Command that returns mention candidates */
  command: string
  /** Static params for the command */
  params?: Record<string, unknown>
  /** Trigger character (default `@`) */
  trigger?: string
}

export interface RichTextConfig extends EditorBaseConfig {
  /** Toolbar buttons to show (default: all enabled); `false` hides the toolbar entirely */
  toolbar?: RichTextToolbarButton[] | false
  /** Extra TipTap extensions, e.g. [{ name: 'link', options: { openOnClick: false } }] */
  extensions?: Record<string, unknown>[]
  /** How content is persisted: 'html' (default) or 'json' */
  contentFormat?: RichTextContentFormat
  /** @-mention autocomplete fed by a plugin command */
  mentions?: MentionSpec
}

// ---------------------------------------------------------------
// Diagram (AntV X6)
// ---------------------------------------------------------------

export type DiagramToolbarButton = 'addRect' | 'addEllipse' | 'addEdge' | 'delete' | 'fit' | 'layout' | 'undo' | 'redo'

export interface DiagramNodeSpec {
  id: string
  shape?: 'rect' | 'ellipse' | 'image'
  x: number
  y: number
  width?: number
  height?: number
  label?: string
  fill?: string
  stroke?: string
  /** Shown as the label text color for non-image nodes */
  color?: string
  /** Source URL for image nodes (relative URLs resolve against the app origin) */
  imageUrl?: string
}

export interface DiagramEdgeSpec {
  id?: string
  source: string
  target: string
  label?: string
  /** Router used for the edge */
  line?: 'rounded' | 'smooth' | 'manhattan' | 'metro'
  color?: string
}

export interface DiagramContent {
  nodes: DiagramNodeSpec[]
  edges: DiagramEdgeSpec[]
}

/** Node template used by the stencil palette (all shapes supported, no position required) */
export interface DiagramStencilNodeSpec {
  shape?: 'rect' | 'ellipse' | 'image'
  label?: string
  fill?: string
  stroke?: string
  /** Shown as the label text color for non-image nodes */
  color?: string
  /** Source URL for image nodes */
  imageUrl?: string
  width?: number
  height?: number
}

export type DiagramLayoutType = 'grid' | 'dagre' | 'circle'

export interface DiagramConfig extends EditorBaseConfig {
  /** Toolbar buttons (default: all); `false` hides the toolbar entirely */
  toolbar?: DiagramToolbarButton[] | false
  /** Show grid background (default true) */
  grid?: boolean
  /** Pan the canvas by dragging the background (default true) */
  panning?: boolean
  /** Wheel zoom, requires ctrl/cmd (default false) */
  mousewheel?: boolean
  /** Snap shapes to grid (default true) */
  snap?: boolean
  /** Undo/redo history + clipboard keyboard shortcuts (default true) */
  history?: boolean
  /** Layout algorithm + gaps used by the layout toolbar button */
  layout?: { type?: DiagramLayoutType; gapX?: number; gapY?: number }
  /** Stencil palette (draggable node templates shown on the left) */
  stencil?: { nodes: DiagramStencilNodeSpec[] }
}

// ---------------------------------------------------------------
// Scene3D (three.js)
// ---------------------------------------------------------------

export type Scene3DObjectKind = 'box' | 'sphere' | 'cylinder' | 'model'
export type Scene3DToolbarButton = 'addBox' | 'addSphere' | 'addCylinder' | 'delete' | 'resetCamera'

export interface Scene3DObjectSpec {
  id: string
  kind: Scene3DObjectKind
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  color?: string
  /** URL of a glTF/GLB model for kind 'model' (relative URLs resolve against the app origin) */
  modelUrl?: string
  /** Nested objects attached to this object (positions are relative to the parent) */
  children?: Scene3DObjectSpec[]
}

export interface Scene3DContent {
  objects: Scene3DObjectSpec[]
  background?: string
  grid?: boolean
}

export interface Scene3DCameraConfig {
  /** Field of view in degrees (default 50) */
  fov?: number
  /** Initial camera position (default [4, 3.5, 5]) */
  position?: [number, number, number]
  /** Point the camera looks at (default [0, 0, 0]) */
  target?: [number, number, number]
}

export interface Scene3DLightConfig {
  ambient?: { intensity?: number }
  directional?: { intensity?: number; position?: [number, number, number] }
}

export interface Scene3DFogConfig {
  /** Fog color (default background) */
  color?: string
  /** Distance from the camera where fog starts (default 8) */
  near?: number
  /** Distance where objects are fully fogged out (default 25) */
  far?: number
}

export interface Scene3DConfig extends EditorBaseConfig {
  /** Toolbar buttons (default: all); `false` hides the toolbar entirely */
  toolbar?: Scene3DToolbarButton[] | false
  /** Background color of the viewport */
  background?: string
  /** Show ground grid (default true) */
  grid?: boolean
  /** Slowly auto-rotate the camera (default false) */
  autoRotate?: boolean
  /** Initial camera framing (applies on load and on "Reset camera") */
  camera?: Scene3DCameraConfig
  /** Scene lights (default ambient 0.7 + directional 1.2) */
  lights?: Scene3DLightConfig
  /** Distance fog (off by default) */
  fog?: Scene3DFogConfig
}

// ---------------------------------------------------------------
// Canvas2D (drawing board)
// ---------------------------------------------------------------

export type Canvas2DTool = 'select' | 'pan' | 'draw' | 'erase' | 'rect' | 'ellipse' | 'line' | 'arrow'
export type Canvas2DToolbarButton = Canvas2DTool | 'clear' | 'front' | 'back' | 'undo' | 'redo'

export interface Canvas2DPoint {
  x: number
  y: number
}

export interface Canvas2DElement {
  /** Stable id (assigned on creation, kept through saves) */
  id?: string
  type: 'path' | 'rect' | 'ellipse' | 'line' | 'arrow'
  points: Canvas2DPoint[]
  color: string
  width: number
}

export interface Canvas2DContent {
  elements: Canvas2DElement[]
  background?: string
}

export interface Canvas2DConfig extends EditorBaseConfig {
  /** Toolbar buttons (default: all); `false` hides the toolbar entirely */
  toolbar?: Canvas2DToolbarButton[] | false
  /** Palette shown in the toolbar (default: black/red/blue/green/amber/purple) */
  colors?: string[]
  /** Stroke widths shown in the toolbar (default: 2/4/8) */
  widths?: number[]
  /** Background color of the board */
  background?: string
  /** Show dotted grid (default false) */
  grid?: boolean
  /** Initial drawing tool */
  tool?: Canvas2DTool
  /** Initial stroke color */
  strokeColor?: string
  /** Initial stroke width */
  strokeWidth?: number
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

export interface FrameConfig extends BaseComponentConfig {
  /** URL, relative path, `page:<id>` (embed) or `asset:<pluginId>/<path>` (plugin asset). */
  src: string
  width?: string
  height?: string
  title?: string
  sandbox?: string
}

export interface TabsConfig extends BaseComponentConfig {
  tabs?: TabsItemConfig[]
  activeTab?: string
}

export interface GridConfig extends BaseComponentConfig {
  columns?: number
  gap?: string
}

export interface AvatarConfig extends BaseComponentConfig {
  /** Name used to derive initials when src/fallback are missing */
  name?: string
  /** Direct image URL (relative asset paths resolve against the app origin) */
  src?: string
  /** Explicit initials, overrides derived ones */
  fallback?: string
  size?: 'small' | 'medium' | 'large'
  tone?: BadgeTone
}

export interface ProgressConfig extends BaseComponentConfig {
  /** Current value (0..100). For data bindings, use `data` + `valueKey`. */
  value?: number
  valueKey?: string
  tone?: 'default' | 'green' | 'red' | 'blue' | 'amber'
  showLabel?: boolean
  /** Label override for the right-aligned text */
  label?: string
}

export interface AccordionItemConfig {
  id: string
  label: string
  components?: ComponentDefinition[]
  open?: boolean
  disabled?: boolean
}

export interface AccordionConfig extends BaseComponentConfig {
  items?: AccordionItemConfig[]
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
  /** Drag-to-reorder rows. Fires the `reorder` action with { from, to, row } payload */
  sortable?: boolean
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
