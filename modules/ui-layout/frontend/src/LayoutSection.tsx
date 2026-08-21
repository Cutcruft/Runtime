import { useCfg } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'
import { renderLayoutChildren } from './common'

export interface SectionConfig {
  layout?: string
  columns?: number
  gap?: string
  className?: string
  style?: Record<string, string>
}

/**
 * V10 — page section primitive (unified with layout). Renders `children`
 * (page components) in a grid of `columns`, like the legacy SectionDefinition.
 */
export default function LayoutSection(props: ComponentProps) {
  const cfg = useCfg<SectionConfig>(props.config, { columns: 1 })
  const cols = Math.max(1, Math.min(cfg.value.columns ?? 1, 4))
  const style: Record<string, string> = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: cfg.value.gap ?? 'var(--rt-space)',
    ...(cfg.value.style ?? {}),
  }
  return (
    <section
      class={`ui-layout-section${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      style={style}
    >
      {renderLayoutChildren(props)}
    </section>
  )
}
