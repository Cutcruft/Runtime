import { useRef, useEffect } from 'preact/hooks'
import { configStore } from '@cutcrft/plugin-sdk'
import { pageStore } from '@cutcrft/plugin-sdk'
import { routerStore } from '@cutcrft/plugin-sdk'
import { i18nStore } from '@cutcrft/plugin-sdk'
import * as styles from './styles.css'

// NOTE: Full signal reactivity will be wired in M3 when stores migrate to @preact/signals.

export function Tabs() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const tabs = pageStore.openPages.map((pageId) => {
    const page = configStore.pages.find((p) => p.id === pageId)
    return { pageId, title: page ? i18nStore.tr(page.title) : pageId }
  })

  function activate(pageId: string): void {
    routerStore.open(pageId)
  }

  function closeTab(event: MouseEvent, pageId: string): void {
    event.stopPropagation()
    pageStore.closeTab(pageId)
  }

  function onAuxClick(event: MouseEvent, pageId: string): void {
    if (event.button === 1) closeTab(event, pageId)
  }

  useEffect(() => {
    const container = scrollRef.current
    const active = container?.querySelector(`.${styles.tabsbarTabActive}`)
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }, [pageStore.activePageId])

  return (
    <div class={styles.tabsbar}>
      <div ref={scrollRef} class={styles.tabsbarScroll}>
        {tabs.map((tab) => (
          <button
            key={tab.pageId}
            type="button"
            class={`${styles.tabsbarTab} ${pageStore.activePageId === tab.pageId ? styles.tabsbarTabActive : ''}`}
            onClick={() => activate(tab.pageId)}
            onAuxClick={(e: MouseEvent) => onAuxClick(e, tab.pageId)}
          >
            <span class={styles.tabsbarTitle}>{tab.title}</span>
            <span
              class={styles.tabsbarClose}
              role="button"
              tabIndex={-1}
              aria-label="Close"
              onClick={(e: MouseEvent) => closeTab(e, tab.pageId)}
            >
              ×
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
