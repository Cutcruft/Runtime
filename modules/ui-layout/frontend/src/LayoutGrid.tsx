import { useCfg } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'
import { renderLayoutChildren } from './common'

export interface GridConfig {
  columns?: number
  rows?: number
  gap?: string
  rowGap?: string
  columnGap?: string
  align?: 'start' | 'center' | 'end' | 'stretch'
  className?: string
  style?: Record<string, string>
}

/** V10 — configurable grid layout primitive. */
export default function LayoutGrid(props: ComponentProps) {
  const cfg = useCfg<GridConfig>(props.config, { columns: 1, gap: 'var(--rt-space)' })
  const style: Record<string, string> = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cfg.value.columns ?? 1}, minmax(0, 1fr))`,
    gap: cfg.value.gap ?? 'var(--rt-space)',
    ...(cfg.value.rowGap ? { rowGap: cfg.value.rowGap } : {}),
    ...(cfg.value.columnGap ? { columnGap: cfg.value.columnGap } : {}),
    ...(cfg.value.align ? { alignItems: cfg.value.align } : {}),
    ...(cfg.value.style ?? {}),
  }
  return (
    <div class={`ui-layout-grid${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={style}>
      {renderLayoutChildren(props)}
    </div>
  )
}
