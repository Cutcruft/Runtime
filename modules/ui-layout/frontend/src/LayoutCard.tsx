import { useCfg } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'
import { renderLayoutChildren } from './common'

export interface CardConfig {
  title?: string
  subtitle?: string
  bordered?: boolean
  padding?: string
  className?: string
  style?: Record<string, string>
}

/** V10 — card layout primitive: frame + optional header + children. */
export default function LayoutCard(props: ComponentProps) {
  const cfg = useCfg<CardConfig>(props.config, { bordered: true, padding: 'var(--rt-space-lg)' })
  return (
    <section
      class={`ui-layout-card${cfg.value.bordered ? ' ui-layout-card--bordered' : ''}${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      style={cfg.value.style}
    >
      {cfg.value.title || cfg.value.subtitle ? (
        <header class="ui-layout-card__header">
          {cfg.value.title ? <h3 class="ui-layout-card__title">{cfg.value.title}</h3> : null}
          {cfg.value.subtitle ? <p class="ui-layout-card__subtitle">{cfg.value.subtitle}</p> : null}
        </header>
      ) : null}
      <div class="ui-layout-card__body" style={{ padding: cfg.value.padding }}>
        {renderLayoutChildren(props)}
      </div>
    </section>
  )
}
