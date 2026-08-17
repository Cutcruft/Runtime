import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import type { EditorView } from '@tiptap/pm/view'
import { cursorStore } from '../store/cursors'

function buildDecorations(view: EditorView, entityType: string, objectId: string): DecorationSet {
  const remoteCursors = cursorStore.getCursorsForObject(entityType, objectId)
  const decorations: Decoration[] = []

  for (const cursor of remoteCursors) {
    if (!cursor.position || typeof cursor.position !== 'object') continue
    const pos = cursor.position as { from?: number; to?: number }
    const from = pos.from
    const to = pos.to ?? from

    if (from == null || from < 0) continue

    if (to != null && to > from) {
      decorations.push(
        Decoration.inline(from, to, {
          style: `background-color: ${cursor.color}22; border-bottom: 2px solid ${cursor.color}`
        })
      )
    }

    const caretEl = document.createElement('span')
    caretEl.className = 'rt-remote-caret'
    caretEl.style.cssText = `position:relative;display:inline-block;width:2px;background:${cursor.color};`
    const label = document.createElement('span')
    label.className = 'rt-remote-caret__label'
    label.style.cssText = `
      position:absolute;top:-1.4em;left:0;
      padding:1px 4px;border-radius:3px;
      background:${cursor.color};color:#fff;
      font-size:11px;line-height:1.3;white-space:nowrap;pointer-events:none;
    `
    label.textContent = cursor.name
    caretEl.appendChild(label)

    decorations.push(
      Decoration.widget(from, caretEl, { side: -1, key: `caret-${cursor.sessionId}` })
    )
  }

  return DecorationSet.create(view.state.doc, decorations)
}

export const RemoteCursors = Extension.create({
  name: 'remoteCursors',

  addOptions() {
    return {
      entityType: '',
      objectId: ''
    }
  },

  addProseMirrorPlugins() {
    const ext = this
    const key = new PluginKey('remoteCursors')
    let version = 0

    return [
      new Plugin({
        key,
        state: {
          init: () => DecorationSet.empty,
          apply(_tr, old) { return old }
        },
        props: {
          decorations(state) { return (this as unknown as { getState(s: typeof state): DecorationSet }).getState(state) }
        },
        view: (view: EditorView) => {
          function update() {
            const plugin = key.get(view.state)
            if (!plugin) return
            version++
            const next = buildDecorations(view, ext.options.entityType, ext.options.objectId)
            const tr = view.state.tr.setMeta(key, { decorations: next, version })
            view.dispatch(tr)
          }

          const unsub = cursorStore.subscribe(update)
          const timer = setInterval(update, 500)

          return { destroy() { unsub(); clearInterval(timer) } }
        }
      })
    ]
  }
})
