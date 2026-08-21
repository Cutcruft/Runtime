import { resolveComponent } from '@cutcrft/plugin-sdk'
import { resolveEditor } from '@cutcrft/plugin-sdk'
import type { ComponentDefinition } from '@cutcrft/plugin-sdk'
import type { BindingContext } from '@cutcrft/plugin-sdk'
import * as styles from './styles.css'

interface ContainerProps {
  component: ComponentDefinition
  context?: BindingContext
}

export function Container({ component, context }: ContainerProps) {
  // Try editor first, then registered components
  const Editor = resolveEditor(component.type)
  const Comp = Editor ?? resolveComponent(component.type)

  if (Comp) {
    const C = Comp as any
    return <C config={component.config} context={context} data-gesture-type={component.type} />
  }

  return (
    <div class={styles.containerUnknown}>
      <strong>{component.type}</strong>
      <pre class={styles.containerUnknownPre}>{JSON.stringify(component.config, null, 2)}</pre>
    </div>
  )
}
