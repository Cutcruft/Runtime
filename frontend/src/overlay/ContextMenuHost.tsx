import { useSignal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { overlayService, type OverlayInstance } from './overlayService'
import { i18nStore } from '../store/i18n'
import type { MenuItemSpec } from '../protocol/componentSpec'
import * as styles from './overlayStyles.css'

interface Props {
  instance: OverlayInstance
}

interface SubmenuState {
  item: MenuItemSpec
  x: number
  y: number
}

export function ContextMenuHost({ instance }: Props) {
  const tr = i18nStore.tr
  const submenu = useSignal<SubmenuState | null>(null)

  useEffect(() => {
    const onOutsideClick = () => overlayService.close(instance.uid)
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        overlayService.close(instance.uid)
      }
    }
    document.addEventListener('mousedown', onOutsideClick, true)
    window.addEventListener('keydown', onKeydown, true)
    return () => {
      document.removeEventListener('mousedown', onOutsideClick, true)
      window.removeEventListener('keydown', onKeydown, true)
    }
  }, [instance.uid])

  const setSubmenu = (item: MenuItemSpec, event: MouseEvent) => {
    if (!item.items?.length) {
      submenu.value = null
      return
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    submenu.value = { item, x: rect.right + 2, y: rect.top - 4 }
  }

  return (
    <>
      <div
        class={styles.menu}
        style={{ left: `${instance.anchor?.x ?? 0}px`, top: `${instance.anchor?.y ?? 0}px` }}
        onContextMenu={(e: Event) => e.preventDefault()}
      >
        {(instance.definition.items ?? []).map((item, index) => (
          <div
            key={index}
            class={`${styles.menuItem} ${
              item.divider ? '' : ''
            }${item.disabled ? ` ${styles.menuItemDisabled}` : ''}${
              item.danger ? ` ${styles.menuItemDanger}` : ''
            }${item.items?.length ? ` ${styles.menuItemSubmenu}` : ''}`}
            onClick={(e: Event) => {
              e.stopPropagation()
              if (!item.items?.length) overlayService.executeMenuItem(item, instance)
            }}
            onMouseEnter={(e: MouseEvent) => setSubmenu(item, e)}
            onMouseLeave={() => { submenu.value = null }}
          >
            {item.divider ? (
              <span class={styles.menuDivider} />
            ) : (
              <>
                <span class={styles.menuIcon}>{item.icon ?? ''}</span>
                <span class={styles.menuLabel}>{tr(item.label)}</span>
                {item.shortcut && <span class={styles.menuShortcut}>{item.shortcut}</span>}
                {item.items?.length && <span class={styles.menuCaret}>›</span>}
              </>
            )}
          </div>
        ))}
      </div>
      {submenu.value && (
        <div
          class={styles.menuSubmenu}
          style={{ left: `${submenu.value.x}px`, top: `${submenu.value.y}px` }}
          onClick={(e: Event) => e.stopPropagation()}
        >
          {(submenu.value.item.items ?? []).map((child, index) => (
            <div
              key={index}
              class={`${styles.menuItem}${
                child.divider ? ` ${styles.menuDivider}` : ''
              }${child.disabled ? ` ${styles.menuItemDisabled}` : ''}${
                child.danger ? ` ${styles.menuItemDanger}` : ''
              }`}
              onClick={(e: Event) => {
                e.stopPropagation()
                overlayService.executeMenuItem(child, instance)
              }}
            >
              {child.divider ? (
                <span class={styles.menuDivider} />
              ) : (
                <>
                  <span class={styles.menuIcon}>{child.icon ?? ''}</span>
                  <span class={styles.menuLabel}>{tr(child.label)}</span>
                  {child.shortcut && <span class={styles.menuShortcut}>{child.shortcut}</span>}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
