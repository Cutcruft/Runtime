import { useSignal, computed } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import { sessionStore } from '../store/session'
import { configStore } from '../store/config'
import { i18nStore } from '../store/i18n'
import { toasts } from '../store/toasts'
import { useCfg } from '../renderer/useConfig'
import { useData } from '../renderer/useData'
import { loadData, resolveParams } from '../renderer/bindingEngine'
import { RemoteCursors } from './RemoteCursors'
import type { BindingContext, MentionSpec, RichTextConfig, RichTextContentFormat, RichTextToolbarButton } from '../protocol/componentSpec'
import '../styles/richtext.css'

interface ComponentProps {
  config: Record<string, unknown>
  context?: BindingContext
}

interface MentionItem {
  id: string
  label: string
}

interface MentionRenderState {
  items: MentionItem[]
  command: ((item: MentionItem) => void) | null
}

export default function UiRichText(props: ComponentProps) {
  const t = i18nStore.t
  const cfg = useCfg<RichTextConfig>(props.config, { contentFormat: 'html', placeholder: '' })
  const rootRef = useRef<HTMLDivElement | null>(null)

  const entityType = computed(() => cfg.value.content?.entityType ?? '')
  const objectId = computed(() => (props.context?.row as Record<string, unknown>)?.id as string ?? '')

  const data = computed(() => cfg.value.content)
  const { value, error } = useData(() => data.value, () => props.context ?? {})

  const editable = computed(() => !cfg.value.readonly && cfg.value.disabled !== true)
  const height = computed(() => cfg.value.height)

  // Editor instance + toolbar re-render trigger
  const editor = useSignal<Editor | null>(null)
  const renderTick = useSignal(0)

  // ── Mentions ──────────────────────────────────────────────────
  let mentionItems: MentionItem[] = []
  let mentionState: MentionRenderState = { items: [], command: null }
  let mentionSelected = 0
  let mentionPopup: HTMLDivElement | null = null

  function normalizeMentions(value: unknown): MentionItem[] {
    const normalize = (items: unknown): MentionItem[] => {
      if (!Array.isArray(items)) return []
      return items
        .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
        .map((item) => ({ id: String(item.id ?? ''), label: String(item.label ?? item.id ?? '') }))
    }
    if (Array.isArray(value)) return normalize(value)
    if (value && typeof value === 'object' && Array.isArray((value as Record<string, unknown>).items)) {
      return normalize((value as Record<string, unknown>).items)
    }
    return []
  }

  async function loadMentions(): Promise<void> {
    const spec = cfg.value.mentions
    if (!spec?.command) return
    const { value, error } = await loadData({ command: spec.command, params: spec.params }, props.context ?? {})
    if (error) {
      toasts.push({ message: error, kind: 'error' })
      return
    }
    mentionItems = normalizeMentions(value)
  }

  function filterMentions(query: string): MentionItem[] {
    const q = query.toLowerCase()
    return mentionItems.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 8)
  }

  function hideMentionPopup(): void {
    mentionPopup?.remove()
    mentionPopup = null
  }

  function drawMentionPopup(): void {
    const items = mentionState.items
    if (!items.length) return
    if (!mentionPopup) {
      mentionPopup = document.createElement('div')
      mentionPopup.className = 'rt-mention-popup'
      document.body.appendChild(mentionPopup)
    }
    const popup = mentionPopup
    popup.innerHTML = ''
    items.forEach((item, index) => {
      const row = document.createElement('button')
      row.type = 'button'
      row.className = `rt-mention-popup__item${index === mentionSelected ? ' rt-mention-popup__item--active' : ''}`
      row.textContent = item.label
      row.addEventListener('mousedown', (event) => event.preventDefault())
      row.addEventListener('click', () => {
        if (mentionState.command) mentionState.command(item)
      })
      popup.appendChild(row)
    })
  }

  function positionMentionPopup(clientRect: (() => DOMRect | null) | null | undefined): void {
    const rect = clientRect?.()
    if (!rect || !mentionPopup) return
    mentionPopup.style.left = `${Math.min(rect.left, window.innerWidth - 240)}px`
    mentionPopup.style.top = `${rect.bottom + 4}px`
  }

  function mentionRenderer() {
    let clientRect: (() => DOMRect | null) | null | undefined = null
    return {
      onStart(props: SuggestionProps): void {
        mentionState = { items: props.items as MentionItem[], command: props.command }
        mentionSelected = 0
        clientRect = props.clientRect
        drawMentionPopup()
        positionMentionPopup(clientRect)
      },
      onUpdate(props: SuggestionProps): void {
        mentionState = { items: props.items as MentionItem[], command: props.command }
        mentionSelected = 0
        clientRect = props.clientRect
        drawMentionPopup()
        positionMentionPopup(clientRect)
      },
      onKeyDown(props: SuggestionKeyDownProps): boolean {
        if (!mentionPopup) return false
        const { event } = props
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          mentionSelected = (mentionSelected + 1) % mentionState.items.length
          drawMentionPopup()
          return true
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          mentionSelected = (mentionSelected - 1 + mentionState.items.length) % mentionState.items.length
          drawMentionPopup()
          return true
        }
        if (event.key === 'Enter') {
          event.preventDefault()
          const item = mentionState.items[mentionSelected]
          if (item) (props as unknown as { command: (p: MentionItem) => void }).command(item)
          return true
        }
        if (event.key === 'Escape') {
          event.preventDefault()
          hideMentionPopup()
          return true
        }
        return false
      },
      onExit(): void {
        hideMentionPopup()
      }
    }
  }

  function mentionExtension(spec: MentionSpec) {
    return Mention.configure({
      HTMLAttributes: { class: 'rt-mention' },
      renderLabel: ({ node }) => `${spec.trigger ?? '@'}${String(node.attrs.label ?? node.attrs.id ?? '')}`,
      suggestion: {
        char: spec.trigger ?? '@',
        items: ({ query }: { query: string }) => filterMentions(query),
        command: ({ editor, range, props }) => {
          const item = props as unknown as MentionItem
          editor
            .chain()
            .focus()
            .insertContentAt(range, { type: 'mention', attrs: { id: item.id, label: item.label } })
            .run()
        },
        render: mentionRenderer
      }
    })
  }

  // ── Editor lifecycle ──────────────────────────────────────────
  let saveTimer: ReturnType<typeof setTimeout> | null = null
  let cursorTimer: ReturnType<typeof setTimeout> | null = null

  function broadcastCursor(): void {
    const inst = editor.value
    if (!inst || !configStore.collaboration?.cursorsEnabled) return
    const sel = inst.state.selection
    if (!sel || !entityType.value || !objectId.value) return
    sessionStore.sendRaw('cursor.update', {
      entityType: entityType.value,
      objectId: objectId.value,
      position: { from: sel.from, to: sel.to },
      selection: { anchor: sel.anchor, head: sel.head },
      name: sessionStore.localParticipant?.name ?? 'Anonymous',
      color: sessionStore.localParticipant?.color ?? '#999'
    })
  }

  function scheduleCursorBroadcast(): void {
    if (cursorTimer) clearTimeout(cursorTimer)
    cursorTimer = setTimeout(broadcastCursor, 200)
  }

  function contentFor(format: RichTextContentFormat): string {
    const inst = editor.value
    if (!inst) return ''
    return format === 'json' ? JSON.stringify(inst.getJSON()) : inst.getHTML()
  }

  function scheduleSave(): void {
    if (!editable.value || !cfg.value.save?.command) return
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      void save()
    }, 600)
  }

  async function save(): Promise<void> {
    if (!cfg.value.save?.command) return
    const payload = { ...(cfg.value.save.params ?? {}), content: contentFor(cfg.value.contentFormat ?? 'html') }
    try {
      await sessionStore.executeCommand(cfg.value.save.command, resolveParams(payload, props.context ?? {}))
      toasts.push({ message: t('core.editor.saved'), kind: 'success' })
    } catch { /* error toast shown by session store */ }
  }

  useEffect(() => {
    const requested = (cfg.value.extensions ?? []) as Array<{ name?: string; options?: { enabled?: boolean } }>
    const enabled = (name: string): boolean => {
      const match = requested.find((ext) => ext.name === name)
      return match ? match.options?.enabled !== false : true
    }
    const extensions = [
      ...(enabled('placeholder') ? [Placeholder.configure({ placeholder: cfg.value.placeholder })] : []),
      ...(enabled('link') ? [Link.configure({ openOnClick: false, autolink: true })] : []),
      ...(enabled('image') ? [Image.configure({ inline: false, allowBase64: true })] : []),
      ...(enabled('task') ? [TaskList, TaskItem.configure({ nested: true })] : []),
      ...(enabled('table') ? [Table.configure({ resizable: true }), TableRow, TableHeader, TableCell] : []),
      Underline,
      ...(cfg.value.mentions?.command ? [mentionExtension(cfg.value.mentions)] : []),
      ...(configStore.collaboration?.cursorsEnabled ? [RemoteCursors.configure({ entityType: entityType.value, objectId: objectId.value })] : []),
      StarterKit.configure({
        heading: enabled('heading') ? { levels: [1, 2, 3] } : false,
        codeBlock: enabled('codeBlock') ? {} : false
      })
    ]

    const instance = new Editor({
      element: rootRef.current ?? undefined,
      editable: editable.value,
      content: '',
      extensions
    })
    instance.setEditable(editable.value)
    instance.on('update', () => scheduleSave())
    instance.on('selectionUpdate', () => scheduleCursorBroadcast())
    editor.value = instance
    renderTick.value++

    if (error.value) toasts.push({ message: error.value, kind: 'error' })
    void loadMentions()

    return () => {
      if (saveTimer) clearTimeout(saveTimer)
      if (cursorTimer) clearTimeout(cursorTimer)
      hideMentionPopup()
      instance.destroy()
      editor.value = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load content from data binding
  useEffect(() => {
    const next = value.value
    const inst = editor.value
    if (next == null || !inst) return
    if (cfg.value.contentFormat === 'json') {
      try {
        inst.commands.setContent(JSON.parse(String(next)) as object)
      } catch { /* invalid json */ }
    } else {
      inst.commands.setContent(String(next))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.value])

  // Readonly toggling
  useEffect(() => {
    editor.value?.setEditable(editable.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable.value])

  const toolbarButtons: RichTextToolbarButton[] = [
    'undo', 'redo', 'heading1', 'heading2', 'heading3', 'bold', 'italic',
    'underline', 'strike', 'code', 'bulletList', 'orderedList', 'taskList',
    'blockquote', 'codeBlock', 'link', 'image', 'table'
  ]

  const toolbar = cfg.value.toolbar === false ? [] : (cfg.value.toolbar ?? toolbarButtons)

  const toolbarMeta: Record<RichTextToolbarButton, { label: string; icon: string; action: () => void; active?: () => boolean; disabled?: () => boolean }> = {
    undo: { label: t('core.editor.undo'), icon: '↩', action: () => editor.value?.chain().focus().undo().run(), disabled: () => !editor.value?.can().undo() },
    redo: { label: t('core.editor.redo'), icon: '↪', action: () => editor.value?.chain().focus().redo().run(), disabled: () => !editor.value?.can().redo() },
    heading1: { label: 'H1', icon: 'H1', action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(), active: () => editor.value?.isActive('heading', { level: 1 }) ?? false },
    heading2: { label: 'H2', icon: 'H2', action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(), active: () => editor.value?.isActive('heading', { level: 2 }) ?? false },
    heading3: { label: 'H3', icon: 'H3', action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(), active: () => editor.value?.isActive('heading', { level: 3 }) ?? false },
    bold: { label: t('core.editor.bold'), icon: 'B', action: () => editor.value?.chain().focus().toggleBold().run(), active: () => editor.value?.isActive('bold') ?? false },
    italic: { label: t('core.editor.italic'), icon: 'I', action: () => editor.value?.chain().focus().toggleItalic().run(), active: () => editor.value?.isActive('italic') ?? false },
    underline: { label: t('core.editor.underline'), icon: 'U', action: () => editor.value?.chain().focus().toggleUnderline().run(), active: () => editor.value?.isActive('underline') ?? false },
    strike: { label: t('core.editor.strike'), icon: 'S', action: () => editor.value?.chain().focus().toggleStrike().run(), active: () => editor.value?.isActive('strike') ?? false },
    code: { label: t('core.editor.code'), icon: '</>', action: () => editor.value?.chain().focus().toggleCode().run(), active: () => editor.value?.isActive('code') ?? false },
    bulletList: { label: t('core.editor.bulletList'), icon: '•', action: () => editor.value?.chain().focus().toggleBulletList().run(), active: () => editor.value?.isActive('bulletList') ?? false },
    orderedList: { label: t('core.editor.orderedList'), icon: '1.', action: () => editor.value?.chain().focus().toggleOrderedList().run(), active: () => editor.value?.isActive('orderedList') ?? false },
    taskList: { label: t('core.editor.taskList'), icon: '☑', action: () => editor.value?.chain().focus().toggleTaskList().run(), active: () => editor.value?.isActive('taskList') ?? false },
    blockquote: { label: t('core.editor.blockquote'), icon: '❝', action: () => editor.value?.chain().focus().toggleBlockquote().run(), active: () => editor.value?.isActive('blockquote') ?? false },
    codeBlock: { label: t('core.editor.codeBlock'), icon: '{ }', action: () => editor.value?.chain().focus().toggleCodeBlock().run(), active: () => editor.value?.isActive('codeBlock') ?? false },
    link: { label: t('core.editor.link'), icon: '🔗', action: () => toggleLink(), active: () => editor.value?.isActive('link') ?? false },
    image: { label: t('core.editor.image'), icon: '🖼', action: () => insertImage(), disabled: () => !editable.value },
    table: { label: t('core.editor.table'), icon: '⊞', action: () => editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), active: () => editor.value?.isActive('table') ?? false }
  }

  function toggleLink(): void {
    if (!editor.value) return
    const prev = editor.value.getAttributes('link').href as string | undefined
    const url = window.prompt(t('core.editor.linkPrompt'), prev ?? 'https://')
    if (url === null) return
    if (!url) {
      editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  function insertImage(): void {
    if (!editor.value) return
    const url = window.prompt(t('core.editor.imagePrompt'))
    if (url) editor.value.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div class="ui-richtext" style={height.value ? { height: height.value } : undefined}>
      {cfg.value.toolbar !== false && editable.value ? (
        <div class="ui-richtext__toolbar">
          {toolbar.map((name) => (
            <button
              key={name}
              class={`ui-richtext__btn${toolbarMeta[name]?.active?.() ? ' ui-richtext__btn--active' : ''}${toolbarMeta[name]?.disabled?.() ? ' ui-richtext__btn--disabled' : ''}`}
              title={toolbarMeta[name]?.label}
              onClick={() => toolbarMeta[name]?.action()}
            >
              {toolbarMeta[name]?.icon}
            </button>
          ))}
        </div>
      ) : null}
      <div class={`ui-richtext__editor${!editable.value ? ' ui-richtext__editor--readonly' : ''}`}>
        <div ref={rootRef} />
      </div>
    </div>
  )
}
