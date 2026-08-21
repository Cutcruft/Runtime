import { useCfg } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'
import { renderLayoutChildren } from './common'

export interface StackConfig {
  direction?: 'horizontal' | 'vertical'
  gap?: string
  wrap?: boolean
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  className?: string
  style?: Record<string, string>
}

/** V10 — configurable flex stack layout primitive (row or column). */
export default function LayoutStack(props: ComponentProps) {
  const cfg = useCfg<StackConfig>(props.config, { direction: 'vertical', gap: 'var(--rt-space)' })
  const vertical = (cfg.value.direction ?? 'vertical') === 'vertical'
  const style: Record<string, string> = {
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
    gap: cfg.value.gap ?? 'var(--rt-space)',
    ...(cfg.value.wrap ? { flexWrap: 'wrap' as string } : {}),
    ...(cfg.value.align ? { alignItems: cfg.value.align } : {}),
    ...(cfg.value.justify ? { justifyContent: cfg.value.justify } : {}),
    ...(cfg.value.style ?? {}),
  }
  return (
    <div class={`ui-layout-stack${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={style}>
      {renderLayoutChildren(props)}
    </div>
  )
}
