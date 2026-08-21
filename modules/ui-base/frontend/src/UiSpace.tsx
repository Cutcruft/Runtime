import { useCfg, type SpaceConfig } from '@cutcrft/plugin-sdk'
import { renderChildren, type ComponentProps } from './common'

export default function UiSpace(props: ComponentProps) {
  const cfg = useCfg<SpaceConfig>(props.config, { direction: 'horizontal', gap: '0.5rem' })
  const direction = cfg.value.direction ?? 'horizontal'
  const style: Record<string, string> = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: cfg.value.gap,
    flexWrap: cfg.value.wrap ? 'wrap' : 'nowrap',
    alignItems: cfg.value.align,
    ...(cfg.value.style ?? {})
  }

  return (
    <div class={`ui-space${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={style}>
      {renderChildren(cfg.value.components, props.context)}
    </div>
  )
}
