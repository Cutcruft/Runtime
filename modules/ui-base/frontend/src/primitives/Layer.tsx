import { useRef, useEffect } from 'preact/hooks'
import type { BindingContext } from '@cutcrft/plugin-sdk'
import type { LayerDefinition } from '@cutcrft/plugin-sdk'
import { Section } from './Section'
import * as styles from './styles.css'

interface LayerProps {
  layer: LayerDefinition
  pageId: string
  context?: BindingContext
}

export function Layer({ layer, context }: LayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const isPassThrough = layer.pointerEvents === 'pass-through'

  function updatePassThrough() {
    const el = layerRef.current
    if (!el || !isPassThrough) return
    const interactive = el.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [role="tab"], [data-interactive], .editor, .toolbar'
    )
    interactive.forEach(child => {
      ;(child as HTMLElement).style.pointerEvents = 'auto'
    })
  }

  useEffect(() => {
    if (!isPassThrough) return
    updatePassThrough()
    const observer = new MutationObserver(() => updatePassThrough())
    if (layerRef.current) {
      observer.observe(layerRef.current, { childList: true, subtree: true })
    }
    return () => observer.disconnect()
  }, [isPassThrough])

  // Build inline style from layer position
  const layerStyle: Record<string, string> = {
    zIndex: String(layer.order),
    opacity: String(layer.opacity ?? 1),
    pointerEvents: isPassThrough ? 'none' : (layer.pointerEvents ?? 'auto'),
  }

  const pos = layer.position
  if (pos) {
    if (pos.type) layerStyle.position = pos.type
    if (pos.top != null) layerStyle.top = pos.top
    if (pos.left != null) layerStyle.left = pos.left
    if (pos.right != null) layerStyle.right = pos.right
    if (pos.bottom != null) layerStyle.bottom = pos.bottom
    if (pos.width != null) layerStyle.width = pos.width
    if (pos.height != null) layerStyle.height = pos.height
  }

  if (layer.style) {
    Object.assign(layerStyle, layer.style)
  }

  return (
    <div
      ref={layerRef}
      class={`${styles.layer} ${layer.className ?? ''} ${!layer.visible ? styles.layerHidden : ''}`}
      style={layerStyle}
      data-layer-id={layer.id}
    >
      {layer.sections.map((section) => (
        <Section key={section.id} section={section} context={context} />
      ))}
    </div>
  )
}
