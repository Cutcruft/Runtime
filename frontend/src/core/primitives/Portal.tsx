import type { ComponentChildren } from 'preact'
import { createPortal } from 'preact/compat'

interface PortalProps {
  to?: string
  children?: ComponentChildren
}

export function Portal(props: PortalProps) {
  const target = document.querySelector(props.to ?? 'body') ?? document.body
  return createPortal(props.children ?? null, target)
}
