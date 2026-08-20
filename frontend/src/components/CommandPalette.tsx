import { useSignal, computed } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { configStore } from '../store/config'
import { i18nStore } from '../store/i18n'
import { sessionStore } from '../store/session'
import { pageStore } from '../store/page'
import type { CommandEntry } from '../protocol/types'
import * as styles from './commandPalette.css'

interface PaletteItem {
  kind: 'command' | 'page'
  id: string
  description: string
  icon?: string
  pageId?: string
  command?: CommandEntry
  group?: string
}

interface PaletteGroup {
  label: string
  items: PaletteItem[]
}

export function CommandPalette() {
  const t = i18nStore.t
  const tr = i18nStore.tr
  const open = useSignal(false)
  const query = useSignal('')
  const selectedIndex = useSignal(0)

  const groups = computed<PaletteGroup[]>(() => {
    const pages: PaletteItem[] = configStore.pages.map((page) => ({
      kind: 'page',
      id: `page:${page.id}`,
      description: tr(page.title),
      icon: '◈',
      pageId: page.id
    }))
    const byGroup = new Map<string, PaletteItem[]>()
    for (const command of configStore.commands) {
      if (command.visibility === 'PRIVATE') continue
      const group = command.group ?? 'Commands'
      if (!byGroup.has(group)) byGroup.set(group, [])
      byGroup.get(group)!.push({ kind: 'command', id: command.id, description: command.description, group, command })
    }
    const commandGroups = Array.from(byGroup.entries()).map(([label, items]) => ({ label, items }))
    return [{ label: 'Pages', items: pages }, ...commandGroups].filter((g) => g.items.length > 0)
  })

  const flatItems = computed(() => groups.value.flatMap((group) => group.items))

  const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return groups.value
    return groups.value
      .map((group) => ({
        label: group.label,
        items: group.items.filter(
          (item) => item.id.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
        )
      }))
      .filter((group) => group.items.length > 0)
  })

  function execute(item: PaletteItem): void {
    open.value = false
    if (item.kind === 'page' && item.pageId) {
      pageStore.openPage(item.pageId)
    } else if (item.command) {
      sessionStore.executeCommand(item.command.id, {}).catch(() => {})
    }
  }

  function flatIndex(group: PaletteGroup, index: number): number {
    let offset = 0
    for (const g of filtered.value) {
      if (g === group) return offset + index
      offset += g.items.length
    }
    return index
  }

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        open.value = !open.value
        query.value = ''
        selectedIndex.value = 0
        return
      }
      if (!open.value) return
      if (event.key === 'Escape') {
        open.value = false
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        selectedIndex.value = Math.min(selectedIndex.value + 1, flatItems.value.length - 1)
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
        return
      }
      if (event.key === 'Enter' && flatItems.value.length > 0) {
        event.preventDefault()
        execute(flatItems.value[selectedIndex.value])
      }
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [])

  if (!open.value) return null

  return (
    <div class={styles.overlay} onClick={(e: MouseEvent) => { if (e.target === e.currentTarget) open.value = false }}>
      <div class={styles.palette}>
        <input
          class={styles.input}
          placeholder={t('core.palette.placeholder')}
          onInput={(e: Event) => { query.value = (e.target as HTMLInputElement).value; selectedIndex.value = 0 }}
          autofocus
        />
        <ul class={styles.list}>
          {filtered.value.map((group) => (
            <>
              <li class={styles.group}>{group.label}</li>
              {group.items.map((item, index) => (
                <li
                  key={item.id}
                  class={`${styles.item}${flatIndex(group, index) === selectedIndex.value ? ` ${styles.itemActive}` : ''}`}
                  onClick={() => execute(item)}
                >
                  {item.icon && <span class={styles.icon}>{item.icon}</span>}
                  {item.kind === 'command' ? (
                    <code class={styles.id}>{item.id}</code>
                  ) : (
                    <span class={`${styles.id} ${styles.idPage}`}>{item.id.replace(/^page:/, '')}</span>
                  )}
                  <span class={styles.description}>{item.description}</span>
                </li>
              ))}
            </>
          ))}
          {flatItems.value.length === 0 && (
            <li class={styles.empty}>{t('core.palette.empty')}</li>
          )}
        </ul>
      </div>
    </div>
  )
}
