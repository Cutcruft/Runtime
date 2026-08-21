import { overlayService } from '@cutcrft/plugin-sdk'
import { ContextMenuHost } from './ContextMenuHost'
import { ModalHost } from './ModalHost'
import { PanelHost } from './PanelHost'
import { TooltipHost } from './TooltipHost'
import { createPortal } from 'preact/compat'

export function OverlayHost() {
  const { overlaysSignal } = overlayService
  const overlays = overlaysSignal.value

  const rendered = overlays.map((instance) => {
    switch (instance.definition.kind) {
      case 'menu':
        return <ContextMenuHost key={instance.uid} instance={instance} />
      case 'modal':
        return <ModalHost key={instance.uid} instance={instance} />
      case 'panel':
        return <PanelHost key={instance.uid} instance={instance} />
      case 'tooltip':
        return <TooltipHost key={instance.uid} instance={instance} />
      default:
        return null
    }
  })

  return createPortal(<>{rendered}</>, document.body)
}
