import { useCfg, type GridConfig } from '@cutcrft/runtime-client'
import { renderChildren, type ComponentProps } from './common'

export default function UiGrid(props: ComponentProps) {
  const cfg = useCfg<GridConfig>(props.config, { columns: 1, gap: 'var(--rt-space)' })
  const style: Record<string, string> = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cfg.value.columns ?? 1}, minmax(0, 1fr))`,
    gap: cfg.value.gap,
    ...(cfg.value.style ?? {})
  }

  return (
    <div class={`ui-grid${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={style}>
      {renderChildren(cfg.value.components, props.context)}
    </div>
  )
}
