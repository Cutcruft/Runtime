import { useCfg, type DividerConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiDivider(props: ComponentProps) {
  const cfg = useCfg<DividerConfig>(props.config, { dashed: false })
  return (
    <div
      class={`ui-divider${cfg.value.dashed ? ' ui-divider--dashed' : ''}${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      style={cfg.value.style}
      title={cfg.value.tooltip}
    >
      {cfg.value.text ? <span class="ui-divider__text">{cfg.value.text}</span> : null}
    </div>
  )
}
