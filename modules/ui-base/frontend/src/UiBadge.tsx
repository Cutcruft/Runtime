import { useCfg, type BadgeConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiBadge(props: ComponentProps) {
  const cfg = useCfg<BadgeConfig>(props.config, { tone: 'neutral', text: '' })
  return (
    <span
      class={`ui-badge ui-badge--${cfg.value.tone}${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      style={cfg.value.style}
      title={cfg.value.tooltip}
    >
      {cfg.value.text}
    </span>
  )
}
