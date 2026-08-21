import { useEffect, useRef } from 'preact/hooks'
import { overlayService, type OverlayInstance } from '@cutcrft/plugin-sdk'
import { i18nStore } from '@cutcrft/plugin-sdk'
import * as styles from './overlayStyles.css'

interface Props {
  instance: OverlayInstance
}

export function TooltipHost({ instance }: Props) {
  const tr = i18nStore.tr
  const elRef = useRef<HTMLDivElement>(null)

  const clamp = () => {
    const node = elRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.left = `${Math.min(Math.max(8, instance.anchor?.x ?? 8), window.innerWidth - rect.width - 8)}px`
    node.style.top = `${Math.min(Math.max(8, instance.anchor?.y ?? 8), window.innerHeight - rect.height - 8)}px`
  }

  useEffect(() => {
    clamp()
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        overlayService.close(instance.uid)
      }
    }
    window.addEventListener('keydown', onKeydown, true)
    window.addEventListener('resize', clamp)
    return () => {
      window.removeEventListener('keydown', onKeydown, true)
      window.removeEventListener('resize', clamp)
    }
  }, [instance.uid])

  return (
    <div
      ref={elRef}
      class={styles.tooltip}
      style={{ '--rt-placement': instance.definition.placement ?? 'top' } as any}
      onMouseDown={(e: Event) => e.stopPropagation()}
    >
      {tr(instance.definition.text ?? '')}
    </div>
  )
}
