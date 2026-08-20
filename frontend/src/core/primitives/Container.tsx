import { resolveComponent } from '../../renderer/componentRegistry'
import { resolveEditor } from '../../editor/editorRegistry'
import type { ComponentDefinition } from '../../protocol/types'
import type { BindingContext } from '../../protocol/componentSpec'
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
