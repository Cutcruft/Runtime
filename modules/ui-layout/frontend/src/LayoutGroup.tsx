import { useCfg } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'
import { renderLayoutChildren } from './common'

export interface GroupConfig {
  className?: string
  style?: Record<string, string>
}

/** V10 — plain wrapper group (no layout). Renders children in flow. */
export default function LayoutGroup(props: ComponentProps) {
  const cfg = useCfg<GroupConfig>(props.config, {})
  return (
    <div class={`ui-layout-group${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style}>
      {renderLayoutChildren(props)}
    </div>
  )
}
