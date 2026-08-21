import { useEffect } from 'preact/hooks'
import { Container } from '../primitives/Container'
import { overlayService, type OverlayInstance } from '@cutcrft/plugin-sdk'
import { i18nStore } from '@cutcrft/plugin-sdk'
import * as styles from './overlayStyles.css'

interface Props {
  instance: OverlayInstance
}

export function ModalHost({ instance }: Props) {
  const tr = i18nStore.tr

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

  return (
    <div class={styles.modalBackdrop} onMouseDown={(e: MouseEvent) => { if (e.target === e.currentTarget) close() }}>
      <div class={styles.modal} style={{ width: instance.definition.width ?? 'min(90vw, 32rem)' }} role="dialog">
        {instance.definition.title && (
          <header class={styles.modalHeader}>
            <h3 class={styles.modalTitle}>{tr(instance.definition.title ?? '')}</h3>
            <button class={styles.modalClose} onClick={close}>✕</button>
          </header>
        )}
        <div class={styles.modalBody}>
          {instance.definition.content && (
            <Container component={instance.definition.content} context={instance.context} />
          )}
        </div>
      </div>
    </div>
  )
}
