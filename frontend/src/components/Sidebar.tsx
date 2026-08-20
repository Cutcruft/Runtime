import { useSignal, computed } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { configStore } from '../store/config'
import { pageStore } from '../store/page'
import { routerStore } from '../store/router'
import { i18nStore } from '../store/i18n'
import { iconView } from '../renderer/icon'
import type { NavigationEntry } from '../protocol/types'
import * as styles from './sidebar.css'

interface Props {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: Props) {
  const tr = i18nStore.tr
  const collapsedGroups = useSignal<Set<string>>(new Set())

  const groups = computed(() => {
    const byGroup = new Map<string, NavigationEntry[]>()
    for (const item of configStore.navigation) {
      const key = item.group ? tr(item.group) : ''
      if (!byGroup.has(key)) byGroup.set(key, [])
      byGroup.get(key)!.push(item)
    }
    return Array.from(byGroup.entries()).map(([title, items]) => ({ title, items }))
  })

  function navigate(pageId: string | undefined): void {
    if (!pageId) return
    routerStore.open(pageId)
    onClose?.()
  }

  function toggleGroup(title: string): void {
    const next = new Set(collapsedGroups.value)
    if (next.has(title)) next.delete(title)
    else next.add(title)
    collapsedGroups.value = next
  }

  useEffect(() => {
    const active = pageStore.activePageId
    if (!active) return
    const item = configStore.navigation.find((entry) => entry.pageId === active)
    if (item && item.group) {
      const next = new Set(collapsedGroups.value)
      next.delete(tr(item.group))
      collapsedGroups.value = next
    }
  }, [pageStore.activePageId])

  return (
    <>
      {open && <div class={styles.scrim} onClick={onClose} />}
      <aside class={`${styles.sidebar}${open ? ` ${styles.sidebarDrawer}` : ''}`}>
        <nav>
          {groups.value.map((group) => (
            <>
              {group.title && (
                <div class={styles.groupHeading} onClick={() => toggleGroup(group.title)}>
                  <span class={`${styles.caret}${!collapsedGroups.value.has(group.title) ? ` ${styles.caretOpen}` : ''}`}>▸</span>
                  <span>{group.title}</span>
                </div>
              )}
              {!collapsedGroups.value.has(group.title) && (
                <ul class={styles.list}>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <a
                        class={`${styles.item}${pageStore.activePageId === item.pageId ? ` ${styles.itemActive}` : ''}`}
                        onClick={(e: Event) => { e.preventDefault(); navigate(item.pageId) }}
                      >
                        {iconView(item.icon).src ? (
                          <img class={`${styles.navIcon} ${styles.navIconImg}`} src={iconView(item.icon).src} alt="" />
                        ) : iconView(item.icon).glyph ? (
                          <span class={styles.navIcon}>{iconView(item.icon).glyph}</span>
                        ) : null}
                        <span>{tr(item.label)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ))}
        </nav>
      </aside>
    </>
  )
}
