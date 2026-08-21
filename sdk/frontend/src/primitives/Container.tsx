import { resolveComponent } from '../renderer/componentRegistry'
import { resolveEditor } from '../editor-registry'
import type { ComponentDefinition } from '../protocol/types'
import type { BindingContext } from '../protocol/componentSpec'
import * as styles from './styles.css'

interface ContainerProps {
  component: ComponentDefinition
  context?: BindingContext
}

/**
 * V10.2 — universal renderer host. Resolves a component by type from the
 * registry (modules register primitives here) and renders it. If the component's
 * config declares `children` (nested primitives) and the resolved component did
 * not render them itself, this host renders them recursively.
 */
export function Container({ component, context }: ContainerProps) {
  const Editor = resolveEditor(component.type)
  const Comp = Editor ?? resolveComponent(component.type)

  if (Comp) {
    const C = Comp as any
    const cfg = component.config ?? {}
    const hasChildren = Array.isArray(cfg.children) && (cfg.children as unknown[]).length > 0
    return (
      <C config={cfg} context={context} data-gesture-type={component.type}>
        {hasChildren ? renderChildren(cfg.children as ComponentDefinition[], context) : null}
      </C>
    )
  }

  return (
    <div class={styles.containerUnknown}>
      <strong>{component.type}</strong>
      <pre class={styles.containerUnknownPre}>{JSON.stringify(component.config, null, 2)}</pre>
    </div>
  )
}

/** Renders nested children recursively through the Container host. */
function renderChildren(children: ComponentDefinition[], context?: BindingContext) {
  if (!children?.length) return null
  return (
    <>
      {children.map((child, index) => (
        <Container key={index} component={child} context={context} />
      ))}
    </>
  )
}
