import { useSignal, computed } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import { Graph, Node, Cell } from '@antv/x6'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { History } from '@antv/x6-plugin-history'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { Dnd } from '@antv/x6-plugin-dnd'
import dagre from '@dagrejs/dagre'
import '@antv/x6/dist/index.css'
import { sessionStore } from '../store/session'
import { configStore } from '../store/config'
import { cursorStore } from '../store/cursors'
import { i18nStore } from '../store/i18n'
import { toasts } from '../store/toasts'
import { useCfg } from '../renderer/useConfig'
import { useData } from '../renderer/useData'
import { resolveParams } from '../renderer/bindingEngine'
import { overlayService } from '../overlay/overlayService'
import { subscribeEvent } from '../events/eventBus'
import type { BindingContext, DiagramConfig, DiagramContent, DiagramEdgeSpec, DiagramNodeSpec, DiagramStencilNodeSpec, DiagramToolbarButton } from '../protocol/componentSpec'
import '../styles/diagram.css'

interface ComponentProps {
  config: Record<string, unknown>
  context?: BindingContext
}

export default function UiDiagram(props: ComponentProps) {
  const t = i18nStore.t
  const cfg = useCfg<DiagramConfig>(props.config, {
    grid: true,
    panning: true,
    mousewheel: false,
    snap: true
  })

  const hostEl = useRef<HTMLDivElement | null>(null)
  const cursorOverlayEl = useRef<HTMLDivElement | null>(null)
  const graph = useSignal<Graph | null>(null)

  const componentId = computed(() => cfg.value.id)
  const editable = computed(() => !cfg.value.readonly && cfg.value.disabled !== true)
  const height = computed(() => cfg.value.height)

  const data = computed(() => cfg.value.content)
  const { value, error } = useData(() => data.value, () => props.context ?? {})

  let edgeMode = false
  let edgeSource: Node | null = null
  let saveTimer: ReturnType<typeof setTimeout> | null = null
  let cursorTimer: ReturnType<typeof setTimeout> | null = null
  let unsubEditorCommands: (() => void) | null = null
  let unsubCursorStore: (() => void) | null = null
  let dnd: Dnd | null = null

  const canUndo = useSignal(false)
  const canRedo = useSignal(false)

  const BODY_DEFAULTS = { rx: 6, ry: 6, strokeWidth: 1.5 }
  const LABEL_DEFAULTS = { fontSize: 13, fontFamily: 'system-ui, sans-serif' }

  const toolbarButtons: DiagramToolbarButton[] = ['addRect', 'addEllipse', 'addEdge', 'delete', 'fit', 'layout', 'undo', 'redo']
  const toolbar = cfg.value.toolbar === false ? [] : (cfg.value.toolbar ?? toolbarButtons)
  const stencilNodes = cfg.value.stencil?.nodes ?? []

  function nodeSpec(n: Node): DiagramNodeSpec {
    const spec: DiagramNodeSpec = {
      id: n.id,
      x: n.position().x,
      y: n.position().y,
      width: n.size().width,
      height: n.size().height
    }
    const shape = n.shape as string
    if (shape === 'image') {
      spec.shape = 'image'
      spec.imageUrl = (n.attr('image/xlink:href') as string | undefined) ?? undefined
    } else {
      spec.shape = shape === 'ellipse' ? 'ellipse' : 'rect'
      spec.label = (n.attr('label/text') as string | undefined) ?? undefined
      spec.fill = (n.attr('body/fill') as string | undefined) ?? undefined
      spec.stroke = (n.attr('body/stroke') as string | undefined) ?? undefined
      spec.color = (n.attr('label/fill') as string | undefined) ?? undefined
    }
    return spec
  }

  function contentFor(): string {
    const g = graph.value
    if (!g) return ''
    const content: DiagramContent = {
      nodes: g.getNodes().map(nodeSpec),
      edges: g.getEdges().map((edge): DiagramEdgeSpec => {
        const source = edge.getSourceCell()
        const target = edge.getTargetCell()
        return {
          id: edge.id,
          source: source instanceof Node ? source.id : (edge.getSourceCellId() ?? ''),
          target: target instanceof Node ? target.id : (edge.getTargetCellId() ?? ''),
          label: (edge.attr('label/text') as string | undefined) ?? undefined,
          color: (edge.attr('line/stroke') as string | undefined) ?? undefined
        }
      })
    }
    return JSON.stringify(content)
  }

  function scheduleSave(): void {
    if (!editable.value || !cfg.value.save?.command) return
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => { void save() }, 600)
  }

  async function save(): Promise<void> {
    if (!cfg.value.save?.command) return
    const payload = { ...(cfg.value.save.params ?? {}), content: contentFor() }
    try {
      await sessionStore.executeCommand(cfg.value.save.command, resolveParams(payload, props.context ?? {}))
      toasts.push({ message: t('core.editor.saved'), kind: 'success' })
    } catch { /* error toast shown by session store */ }
  }

  function buildNode(spec: DiagramNodeSpec): Record<string, unknown> {
    const width = spec.width ?? 140
    const height = spec.height ?? 48
    if (spec.shape === 'image') {
      return {
        id: spec.id,
        shape: 'image',
        x: spec.x ?? 0,
        y: spec.y ?? 0,
        width,
        height,
        attrs: { image: { 'xlink:href': spec.imageUrl ?? '', width, height, magnet: true } }
      }
    }
    return {
      id: spec.id,
      shape: spec.shape === 'ellipse' ? 'ellipse' : 'rect',
      x: spec.x ?? 0,
      y: spec.y ?? 0,
      width,
      height,
      attrs: {
        body: { ...BODY_DEFAULTS, fill: spec.fill ?? (spec.shape === 'ellipse' ? '#eef4ff' : '#f6f8fb'), stroke: spec.stroke ?? '#94a3b8', magnet: true },
        label: { ...LABEL_DEFAULTS, text: spec.label ?? '', fill: spec.color ?? '#1e293b' }
      }
    }
  }

  function buildEdge(spec: DiagramEdgeSpec): Record<string, unknown> {
    const router = spec.line && spec.line !== 'rounded' ? { name: spec.line } : undefined
    const connector = spec.line === 'manhattan' || spec.line === 'metro' ? { name: 'rounded' } : { name: spec.line ?? 'rounded' }
    return {
      id: spec.id,
      source: spec.source,
      target: spec.target,
      router,
      connector,
      attrs: {
        line: { stroke: spec.color ?? '#64748b', strokeWidth: 2 },
        label: { text: spec.label ?? '', fontSize: 12 }
      }
    }
  }

  function loadContent(content: DiagramContent): void {
    const g = graph.value
    if (!g) return
    g.clearCells()
    for (const spec of content.nodes ?? []) g.addNode(buildNode(spec))
    for (const spec of content.edges ?? []) g.addEdge(buildEdge(spec))
    if (content.nodes?.length) g.zoomToFit({ padding: 24, maxScale: 1.5 })
  }

  function addNode(shape: 'rect' | 'ellipse'): void {
    if (!graph.value || !editable.value) return
    const base = { x: 60 + Math.round(Math.random() * 180), y: 60 + Math.round(Math.random() * 120), width: 140, height: 48 }
    const spec: DiagramNodeSpec = { id: `${shape}_${Date.now()}`, shape, ...base, label: shape === 'ellipse' ? 'Ellipse' : 'Rectangle' }
    graph.value.addNode(buildNode(spec))
    scheduleSave()
  }

  function startAddEdge(): void {
    if (!graph.value || !editable.value) return
    edgeMode = true
    edgeSource = null
    toasts.push({ message: t('core.editor.diagram.pickSource'), kind: 'info' })
  }

  function deleteSelected(): void {
    if (!graph.value || !editable.value) return
    graph.value.getSelectedCells().forEach((cell) => cell.remove())
    scheduleSave()
  }

  function duplicateCell(cell: Cell): void {
    if (!graph.value) return
    if (cell instanceof Node) {
      const position = cell.position()
      graph.value.addNode(buildNode({ ...nodeSpec(cell), id: `${cell.shape}_${Date.now()}`, x: position.x + 24, y: position.y + 24 }))
    }
  }

  interface EditorCommandPayload {
    editor?: string
    command?: string
    componentId?: string
    params?: Record<string, unknown>
  }

  function handleEditorCommand(payload: EditorCommandPayload): void {
    if (payload.editor !== 'diagram') return
    if (payload.componentId && payload.componentId !== componentId.value) return
    if (!graph.value || !editable.value) return
    const id = payload.params?.id as string | undefined
    const cell = id ? graph.value.getCellById(id) : null
    if (!cell) return
    switch (payload.command) {
      case 'delete': cell.remove(); scheduleSave(); break
      case 'duplicate': duplicateCell(cell); scheduleSave(); break
      case 'front': cell.toFront(); scheduleSave(); break
      case 'back': cell.toBack(); scheduleSave(); break
    }
  }

  function fitView(): void {
    graph.value?.zoomToFit({ padding: 24, maxScale: 2 })
  }

  function layoutGrid(): void {
    const g = graph.value
    if (!g) return
    const nodes = g.getNodes()
    if (nodes.length === 0) return
    const sorted = [...nodes].sort((a, b) => {
      const pa = a.position()
      const pb = b.position()
      return pa.y - pb.y || pa.x - pb.x
    })
    const cols = Math.max(1, Math.ceil(Math.sqrt(nodes.length)))
    const gapX = cfg.value.layout?.gapX ?? 40
    const gapY = cfg.value.layout?.gapY ?? 40
    const colWidth = Math.max(...sorted.map((n) => n.size().width)) + gapX
    const rowHeight = Math.max(...sorted.map((n) => n.size().height)) + gapY
    sorted.forEach((n, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      n.position(col * colWidth, row * rowHeight)
    })
  }

  function layoutDagre(): void {
    const g = graph.value
    if (!g) return
    const nodes = g.getNodes()
    if (nodes.length === 0) return
    const dg = new dagre.graphlib.Graph()
    dg.setDefaultEdgeLabel(() => ({}))
    dg.setGraph({ rankdir: 'LR', nodesep: cfg.value.layout?.gapX ?? 40, ranksep: cfg.value.layout?.gapY ?? 40 })
    nodes.forEach((n) => dg.setNode(n.id, { width: n.size().width, height: n.size().height }))
    g.getEdges().forEach((e) => {
      const source = e.getSourceCellId()
      const target = e.getTargetCellId()
      if (source && target) dg.setEdge(source, target)
    })
    dagre.layout(dg)
    nodes.forEach((n) => {
      const pos = dg.node(n.id)
      if (pos) n.position(pos.x - n.size().width / 2, pos.y - n.size().height / 2)
    })
  }

  function layoutCircle(): void {
    const g = graph.value
    if (!g) return
    const nodes = g.getNodes()
    if (nodes.length === 0) return
    const count = nodes.length
    const gap = cfg.value.layout?.gapX ?? 60
    const maxW = Math.max(...nodes.map((n) => n.size().width))
    const maxH = Math.max(...nodes.map((n) => n.size().height))
    const radius = count <= 1 ? 0 : Math.max((maxW + maxH) / 2 + gap, (count * (maxW + gap)) / (2 * Math.PI))
    const centerX = maxW / 2
    const centerY = maxH / 2
    const sorted = [...nodes].sort((a, b) => a.id.localeCompare(b.id))
    sorted.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2
      n.position(centerX + radius * Math.cos(angle) - n.size().width / 2, centerY + radius * Math.sin(angle) - n.size().height / 2)
    })
  }

  function applyLayout(): void {
    if (!graph.value || !editable.value) return
    const type = cfg.value.layout?.type ?? 'grid'
    if (type === 'dagre') layoutDagre()
    else if (type === 'circle') layoutCircle()
    else layoutGrid()
    scheduleSave()
  }

  function updateHistoryState(): void {
    canUndo.value = graph.value?.canUndo() ?? false
    canRedo.value = graph.value?.canRedo() ?? false
  }

  function broadcastCursor(nodeId: string, x: number, y: number): void {
    if (!configStore.collaboration?.cursorsEnabled) return
    const entityType = cfg.value.content?.entityType ?? ''
    const objectId = (props.context?.row as Record<string, unknown>)?.id as string ?? ''
    if (!entityType || !objectId) return
    sessionStore.sendRaw('cursor.update', {
      entityType,
      objectId,
      position: { nodeId, x, y },
      selection: { nodeId },
      name: sessionStore.localParticipant?.name ?? 'Anonymous',
      color: sessionStore.localParticipant?.color ?? '#999'
    })
  }

  function scheduleCursorBroadcast(nodeId: string, x: number, y: number): void {
    if (cursorTimer) clearTimeout(cursorTimer)
    cursorTimer = setTimeout(() => broadcastCursor(nodeId, x, y), 100)
  }

  function renderDiagramCursors(): void {
    const overlay = cursorOverlayEl.current
    const g = graph.value
    if (!overlay || !g) return
    const entityType = cfg.value.content?.entityType ?? ''
    const objectId = (props.context?.row as Record<string, unknown>)?.id as string ?? ''
    const remoteCursors = cursorStore.getCursorsForObject(entityType, objectId)

    const existing = new Map<string, HTMLElement>()
    for (const child of Array.from(overlay.children)) {
      const el = child as HTMLElement
      const sid = el.dataset.cursorSession
      if (sid) existing.set(sid, el)
    }

    const seen = new Set<string>()
    for (const cursor of remoteCursors) {
      seen.add(cursor.sessionId)
      const pos = cursor.position as { nodeId?: string; x?: number; y?: number } | undefined
      if (!pos) continue
      let screenX: number
      let screenY: number
      if (pos.nodeId) {
        const node = g.getCellById(pos.nodeId)
        if (!(node instanceof Node)) continue
        const nodePos = node.position()
        const zoom = g.zoom()
        const translate = g.translate() as unknown as { x: number; y: number }
        screenX = (nodePos.x + (pos.x ?? 0)) * zoom + translate.x
        screenY = (nodePos.y + (pos.y ?? 0)) * zoom + translate.y
      } else {
        const zoom = g.zoom()
        const translate = g.translate() as unknown as { x: number; y: number }
        screenX = (pos.x ?? 0) * zoom + translate.x
        screenY = (pos.y ?? 0) * zoom + translate.y
      }
      let el = existing.get(cursor.sessionId)
      if (!el) {
        el = document.createElement('div')
        el.className = 'diagram-remote-cursor'
        el.dataset.cursorSession = cursor.sessionId
        const dot = document.createElement('div')
        dot.className = 'diagram-remote-cursor__dot'
        dot.style.background = cursor.color
        const label = document.createElement('span')
        label.className = 'diagram-remote-cursor__label'
        label.style.background = cursor.color
        label.textContent = cursor.name
        el.appendChild(dot)
        el.appendChild(label)
        overlay.appendChild(el)
      }
      el.style.left = `${screenX}px`
      el.style.top = `${screenY}px`
      el.style.display = ''
    }
    for (const [sid, el] of existing) {
      if (!seen.has(sid)) el.style.display = 'none'
    }
  }

  function undo(): void { graph.value?.undo(); updateHistoryState() }
  function redo(): void { graph.value?.redo(); updateHistoryState() }
  function copySelection(): void {
    if (!graph.value || !editable.value) return
    graph.value.copy(graph.value.getSelectedCells())
  }
  function pasteClipboard(): void {
    if (!graph.value || !editable.value) return
    graph.value.paste({ offset: 32 })
    scheduleSave()
  }
  function cutSelection(): void {
    if (!graph.value || !editable.value) return
    graph.value.cut(graph.value.getSelectedCells())
    scheduleSave()
  }

  function stencilCell(spec: DiagramStencilNodeSpec): Node {
    const full: DiagramNodeSpec = {
      id: `stencil_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6)}`,
      shape: spec.shape ?? 'rect',
      x: 0, y: 0,
      width: spec.width, height: spec.height,
      label: spec.label, fill: spec.fill, stroke: spec.stroke, color: spec.color, imageUrl: spec.imageUrl
    }
    return graph.value?.createNode(buildNode(full)) as Node
  }

  function onStencilMouseDown(spec: DiagramStencilNodeSpec, e: MouseEvent): void {
    if (!editable.value || !graph.value || !dnd) return
    dnd.start(stencilCell(spec), e)
  }

  function setupGraph(): void {
    const container = hostEl.current
    if (!container) return
    const g = new Graph({
      container,
      grid: cfg.value.grid ? { size: 10, visible: true } : false,
      panning: cfg.value.panning ? { enabled: true, eventTypes: ['leftMouseDown', 'mouseWheel'] } : false,
      mousewheel: cfg.value.mousewheel ? { enabled: true, modifiers: ['ctrl', 'meta'], minScale: 0.2, maxScale: 3 } : false,
      interacting: () => editable.value,
      connecting: {
        snap: true, allowBlank: false, allowLoop: false, allowNode: true,
        router: { name: 'manhattan' }, connector: { name: 'rounded' }, connectionPoint: 'boundary'
      },
      background: { color: '#ffffff' }
    })

    g.use(new Selection({ enabled: editable.value, multiple: true, rubberband: true }))
    g.use(new Snapline({ enabled: true }))

    const historyEnabled = cfg.value.history !== false
    if (historyEnabled) {
      g.use(new History({ enabled: true }))
      g.on('history:change', updateHistoryState)
      updateHistoryState()
    }

    const keyboard = new Keyboard()
    g.use(keyboard)
    keyboard.bindKey(['meta+z', 'ctrl+z'], () => { undo(); return false })
    keyboard.bindKey(['meta+shift+z', 'ctrl+shift+z', 'meta+y', 'ctrl+y'], () => { redo(); return false })
    keyboard.bindKey(['backspace', 'delete'], () => { deleteSelected(); return false })
    keyboard.bindKey(['meta+c', 'ctrl+c'], () => { copySelection(); return false })
    keyboard.bindKey(['meta+v', 'ctrl+v'], () => { pasteClipboard(); return false })
    keyboard.bindKey(['meta+x', 'ctrl+x'], () => { cutSelection(); return false })

    const clipboard = new Clipboard()
    g.use(clipboard)
    dnd = new Dnd({ target: g, scaled: true })

    g.on('cell:click', () => {
      if (!edgeMode || !edgeSource) return
      const target = g.getSelectedCells().find((c): c is Node => c instanceof Node)
      if (target && target.id !== edgeSource.id) {
        g.addEdge(buildEdge({ source: edgeSource.id, target: target.id, line: 'rounded' }))
        edgeMode = false
        edgeSource = null
        scheduleSave()
        toasts.push({ message: t('core.editor.diagram.edgeAdded'), kind: 'success' })
      }
    })
    g.on('blank:click', () => { edgeMode = false; edgeSource = null })
    g.on('node:mousedown', (arg) => {
      if (edgeMode) {
        edgeSource = arg.node
        toasts.push({ message: t('core.editor.diagram.pickTarget'), kind: 'info' })
      }
    })
    g.on('node:contextmenu', ({ node, e }) => {
      const mouse = e as unknown as MouseEvent
      const opened = overlayService.onGesture({
        event: 'contextmenu',
        componentType: 'Diagram',
        objectType: 'diagram.node',
        componentId: componentId.value,
        row: { id: node.id, label: (node.attr('label/text') as string | undefined) ?? node.id },
        x: mouse.clientX,
        y: mouse.clientY
      })
      if (opened) { e.preventDefault(); e.stopPropagation() }
    })
    g.on('cell:added', () => scheduleSave())
    g.on('cell:removed', () => scheduleSave())
    g.on('cell:change:position', () => scheduleSave())
    g.on('cell:change:size', () => scheduleSave())
    g.on('cell:change:attrs', () => scheduleSave())
    g.on('edge:connected', () => scheduleSave())
    g.on('node:mousemove', ({ node, e }) => {
      if (!configStore.collaboration?.cursorsEnabled) return
      const mouse = e as unknown as MouseEvent
      const nodePos = node.position()
      const nodeSize = node.size()
      const zoom = g.zoom()
      const translate = g.translate() as unknown as { x: number; y: number }
      const screenX = nodePos.x * zoom + translate.x
      const screenY = nodePos.y * zoom + translate.y
      const relX = (mouse.clientX - (hostEl.current?.getBoundingClientRect().left ?? 0) - screenX) / zoom
      const relY = (mouse.clientY - (hostEl.current?.getBoundingClientRect().top ?? 0) - screenY) / zoom
      scheduleCursorBroadcast(node.id, Math.max(0, Math.min(relX, nodeSize.width)), Math.max(0, Math.min(relY, nodeSize.height)))
    })

    unsubCursorStore = cursorStore.subscribe(renderDiagramCursors)
    graph.value = g

    if (value.value != null) {
      try {
        loadContent(JSON.parse(String(value.value)) as DiagramContent)
        void 0
      } catch { /* invalid content */ }
    }
  }

  // Lifecycle
  useEffect(() => {
    const raf = requestAnimationFrame(setupGraph)
    if (error.value) toasts.push({ message: error.value, kind: 'error' })
    unsubEditorCommands = subscribeEvent((event) => {
      if (event.kind === 'editor.command') handleEditorCommand(event.payload as EditorCommandPayload)
    })
    return () => {
      cancelAnimationFrame(raf)
      if (saveTimer) clearTimeout(saveTimer)
      if (cursorTimer) clearTimeout(cursorTimer)
      unsubEditorCommands?.()
      unsubCursorStore?.()
      graph.value?.dispose()
      graph.value = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toolbarMeta: Record<DiagramToolbarButton, { label: string; icon: string; action: () => void; active?: () => boolean; disabled?: () => boolean }> = {
    addRect: { label: t('core.editor.diagram.addRect'), icon: '▭', action: () => addNode('rect') },
    addEllipse: { label: t('core.editor.diagram.addEllipse'), icon: '◯', action: () => addNode('ellipse') },
    addEdge: { label: t('core.editor.diagram.addEdge'), icon: '↔', action: () => startAddEdge(), active: () => edgeMode },
    delete: { label: t('core.editor.diagram.delete'), icon: '✕', action: () => deleteSelected() },
    fit: { label: t('core.editor.diagram.fit'), icon: '⛶', action: () => fitView() },
    layout: { label: t('core.editor.diagram.layout'), icon: '▦', action: () => applyLayout() },
    undo: { label: t('core.editor.undo'), icon: '↩', action: () => undo(), disabled: () => !canUndo.value },
    redo: { label: t('core.editor.redo'), icon: '↪', action: () => redo(), disabled: () => !canRedo.value }
  }

  return (
    <div class="ui-diagram" style={height.value ? { height: height.value } : undefined} data-gesture-type="Diagram">
      {toolbar.length ? (
        <div class="ui-diagram__toolbar">
          {toolbar.map((name) => (
            <button
              key={name}
              class={`ui-diagram__btn${toolbarMeta[name]?.active?.() ? ' ui-diagram__btn--active' : ''}${(!editable.value && name !== 'fit') || toolbarMeta[name]?.disabled?.() ? ' ui-diagram__btn--disabled' : ''}`}
              title={toolbarMeta[name]?.label}
              onClick={() => toolbarMeta[name]?.action()}
            >
              {toolbarMeta[name]?.icon}
            </button>
          ))}
        </div>
      ) : null}
      <div class="ui-diagram__body">
        {stencilNodes.length ? (
          <aside class="ui-diagram__stencil" aria-label="Stencil">
            {stencilNodes.map((node, index) => (
              <div
                key={index}
                class={`ui-diagram__stencil-item${!editable.value ? ' ui-diagram__stencil-item--disabled' : ''}`}
                onMouseDown={(e) => onStencilMouseDown(node, e)}
              >
                {node.label ?? 'Node'}
              </div>
            ))}
          </aside>
        ) : null}
        <div class={`ui-diagram__canvas${!editable.value ? ' ui-diagram__canvas--readonly' : ''}`} ref={hostEl}>
          {configStore.collaboration?.cursorsEnabled ? <div ref={cursorOverlayEl} class="ui-diagram__cursor-overlay" /> : null}
        </div>
      </div>
    </div>
  )
}
