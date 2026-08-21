import { useSignal, computed } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import { sessionStore } from '@cutcrft/plugin-sdk'
import { i18nStore } from '@cutcrft/plugin-sdk'
import { toasts } from '@cutcrft/plugin-sdk'
import { useCfg } from '@cutcrft/plugin-sdk'
import { useData } from '@cutcrft/plugin-sdk'
import { resolveParams } from '@cutcrft/plugin-sdk'
import { overlayService } from '@cutcrft/plugin-sdk'
import { subscribeEvent } from '@cutcrft/plugin-sdk'
import type { BindingContext, Canvas2DConfig, Canvas2DContent, Canvas2DElement, Canvas2DPoint, Canvas2DTool, Canvas2DToolbarButton } from '@cutcrft/plugin-sdk'
import './canvas.css'

interface ComponentProps {
  config: Record<string, unknown>
  context?: BindingContext
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export default function UiCanvas(props: ComponentProps) {
  const t = i18nStore.t
  const cfg = useCfg<Canvas2DConfig>(props.config, {
    colors: ['#111827', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
    widths: [2, 4, 8],
    grid: false,
    strokeWidth: 4,
    tool: 'draw'
  })

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const hostEl = useRef<HTMLDivElement | null>(null)

  const editable = computed(() => !cfg.value.readonly && cfg.value.disabled !== true)
  const height = computed(() => cfg.value.height)
  const componentId = computed(() => cfg.value.id)

  const data = computed(() => cfg.value.content)
  const { value, error } = useData(() => data.value, () => props.context ?? {})

  const elements = useSignal<Canvas2DElement[]>([])
  let selectedIndex = -1
  let selectedColor = cfg.value.strokeColor ?? '#111827'
  let selectedWidth = cfg.value.strokeWidth ?? 4
  const activeTool = useSignal<Canvas2DTool>(cfg.value.tool ?? 'draw')
  const inProgress = useSignal<Canvas2DElement | null>(null)

  const view = { x: 0, y: 0, scale: 1 }
  let dpr = 1
  let drawing = false
  let dragging = false
  let resizing = false
  let panning = false
  let lastClient = { x: 0, y: 0 }
  let dragStart = { x: 0, y: 0 }
  let dragMoved = false
  let dragSnapshot: Canvas2DPoint[] = []
  let resizeHandle: ResizeHandle | null = null
  let resizeBox: { x: number; y: number; w: number; h: number } | null = null
  let pointerId = -1
  let loaded = false
  let saveTimer: ReturnType<typeof setTimeout> | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let resizeObserver: ResizeObserver | null = null
  let idCounter = 0
  let unsubEditorCommands: (() => void) | null = null

  const MAX_HISTORY = 50
  let undoStack: Canvas2DElement[][] = []
  let redoStack: Canvas2DElement[][] = []
  const canUndo = useSignal(false)
  const canRedo = useSignal(false)

  function nextId(): string {
    idCounter += 1
    return `el_${Date.now().toString(36)}_${idCounter}`
  }

  const toolbarButtons: Canvas2DToolbarButton[] = ['select', 'pan', 'draw', 'erase', 'rect', 'ellipse', 'line', 'arrow', 'clear']
  const toolbar = cfg.value.toolbar === false ? [] : (cfg.value.toolbar ?? toolbarButtons)
  const palette = cfg.value.colors ?? ['#111827', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
  const strokeWidths = cfg.value.widths ?? [2, 4, 8]

  function scheduleSave(): void {
    if (!editable.value || !cfg.value.save?.command) return
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => { void save() }, 600)
  }

  function contentFor(): string {
    const content: Canvas2DContent = { elements: elements.value }
    return JSON.stringify(content)
  }

  async function save(): Promise<void> {
    if (!cfg.value.save?.command) return
    const payload = { ...(cfg.value.save.params ?? {}), content: contentFor() }
    try {
      await sessionStore.executeCommand(cfg.value.save.command, resolveParams(payload, props.context ?? {}))
      toasts.push({ message: t('core.editor.saved'), kind: 'success' })
    } catch { /* error toast shown by session store */ }
  }

  function loadContent(content: Canvas2DContent): void {
    elements.value = (content.elements ?? []).map((el) => (el.id ? el : { ...el, id: nextId() }))
    selectedIndex = -1
    undoStack = []
    redoStack = []
    updateHistoryState()
    redraw()
  }

  function cloneElements(): Canvas2DElement[] {
    return elements.value.map((el) => ({ ...el, points: el.points.map((p) => ({ ...p })) }))
  }

  function updateHistoryState(): void {
    canUndo.value = undoStack.length > 0
    canRedo.value = redoStack.length > 0
  }

  function pushUndo(prevPoints?: Canvas2DPoint[]): void {
    const copy = cloneElements()
    if (prevPoints && selectedIndex >= 0 && copy[selectedIndex]) {
      copy[selectedIndex] = { ...copy[selectedIndex], points: prevPoints.map((p) => ({ x: p.x, y: p.y })) }
    }
    undoStack.push(copy)
    if (undoStack.length > MAX_HISTORY) undoStack.shift()
    redoStack.length = 0
    updateHistoryState()
  }

  function undo(): void {
    if (!editable.value || undoStack.length === 0) return
    redoStack.push(cloneElements())
    elements.value = undoStack.pop() ?? []
    selectedIndex = -1
    updateHistoryState()
    scheduleSave()
    redraw()
  }

  function redo(): void {
    if (!editable.value || redoStack.length === 0) return
    undoStack.push(cloneElements())
    elements.value = redoStack.pop() ?? []
    selectedIndex = -1
    updateHistoryState()
    scheduleSave()
    redraw()
  }

  function clientToWorld(e: PointerEvent): Canvas2DPoint {
    const rect = canvasRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 }
    return {
      x: (e.clientX - rect.left - view.x) / view.scale,
      y: (e.clientY - rect.top - view.y) / view.scale
    }
  }

  function resizeCanvas(): void {
    const canvas = canvasRef.current
    if (!canvas) return
    dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.max(1, Math.round(rect.width * dpr))
    canvas.height = Math.max(1, Math.round(rect.height * dpr))
    ctx = canvas.getContext('2d')
    redraw()
  }

  function redraw(): void {
    if (!ctx || !canvasRef.current) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvasRef.current.width / dpr, canvasRef.current.height / dpr)
    const bg = cfg.value.background ?? '#ffffff'
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvasRef.current.width / dpr, canvasRef.current.height / dpr)
    ctx.save()
    ctx.translate(view.x, view.y)
    ctx.scale(view.scale, view.scale)
    if (cfg.value.grid) drawGrid()
    for (let i = 0; i < elements.value.length; i++) {
      drawElement(elements.value[i], i === selectedIndex)
    }
    if (inProgress.value) drawElement(inProgress.value, false)
    if (editable.value && activeTool.value === 'select' && selectedIndex >= 0) {
      const box = elementBox(elements.value[selectedIndex])
      if (box) drawResizeHandles(box)
    }
    ctx.restore()
  }

  function drawGrid(): void {
    if (!ctx) return
    const step = 20
    const bounds = { x: -view.x / view.scale, y: -view.y / view.scale, w: (canvasRef.current?.width ?? 0) / view.scale, h: (canvasRef.current?.height ?? 0) / view.scale }
    ctx.strokeStyle = '#eef2f7'
    ctx.lineWidth = 1 / view.scale
    ctx.beginPath()
    const startX = Math.floor(bounds.x / step) * step
    const startY = Math.floor(bounds.y / step) * step
    for (let gx = startX; gx <= bounds.x + bounds.w; gx += step) {
      ctx.moveTo(gx, bounds.y)
      ctx.lineTo(gx, bounds.y + bounds.h)
    }
    for (let gy = startY; gy <= bounds.y + bounds.h; gy += step) {
      ctx.moveTo(bounds.x, gy)
      ctx.lineTo(bounds.x + bounds.w, gy)
    }
    ctx.stroke()
  }

  function drawElement(el: Canvas2DElement, isSelected: boolean): void {
    if (!ctx) return
    ctx.strokeStyle = el.color
    ctx.fillStyle = el.color
    ctx.lineWidth = el.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (el.type === 'path') {
      const c = ctx
      c.beginPath()
      el.points.forEach((p, i) => (i === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y)))
      c.stroke()
    } else if (el.type === 'rect') {
      if (el.points.length >= 2) ctx.strokeRect(el.points[0].x, el.points[0].y, el.points[1].x - el.points[0].x, el.points[1].y - el.points[0].y)
    } else if (el.type === 'ellipse') {
      if (el.points.length >= 2) {
        ctx.beginPath()
        ctx.ellipse(
          (el.points[0].x + el.points[1].x) / 2,
          (el.points[0].y + el.points[1].y) / 2,
          Math.abs(el.points[1].x - el.points[0].x) / 2,
          Math.abs(el.points[1].y - el.points[0].y) / 2,
          0, 0, Math.PI * 2
        )
        ctx.stroke()
      }
    } else if (el.type === 'line' || el.type === 'arrow') {
      if (el.points.length >= 2) {
        const [a, b] = el.points
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
        if (el.type === 'arrow') {
          const angle = Math.atan2(b.y - a.y, b.x - a.x)
          const head = Math.max(8, el.width * 3)
          ctx.beginPath()
          ctx.moveTo(b.x, b.y)
          ctx.lineTo(b.x - head * Math.cos(angle - Math.PI / 6), b.y - head * Math.sin(angle - Math.PI / 6))
          ctx.moveTo(b.x, b.y)
          ctx.lineTo(b.x - head * Math.cos(angle + Math.PI / 6), b.y - head * Math.sin(angle + Math.PI / 6))
          ctx.stroke()
        }
      }
    }
    if (isSelected) {
      const box = elementBox(el)
      if (box) {
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 1.5 / view.scale
        ctx.setLineDash([6 / view.scale, 4 / view.scale])
        ctx.strokeRect(box.x, box.y, box.w, box.h)
        ctx.setLineDash([])
      }
    }
  }

  function elementBox(el: Canvas2DElement): { x: number; y: number; w: number; h: number } | null {
    if (!el.points.length) return null
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (const p of el.points) {
      minX = Math.min(minX, p.x)
      minY = Math.min(minY, p.y)
      maxX = Math.max(maxX, p.x)
      maxY = Math.max(maxY, p.y)
    }
    const pad = el.width + 4
    return { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 }
  }

  const HANDLE_CURSORS: Record<ResizeHandle, string> = {
    nw: 'nwse-resize', n: 'ns-resize', ne: 'nesw-resize', e: 'ew-resize',
    se: 'nwse-resize', s: 'ns-resize', sw: 'nesw-resize', w: 'ew-resize'
  }

  function resizeHandlePositions(box: { x: number; y: number; w: number; h: number }): { id: ResizeHandle; x: number; y: number }[] {
    return [
      { id: 'nw', x: box.x, y: box.y },
      { id: 'n', x: box.x + box.w / 2, y: box.y },
      { id: 'ne', x: box.x + box.w, y: box.y },
      { id: 'e', x: box.x + box.w, y: box.y + box.h / 2 },
      { id: 'se', x: box.x + box.w, y: box.y + box.h },
      { id: 's', x: box.x + box.w / 2, y: box.y + box.h },
      { id: 'sw', x: box.x, y: box.y + box.h },
      { id: 'w', x: box.x, y: box.y + box.h / 2 }
    ]
  }

  function handleAt(p: Canvas2DPoint): ResizeHandle | null {
    if (selectedIndex < 0) return null
    const el = elements.value[selectedIndex]
    if (!el || el.points.length < 2) return null
    const box = elementBox(el)
    if (!box) return null
    for (const h of resizeHandlePositions(box)) {
      if (Math.hypot((h.x - p.x) * view.scale, (h.y - p.y) * view.scale) <= 9) return h.id
    }
    return null
  }

  function drawResizeHandles(box: { x: number; y: number; w: number; h: number }): void {
    if (!ctx) return
    const size = 6 / view.scale
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 1.5 / view.scale
    ctx.fillStyle = '#ffffff'
    for (const h of resizeHandlePositions(box)) {
      ctx.fillRect(h.x - size / 2, h.y - size / 2, size, size)
      ctx.strokeRect(h.x - size / 2, h.y - size / 2, size, size)
    }
  }

  function updateCursor(p: Canvas2DPoint): void {
    const canvas = canvasRef.current
    if (!canvas) return
    if (activeTool.value !== 'select') {
      canvas.style.cursor = 'crosshair'
      return
    }
    const handle = handleAt(p)
    if (handle) {
      canvas.style.cursor = HANDLE_CURSORS[handle]
      return
    }
    canvas.style.cursor = hitTest(p) >= 0 ? 'move' : 'crosshair'
  }

  function distToSegment(p: Canvas2DPoint, a: Canvas2DPoint, b: Canvas2DPoint): number {
    const dx = b.x - a.x
    const dy = b.y - a.y
    const lenSq = dx * dx + dy * dy
    let tt = lenSq === 0 ? 0 : ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq
    tt = Math.max(0, Math.min(1, tt))
    return Math.hypot(p.x - (a.x + tt * dx), p.y - (a.y + tt * dy))
  }

  function hitTest(p: Canvas2DPoint): number {
    for (let i = elements.value.length - 1; i >= 0; i--) {
      const el = elements.value[i]
      if (el.type === 'path') {
        for (let k = 1; k < el.points.length; k++) {
          if (distToSegment(p, el.points[k - 1], el.points[k]) <= el.width / 2 + 4) return i
        }
      } else if (el.type === 'line' || el.type === 'arrow') {
        if (el.points.length >= 2 && distToSegment(p, el.points[0], el.points[1]) <= el.width / 2 + 4) return i
      } else {
        const box = elementBox(el)
        if (box && p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h) return i
      }
    }
    return -1
  }

  function eraseAt(p: Canvas2DPoint): boolean {
    const radius = Math.max(8, selectedWidth * 1.5)
    let removed = false
    const next = [...elements.value]
    for (let i = next.length - 1; i >= 0; i--) {
      const el = next[i]
      const hit = el.points.some((pt) => Math.hypot(pt.x - p.x, pt.y - p.y) <= radius)
      if (hit) {
        next.splice(i, 1)
        removed = true
      }
    }
    if (removed) {
      elements.value = next
      if (selectedIndex >= elements.value.length) selectedIndex = -1
      scheduleSave()
    }
    return removed
  }

  function commitElement(): void {
    if (inProgress.value) {
      const el = inProgress.value
      if (el.points.length >= 2) {
        pushUndo()
        el.id = nextId()
        const next = [...elements.value, el]
        elements.value = next
        selectedIndex = -1
        scheduleSave()
      }
    }
    inProgress.value = null
  }

  function onPointerDown(e: PointerEvent): void {
    if (!editable.value) return
    pointerId = e.pointerId
    canvasRef.current?.setPointerCapture(pointerId)
    lastClient = { x: e.clientX, y: e.clientY }
    const p = clientToWorld(e)

    if (activeTool.value === 'pan') {
      panning = true
      return
    }
    if (activeTool.value === 'select') {
      if (selectedIndex >= 0) {
        const handle = handleAt(p)
        const box = elementBox(elements.value[selectedIndex])
        if (handle && box) {
          resizing = true
          resizeHandle = handle
          resizeBox = box
          dragSnapshot = elements.value[selectedIndex].points.map((pt) => ({ ...pt }))
          return
        }
      }
      const idx = hitTest(p)
      selectedIndex = idx
      dragging = idx >= 0
      dragStart = p
      dragMoved = false
      if (idx >= 0) dragSnapshot = elements.value[idx].points.map((pt) => ({ ...pt }))
      redraw()
      return
    }
    if (activeTool.value === 'erase') {
      eraseAt(p)
      redraw()
      return
    }
    drawing = true
    inProgress.value = {
      type: activeTool.value === 'draw' ? 'path' : (activeTool.value as Canvas2DElement['type']),
      points: [p],
      color: selectedColor,
      width: selectedWidth
    }
  }

  function onPointerMove(e: PointerEvent): void {
    const p = clientToWorld(e)
    if (panning) {
      view.x += e.clientX - lastClient.x
      view.y += e.clientY - lastClient.y
      lastClient = { x: e.clientX, y: e.clientY }
      redraw()
      return
    }
    if (resizing && resizeHandle && resizeBox && selectedIndex >= 0) {
      const box = resizeBox
      let nx = box.x
      let ny = box.y
      let nw = box.w
      let nh = box.h
      switch (resizeHandle) {
        case 'nw': nx = p.x; ny = p.y; nw = box.x + box.w - p.x; nh = box.y + box.h - p.y; break
        case 'n': ny = p.y; nh = box.y + box.h - p.y; break
        case 'ne': ny = p.y; nw = p.x - box.x; nh = box.y + box.h - p.y; break
        case 'e': nw = p.x - box.x; break
        case 'se': nw = p.x - box.x; nh = p.y - box.y; break
        case 's': nh = p.y - box.y; break
        case 'sw': nx = p.x; nw = box.x + box.w - p.x; nh = p.y - box.y; break
        case 'w': nx = p.x; nw = box.x + box.w - p.x; break
      }
      const el = elements.value[selectedIndex]
      const keepAspect = e.shiftKey
      const aspect = box.w / box.h
      if (keepAspect && !Number.isNaN(aspect) && isFinite(aspect)) {
        if (resizeHandle === 'n' || resizeHandle === 's') nw = nh * aspect
        else nh = nw / aspect
        if (resizeHandle === 'n') ny = box.y + box.h - nh
        if (resizeHandle === 's' && nh < 0) ny = box.y + box.h
        if (resizeHandle === 'w') nx = box.x + box.w - nw
      }
      if (nw === 0) nw = 1
      if (nh === 0) nh = 1
      const fx = nw / box.w
      const fy = nh / box.h
      el.points = dragSnapshot.map((pt) => ({ x: nx + (pt.x - box.x) * fx, y: ny + (pt.y - box.y) * fy }))
      redraw()
      return
    }
    if (dragging && selectedIndex >= 0) {
      const dx = p.x - dragStart.x
      const dy = p.y - dragStart.y
      if (dx !== 0 || dy !== 0) dragMoved = true
      const el = elements.value[selectedIndex]
      el.points = dragSnapshot.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }))
      redraw()
      return
    }
    if (drawing && inProgress.value) {
      if (inProgress.value.type === 'path') {
        const last = inProgress.value.points[inProgress.value.points.length - 1]
        if (Math.hypot(p.x - last.x, p.y - last.y) > 1) {
          inProgress.value.points.push(p)
        }
      } else {
        inProgress.value.points[1] = p
      }
      redraw()
    } else if (activeTool.value === 'select' && !drawing) {
      updateCursor(p)
    }
  }

  function onPointerUp(): void {
    if (pointerId >= 0) {
      canvasRef.current?.releasePointerCapture(pointerId)
      pointerId = -1
    }
    if (drawing) {
      drawing = false
      commitElement()
    }
    if (resizing) {
      resizing = false
      resizeHandle = null
      resizeBox = null
      if (dragSnapshot.length > 0) {
        const cur = selectedIndex >= 0 ? elements.value[selectedIndex] : undefined
        const changed = !cur || cur.points.length !== dragSnapshot.length || cur.points.some((p, i) => p.x !== dragSnapshot[i].x || p.y !== dragSnapshot[i].y)
        if (changed) pushUndo(dragSnapshot)
        dragSnapshot = []
      }
      scheduleSave()
      dragMoved = false
    }
    if (panning) panning = false
    if (dragging) {
      dragging = false
      if (dragMoved) {
        pushUndo(dragSnapshot)
        scheduleSave()
      }
      dragMoved = false
      dragSnapshot = []
    }
    redraw()
  }

  function onWheel(e: WheelEvent): void {
    e.preventDefault()
    const rect = canvasRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 }
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const factor = e.deltaY < 0 ? 1.12 : 0.89
    const next = Math.min(8, Math.max(0.1, view.scale * factor))
    const k = next / view.scale
    view.x = mx - (mx - view.x) * k
    view.y = my - (my - view.y) * k
    view.scale = next
    redraw()
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (!editable.value) return
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault()
      if (e.shiftKey) redo()
      else undo()
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault()
      redo()
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key === ']') {
      e.preventDefault()
      bringFront()
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key === '[') {
      e.preventDefault()
      sendBack()
      return
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIndex >= 0) {
      e.preventDefault()
      pushUndo()
      const next = [...elements.value]
      next.splice(selectedIndex, 1)
      elements.value = next
      selectedIndex = -1
      scheduleSave()
      redraw()
    }
  }

  function setTool(tool: Canvas2DTool): void { activeTool.value = tool }
  function setColor(color: string): void { selectedColor = color }
  function setWidth(width: number): void { selectedWidth = width }

  function clearBoard(): void {
    if (!editable.value) return
    if (elements.value.length === 0) return
    pushUndo()
    elements.value = []
    selectedIndex = -1
    inProgress.value = null
    scheduleSave()
    redraw()
  }

  function bringFront(): void {
    if (selectedIndex < 0 || selectedIndex >= elements.value.length) return
    pushUndo()
    const next = [...elements.value]
    const el = next.splice(selectedIndex, 1)[0]
    next.push(el)
    elements.value = next
    selectedIndex = next.length - 1
    scheduleSave()
    redraw()
  }

  function sendBack(): void {
    if (selectedIndex < 0 || selectedIndex >= elements.value.length) return
    pushUndo()
    const next = [...elements.value]
    const el = next.splice(selectedIndex, 1)[0]
    next.unshift(el)
    elements.value = next
    selectedIndex = 0
    scheduleSave()
    redraw()
  }

  function resetView(): void {
    view.x = 0
    view.y = 0
    view.scale = 1
    redraw()
  }

  function duplicateElement(): void {
    if (selectedIndex < 0 || selectedIndex >= elements.value.length) return
    pushUndo()
    const el = elements.value[selectedIndex]
    const copy: Canvas2DElement = {
      id: nextId(),
      type: el.type,
      points: el.points.map((pt) => ({ x: pt.x + 16, y: pt.y + 16 })),
      color: el.color,
      width: el.width
    }
    const next = [...elements.value, copy]
    elements.value = next
    selectedIndex = next.length - 1
    scheduleSave()
    redraw()
  }

  function onContextMenu(e: MouseEvent): void {
    if (!editable.value) return
    const rect = canvasRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 }
    const p = { x: (e.clientX - rect.left - view.x) / view.scale, y: (e.clientY - rect.top - view.y) / view.scale }
    const idx = hitTest(p)
    if (idx < 0) return
    selectedIndex = idx
    redraw()
    const el = elements.value[idx]
    const opened = overlayService.onGesture({
      event: 'contextmenu',
      componentType: 'Canvas2D',
      objectType: 'canvas.element',
      componentId: componentId.value,
      row: { id: el.id, type: el.type },
      x: e.clientX,
      y: e.clientY
    })
    if (opened) e.preventDefault()
  }

  interface EditorCommandPayload {
    editor?: string
    command?: string
    componentId?: string
    params?: Record<string, unknown>
  }

  function handleEditorCommand(payload: EditorCommandPayload): void {
    if (payload.editor !== 'canvas') return
    if (payload.componentId && payload.componentId !== componentId.value) return
    if (!editable.value) return
    if (payload.command === 'undo') { undo(); return }
    if (payload.command === 'redo') { redo(); return }
    const id = payload.params?.id as string | undefined
    const idx = id ? elements.value.findIndex((el) => el.id === id) : -1
    if (idx < 0) return
    selectedIndex = idx
    switch (payload.command) {
      case 'delete':
        pushUndo()
        const next = [...elements.value]
        next.splice(idx, 1)
        elements.value = next
        selectedIndex = -1
        scheduleSave()
        redraw()
        break
      case 'duplicate':
        duplicateElement()
        break
      case 'front':
        bringFront()
        break
      case 'back':
        sendBack()
        break
    }
  }

  // Load content from data binding
  useEffect(() => {
    const next = value.value
    if (next == null || loaded) return
    try {
      loadContent(JSON.parse(String(next)) as Canvas2DContent)
      loaded = true
    } catch { /* invalid content */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.value])

  // Mount: resize + observer + events
  useEffect(() => {
    resizeCanvas()
    resizeObserver = new ResizeObserver(resizeCanvas)
    if (hostEl.current) resizeObserver.observe(hostEl.current)
    if (error.value) toasts.push({ message: error.value, kind: 'error' })
    unsubEditorCommands = subscribeEvent((event) => {
      if (event.kind === 'editor.command') handleEditorCommand(event.payload as EditorCommandPayload)
    })
    return () => {
      if (saveTimer) clearTimeout(saveTimer)
      resizeObserver?.disconnect()
      unsubEditorCommands?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Readonly toggle
  useEffect(() => {
    if (!editable.value) {
      inProgress.value = null
      redraw()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable.value])

  const toolbarMeta: Record<Canvas2DToolbarButton, { label: string; icon: string; action: () => void; active?: () => boolean; disabled?: () => boolean }> = {
    select: { label: t('core.editor.canvas.select'), icon: '➤', action: () => setTool('select'), active: () => activeTool.value === 'select' },
    pan: { label: t('core.editor.canvas.pan'), icon: '✋', action: () => setTool('pan'), active: () => activeTool.value === 'pan' },
    draw: { label: t('core.editor.canvas.draw'), icon: '✏', action: () => setTool('draw'), active: () => activeTool.value === 'draw' },
    erase: { label: t('core.editor.canvas.erase'), icon: '⌫', action: () => setTool('erase'), active: () => activeTool.value === 'erase' },
    rect: { label: t('core.editor.canvas.rect'), icon: '▭', action: () => setTool('rect'), active: () => activeTool.value === 'rect' },
    ellipse: { label: t('core.editor.canvas.ellipse'), icon: '◯', action: () => setTool('ellipse'), active: () => activeTool.value === 'ellipse' },
    line: { label: t('core.editor.canvas.line'), icon: '╱', action: () => setTool('line'), active: () => activeTool.value === 'line' },
    arrow: { label: t('core.editor.canvas.arrow'), icon: '➔', action: () => setTool('arrow'), active: () => activeTool.value === 'arrow' },
    clear: { label: t('core.editor.canvas.clear'), icon: '∅', action: () => clearBoard() },
    undo: { label: t('core.editor.undo'), icon: '↩', action: () => undo(), disabled: () => !canUndo.value },
    redo: { label: t('core.editor.redo'), icon: '↪', action: () => redo(), disabled: () => !canRedo.value },
    front: { label: t('core.editor.canvas.front'), icon: '⇡', action: () => bringFront(), disabled: () => selectedIndex < 0 },
    back: { label: t('core.editor.canvas.back'), icon: '⇣', action: () => sendBack(), disabled: () => selectedIndex < 0 }
  }

  return (
    <div class="ui-canvas" style={height.value ? { height: height.value } : undefined} data-gesture-type="Canvas2D">
      {toolbar.length ? (
        <div class="ui-canvas__toolbar">
          {toolbar.map((name) => (
            <button
              key={name}
              class={`ui-canvas__btn${toolbarMeta[name]?.active?.() ? ' ui-canvas__btn--active' : ''}${(!editable.value && name !== 'pan') || toolbarMeta[name]?.disabled?.() ? ' ui-canvas__btn--disabled' : ''}`}
              title={toolbarMeta[name]?.label}
              onClick={() => toolbarMeta[name]?.action()}
            >
              {toolbarMeta[name]?.icon}
            </button>
          ))}
          {editable.value ? (
            <span class="ui-canvas__palette">
              {palette.map((color) => (
                <button
                  key={color}
                  class={`ui-canvas__swatch${color === selectedColor ? ' ui-canvas__swatch--active' : ''}`}
                  style={{ background: color }}
                  title={color}
                  onClick={() => setColor(color)}
                />
              ))}
              <select class="ui-canvas__width" value={selectedWidth} onChange={(e) => setWidth(Number((e.target as HTMLSelectElement).value))}>
                {strokeWidths.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </span>
          ) : null}
        </div>
      ) : null}
      <div class="ui-canvas__stage" ref={hostEl} onDblClick={resetView}>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          class={`ui-canvas__surface${!editable.value ? ' ui-canvas__surface--readonly' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          onContextMenu={onContextMenu}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  )
}
