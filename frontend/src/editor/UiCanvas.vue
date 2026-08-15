<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { sessionStore } from '../store/session'
import { i18nStore } from '../store/i18n'
import { toasts } from '../store/toasts'
import { useCfg } from '../renderer/useConfig'
import { useData } from '../renderer/useData'
import { resolveParams } from '../renderer/bindingEngine'
import type {
  BindingContext,
  Canvas2DConfig,
  Canvas2DContent,
  Canvas2DElement,
  Canvas2DPoint,
  Canvas2DTool,
  Canvas2DToolbarButton
} from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const t = i18nStore.t

const cfg = useCfg<Canvas2DConfig>(props.config, {
  colors: ['#111827', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
  widths: [2, 4, 8],
  grid: false,
  strokeWidth: 4,
  tool: 'draw'
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const hostEl = ref<HTMLElement | null>(null)

const editable = computed(() => !cfg.value.readonly && cfg.value.disabled !== true)
const height = computed(() => cfg.value.height)

const data = computed(() => cfg.value.content)
const { value, error } = useData(
  () => data.value,
  () => props.context ?? {}
)

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

const elements = ref<Canvas2DElement[]>([])
let selectedIndex = -1
let selectedColor = cfg.value.strokeColor ?? '#111827'
let selectedWidth = cfg.value.strokeWidth ?? 4
const activeTool = ref<Canvas2DTool>(cfg.value.tool ?? 'draw')
const inProgress = ref<Canvas2DElement | null>(null)

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

const toolbarButtons: Canvas2DToolbarButton[] = ['select', 'pan', 'draw', 'erase', 'rect', 'ellipse', 'line', 'arrow', 'clear']
const toolbar = computed(() => (cfg.value.toolbar === false ? [] : (cfg.value.toolbar ?? toolbarButtons)))
const palette = computed(() => cfg.value.colors ?? ['#111827', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'])
const strokeWidths = computed(() => cfg.value.widths ?? [2, 4, 8])

function scheduleSave(): void {
  if (!editable.value || !cfg.value.save?.command) return
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    void save()
  }, 600)
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
  } catch {
    /* error toast shown by session store */
  }
}

function loadContent(content: Canvas2DContent): void {
  elements.value = content.elements ?? []
  selectedIndex = -1
  redraw()
}

watch(
  () => value.value,
  (next) => {
    if (next == null || loaded) return
    try {
      loadContent(JSON.parse(String(next)) as Canvas2DContent)
      loaded = true
    } catch {
      /* invalid content, keep empty board */
    }
  }
)

function clientToWorld(e: PointerEvent): Canvas2DPoint {
  const rect = canvasRef.value?.getBoundingClientRect() ?? { left: 0, top: 0 }
  return {
    x: (e.clientX - rect.left - view.x) / view.scale,
    y: (e.clientY - rect.top - view.y) / view.scale
  }
}

function resizeCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.max(1, Math.round(rect.width * dpr))
  canvas.height = Math.max(1, Math.round(rect.height * dpr))
  ctx = canvas.getContext('2d')
  redraw()
}

function redraw(): void {
  if (!ctx || !canvasRef.value) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, canvasRef.value.width / dpr, canvasRef.value.height / dpr)
  const bg = cfg.value.background ?? '#ffffff'
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, canvasRef.value.width / dpr, canvasRef.value.height / dpr)
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
  const bounds = { x: -view.x / view.scale, y: -view.y / view.scale, w: (canvasRef.value?.width ?? 0) / view.scale, h: (canvasRef.value?.height ?? 0) / view.scale }
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
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize'
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
  const canvas = canvasRef.value
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
  let t = lenSq === 0 ? 0 : ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy))
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
  for (let i = elements.value.length - 1; i >= 0; i--) {
    const el = elements.value[i]
    const hit = el.points.some((pt) => Math.hypot(pt.x - p.x, pt.y - p.y) <= radius)
    if (hit) {
      elements.value.splice(i, 1)
      removed = true
    }
  }
  if (removed) {
    if (selectedIndex >= elements.value.length) selectedIndex = -1
    scheduleSave()
  }
  return removed
}

function commitElement(): void {
  if (inProgress.value) {
    const el = inProgress.value
    if (el.points.length >= 2) {
      elements.value.push(el)
      selectedIndex = -1
      scheduleSave()
    }
  }
  inProgress.value = null
}

function onPointerDown(e: PointerEvent): void {
  if (!editable.value) return
  pointerId = e.pointerId
  canvasRef.value?.setPointerCapture(pointerId)
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
    canvasRef.value?.releasePointerCapture(pointerId)
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
    dragSnapshot = []
    scheduleSave()
    dragMoved = false
  }
  if (panning) panning = false
  if (dragging) {
    dragging = false
    if (dragMoved) scheduleSave()
    dragMoved = false
    dragSnapshot = []
  }
  redraw()
}

