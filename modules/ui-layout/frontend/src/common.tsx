import { Container } from '@cutcrft/plugin-sdk'
import type { BindingContext, ComponentDefinition } from '@cutcrft/plugin-sdk'

export interface ComponentProps {
  config: Record<string, unknown>
  context?: BindingContext
}

/**
 * V10 — reads nested children from `config.children` (primary) with a fallback
 * to the legacy `config.components` key, and renders them through the Container
 * host (recursive tree renderer).
 */
export function renderLayoutChildren(props: ComponentProps) {
  const cfg = props.config as Record<string, unknown>
  const children = (cfg.children as ComponentDefinition[] | undefined) ??
    (cfg.components as ComponentDefinition[] | undefined)
  if (!children?.length) return null
  return (
    <>
      {children.map((child, index) => (
        <Container key={index} component={child} context={props.context} />
      ))}
    </>
  )
}
