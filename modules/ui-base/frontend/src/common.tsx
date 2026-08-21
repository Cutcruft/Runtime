import { useCfg, type BindingContext, type ComponentDefinition } from '@cutcrft/plugin-sdk'
import { Container } from '@cutcrft/plugin-sdk'

export interface ComponentProps {
  config: Record<string, unknown>
  context?: BindingContext
}

/** Renders nested child components (used by Card, Tabs, Space, Grid, List, Accordion). */
export function renderChildren(children: ComponentDefinition[] | undefined, context?: BindingContext) {
  if (!children?.length) return null
  return (
    <>
      {children.map((child, index) => (
        <Container key={index} component={child} context={context} />
      ))}
    </>
  )
}

/** Helper to merge static CSS vars + style overrides + className. */
export function mergeStyle(base: Record<string, string> | undefined, overrides: Record<string, string> | undefined) {
  return { ...(base ?? {}), ...(overrides ?? {}) }
}

/** Emits a component event → action binding (see bindingEngine.dispatchAction). */
export function useConfigTyped<T>(config: Record<string, unknown>, defaults: T) {
  return useCfg<T>(config, defaults)
}
