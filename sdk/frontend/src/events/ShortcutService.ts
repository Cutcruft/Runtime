import { signal } from '@preact/signals'
import { emitEvent } from './eventBus'
import { pageStore } from '../store/page'
import type { ShortcutEntry } from '../protocol/types'
import { globalSingleton } from '../utils/globalSingleton'

interface ActiveShortcut {
  entry: ShortcutEntry
  mounted: boolean
}

interface ShortcutContext {
  getActivePage: () => string | null
  dispatch: (entry: ShortcutEntry) => void
}

const { activeMap, shortcutState } = globalSingleton('__cc_shortcut', () => ({
  activeMap: signal(new Map<string, ActiveShortcut>()),
  shortcutState: { context: null as ShortcutContext | null }
}))

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
      return mounted && (entry.page == null || entry.page === shortcutState.context?.getActivePage())
    case 'page':
      return entry.page != null && entry.page === shortcutState.context?.getActivePage()
    case 'global':
    default:
      return true
  }
}

export function initShortcuts(ctx: ShortcutContext): () => void {
  shortcutState.context = ctx
  const listener = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null
    if (target && isEditable(target)) return

    const current = activeMap.value
    for (const activeShortcut of [...current.values()]) {
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
  const current = activeMap.value
  const existing = current.get(entry.id)
  const next = new Map(current)
  next.set(entry.id, {
    entry,
    mounted: existing?.mounted ?? entry.scope !== 'component'
  })
  activeMap.value = next
  return () => {
    const cur = activeMap.value
    const n = new Map(cur)
    n.delete(entry.id)
    activeMap.value = n
  }
}

export function mountShortcut(entry: ShortcutEntry): () => void {
  const current = activeMap.value
  const next = new Map(current)
  next.set(entry.id, { entry, mounted: true })
  activeMap.value = next
  return () => {
    const cur = activeMap.value
    if (cur.get(entry.id)?.entry.id === entry.id) {
      const n = new Map(cur)
      n.delete(entry.id)
      activeMap.value = n
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

/** List all registered shortcuts (for runtime UI / settings panel). */
export function listShortcuts(): ShortcutEntry[] {
  return [...activeMap.value.values()].map((s) => s.entry)
}

/** Reassign keys for an existing shortcut by ID. Returns true if found. */
export function reassignShortcut(id: string, newKeys: string[]): boolean {
  const current = activeMap.value
  const existing = current.get(id)
  if (!existing) return false
  const next = new Map(current)
  next.set(id, { ...existing, entry: { ...existing.entry, keys: newKeys } })
  activeMap.value = next
  return true
}

/** Format a key combo for display (e.g. "mod+k" → "⌘K" on Mac). */
export function formatCombo(combo: string): string {
  const parsed = parseCombo(combo)
  const parts: string[] = []
  if (parsed.modifiers.meta) parts.push(IS_MAC ? '⌘' : 'Win')
  if (parsed.modifiers.ctrl) parts.push(IS_MAC ? '⌃' : 'Ctrl')
  if (parsed.modifiers.alt) parts.push(IS_MAC ? '⌥' : 'Alt')
  if (parsed.modifiers.shift) parts.push(IS_MAC ? '⇧' : 'Shift')
  const keyMap: Record<string, string> = {
    escape: 'Esc', enter: 'Enter', ' ': 'Space',
    arrowup: '↑', arrowdown: '↓', arrowleft: '←', arrowright: '→',
    backspace: '⌫', delete: 'Del', tab: 'Tab'
  }
  parts.push(keyMap[parsed.key] ?? parsed.key.toUpperCase())
  return IS_MAC ? parts.join('') : parts.join('+')
}
