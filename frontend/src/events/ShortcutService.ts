import { reactive } from 'vue'
import { emitEvent } from './eventBus'
import { pageStore } from '../store/page'
import type { ShortcutEntry } from '../protocol/types'

interface ActiveShortcut {
  entry: ShortcutEntry
  mounted: boolean
}

interface ShortcutContext {
  getActivePage: () => string | null
  dispatch: (entry: ShortcutEntry) => void
}

const active = reactive(new Map<string, ActiveShortcut>())
let context: ShortcutContext | null = null

const IS_MAC = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform ?? '')

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  enter: 'enter',
  return: 'enter',
  space: ' ',
  spacebar: ' ',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright'
}

interface ParsedCombo {
  modifiers: { ctrl: boolean; alt: boolean; shift: boolean; meta: boolean }
  key: string
}

export function normalizeKey(value: string): string {
  const lower = value.toLowerCase()
  return KEY_ALIASES[lower] ?? lower
}

export function parseCombo(combo: string): ParsedCombo {
  const parts = combo.toLowerCase().split('+')
  const key = normalizeKey(parts[parts.length - 1])
  const modIsCtrl = parts.includes('mod') && !IS_MAC
  const modifiers = {
    ctrl: parts.includes('ctrl') || modIsCtrl,
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    meta: parts.includes('meta') || (parts.includes('mod') && IS_MAC)
  }
  return { modifiers, key }
}

function matchesCombo(combo: string, event: KeyboardEvent): boolean {
  const parsed = parseCombo(combo)
  if (normalizeKey(event.key) !== parsed.key) return false
  if (parsed.modifiers.ctrl !== event.ctrlKey) return false
  if (parsed.modifiers.alt !== event.altKey) return false
  if (parsed.modifiers.shift !== event.shiftKey) return false
  if (parsed.modifiers.meta !== event.metaKey) return false
  return true
}

function isShortcutActive(activeShortcut: ActiveShortcut): boolean {
  const { entry, mounted } = activeShortcut
  switch (entry.scope) {
    case 'component':
      return mounted && (entry.page == null || entry.page === context?.getActivePage())
    case 'page':
      return entry.page != null && entry.page === context?.getActivePage()
    case 'global':
    default:
      return true
  }
}

export function initShortcuts(ctx: ShortcutContext): () => void {
  context = ctx
  const listener = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null
    if (target && isEditable(target)) return

    for (const activeShortcut of [...active.values()]) {
      if (!isShortcutActive(activeShortcut)) continue
      const match = activeShortcut.entry.keys.some((combo) => matchesCombo(combo, event))
      if (!match) continue
      event.preventDefault()
      ctx.dispatch(activeShortcut.entry)
      break
    }
  }
  window.addEventListener('keydown', listener, true)
  return () => window.removeEventListener('keydown', listener, true)
}

export function registerShortcut(entry: ShortcutEntry): () => void {
  const existing = active.get(entry.id)
  active.set(entry.id, {
    entry,
    mounted: existing?.mounted ?? entry.scope !== 'component'
  })
  return () => {
    active.delete(entry.id)
  }
}

export function mountShortcut(entry: ShortcutEntry): () => void {
  active.set(entry.id, { entry, mounted: true })
  return () => {
    const current = active.get(entry.id)
    if (current && current.entry.id === entry.id) {
      active.delete(entry.id)
    }
  }
}

export function emitShortcutAction(entry: ShortcutEntry): void {
  switch (entry.action) {
    case 'navigate':
      emitEvent({ kind: 'navigation.request', payload: { page: entry.page } })
      break
    case 'command':
      emitEvent({ kind: 'command.request', payload: { command: entry.command, params: entry.params } })
      break
    case 'event':
      emitEvent({ kind: 'shortcut.triggered', payload: { shortcutId: entry.id, params: entry.params } })
      break
    case 'pageBack':
      pageStore.back()
      break
    case 'pageForward':
      pageStore.forward()
      break
  }
}

function isEditable(target: HTMLElement): boolean {
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
    return true
  }
  return target.isContentEditable
}
