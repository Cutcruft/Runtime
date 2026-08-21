import { useCfg, iconView, type AvatarConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function UiAvatar(props: ComponentProps) {
  const cfg = useCfg<AvatarConfig>(props.config, { size: 'medium', tone: 'neutral' })
  const src = iconView(cfg.value.src).src ?? cfg.value.src
  const fallback = cfg.value.fallback ?? (cfg.value.name ? initials(cfg.value.name) : '')

  return (
    <span
      class={`ui-avatar ui-avatar--${cfg.value.size} ui-avatar--${cfg.value.tone}${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      style={cfg.value.style}
      title={cfg.value.tooltip}
    >
      {src ? <img class="ui-avatar__img" src={src} alt="" /> : <span class="ui-avatar__fallback">{fallback}</span>}
    </span>
  )
}
