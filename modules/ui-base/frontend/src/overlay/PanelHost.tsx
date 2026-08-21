import { useEffect } from 'preact/hooks'
import { Container } from '../primitives/Container'
import { overlayService, type OverlayInstance } from '@cutcrft/plugin-sdk'
import { i18nStore } from '@cutcrft/plugin-sdk'
import * as styles from './overlayStyles.css'

interface Props {
  instance: OverlayInstance
}

export function PanelHost({ instance }: Props) {
  const tr = i18nStore.tr
  const side = instance.definition.side ?? 'right'
  const width = instance.definition.width ?? '24rem'
  const height = instance.definition.width ?? '40vh'

  const close = () => overlayService.close(instance.uid)

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    window.addEventListener('keydown', onKeydown, true)
    return () => window.removeEventListener('keydown', onKeydown, true)
  }, [instance.uid])

  const sideClass =
    side === 'left' ? styles.panelLeft :
    side === 'bottom' ? styles.panelBottom :
    styles.panelRight

  return (
    <div class={styles.panelBackdrop} onMouseDown={(e: MouseEvent) => { if (e.target === e.currentTarget) close() }}>
      <aside
        class={`${styles.panel} ${sideClass}`}
        style={side === 'bottom' ? { height } : { width }}
      >
        {instance.definition.title && (
          <header class={styles.panelHeader}>
            <h3 class={styles.panelTitle}>{tr(instance.definition.title ?? '')}</h3>
            <button class={styles.panelClose} onClick={close}>✕</button>
          </header>
        )}
        <div class={styles.panelBody}>
          {instance.definition.content && (
            <Container component={instance.definition.content} context={instance.context} />
          )}
        </div>
      </aside>
    </div>
  )
}
