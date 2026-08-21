import { useCfg } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export interface SpacerConfig {
  size?: string
  /** If true, grows to fill remaining space (flex: 1). */
  grow?: boolean
  className?: string
  style?: Record<string, string>
}

/** V10 — spacer primitive: fixed-size gap or flex-grow filler. */
export default function LayoutSpacer(props: ComponentProps) {
  const cfg = useCfg<SpacerConfig>(props.config, { grow: false })
  const style: Record<string, string> = {
    ...(cfg.value.grow ? { flex: '1 1 auto' as string } : {}),
    ...(cfg.value.size ? { width: cfg.value.size, height: cfg.value.size } : {}),
    ...(cfg.value.style ?? {}),
  }
  return <div class={`ui-layout-spacer${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={style} />
}