function onWheel(e: WheelEvent): void {
  e.preventDefault()
  const rect = canvasRef.value?.getBoundingClientRect() ?? { left: 0, top: 0 }
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
    elements.value.splice(selectedIndex, 1)
    selectedIndex = -1
    scheduleSave()
    redraw()
  }
}

function setTool(tool: Canvas2DTool): void {
  activeTool.value = tool
}

function setColor(color: string): void {
  selectedColor = color
}

function setWidth(width: number): void {
  selectedWidth = width
}

function clearBoard(): void {
  if (!editable.value) return
  elements.value = []
  selectedIndex = -1
  inProgress.value = null
  scheduleSave()
  redraw()
}

function bringFront(): void {
  if (selectedIndex < 0 || selectedIndex >= elements.value.length) return
  const el = elements.value.splice(selectedIndex, 1)[0]
  elements.value.push(el)
  selectedIndex = elements.value.length - 1
  scheduleSave()
  redraw()
}

function sendBack(): void {
  if (selectedIndex < 0 || selectedIndex >= elements.value.length) return
  const el = elements.value.splice(selectedIndex, 1)[0]
  elements.value.unshift(el)
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

watch(editable, (next) => {
  if (!next) {
    inProgress.value = null
    redraw()
  }
})

onMounted(() => {
  resizeCanvas()
  resizeObserver = new ResizeObserver(resizeCanvas)
  if (hostEl.value) resizeObserver.observe(hostEl.value)
  if (error.value) toasts.push({ message: error.value, kind: 'error' })
})

onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
  resizeObserver?.disconnect()
})

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
  front: { label: t('core.editor.canvas.front'), icon: '⇡', action: () => bringFront(), disabled: () => selectedIndex < 0 },
  back: { label: t('core.editor.canvas.back'), icon: '⇣', action: () => sendBack(), disabled: () => selectedIndex < 0 }
}
</script>

<template>
  <div class="ui-canvas" :style="height ? { height } : undefined" data-gesture-type="Canvas2D">
    <div v-if="toolbar.length" class="ui-canvas__toolbar">
      <button
        v-for="name in toolbar"
        :key="name"
        class="ui-canvas__btn"
        :class="{ 'ui-canvas__btn--active': toolbarMeta[name]?.active?.(), 'ui-canvas__btn--disabled': (!editable && name !== 'pan') || toolbarMeta[name]?.disabled?.() }"
        :title="toolbarMeta[name]?.label"
        @click="toolbarMeta[name]?.action()"
      >
        {{ toolbarMeta[name]?.icon }}
      </button>
      <span v-if="editable" class="ui-canvas__palette">
        <button
          v-for="color in palette"
          :key="color"
          class="ui-canvas__swatch"
          :style="{ background: color }"
          :class="{ 'ui-canvas__swatch--active': color === selectedColor }"
          :title="color"
          @click="setColor(color)"
        ></button>
        <select class="ui-canvas__width" :value="selectedWidth" @change="setWidth(Number(($event.target as HTMLSelectElement).value))">
          <option v-for="w in strokeWidths" :key="w" :value="w">{{ w }}</option>
        </select>
      </span>
    </div>
    <div class="ui-canvas__stage" ref="hostEl" @dblclick="resetView">
      <canvas
        ref="canvasRef"
        tabindex="0"
        class="ui-canvas__surface"
        :class="{ 'ui-canvas__surface--readonly': !editable }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @wheel="onWheel"
        @keydown="onKeyDown"
      ></canvas>
    </div>
  </div>
</template>

<style scoped>
.ui-canvas {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius);
  background: var(--rt-color-surface);
  overflow: hidden;
}
.ui-canvas__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.125rem;
  padding: 0.375rem;
  border-bottom: 1px solid var(--rt-color-border);
  background: var(--rt-color-bg);
}
.ui-canvas__btn {
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.35rem;
  border: none;
  border-radius: var(--rt-radius-sm);
  background: transparent;
  color: var(--rt-color-text);
  font-size: var(--rt-font-size-sm);
  cursor: pointer;
}
.ui-canvas__btn:hover {
  background: var(--rt-color-primary-soft, rgba(0, 0, 0, 0.06));
}
.ui-canvas__btn--active {
  background: var(--rt-color-primary);
  color: var(--rt-color-on-primary);
}
.ui-canvas__btn--disabled {
  opacity: 0.4;
  pointer-events: none;
}
.ui-canvas__palette {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid var(--rt-color-border);
}
.ui-canvas__swatch {
  width: 1.15rem;
  height: 1.15rem;
  border: 2px solid transparent;
  border-radius: 999px;
  cursor: pointer;
}
.ui-canvas__swatch--active {
  border-color: var(--rt-color-text);
}
.ui-canvas__width {
  height: 1.5rem;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-surface);
  color: var(--rt-color-text);
  font-size: var(--rt-font-size-sm);
}
.ui-canvas__stage {
  flex: 1;
  min-height: 0;
  position: relative;
}
.ui-canvas__surface {
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
  cursor: crosshair;
  touch-action: none;
}
.ui-canvas__surface--readonly {
  cursor: default;
}
</style>
