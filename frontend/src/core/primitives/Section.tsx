import type { BindingContext } from '../../protocol/componentSpec'
import type { SectionDefinition } from '../../protocol/types'
import { Container } from './Container'
import * as styles from './styles.css'

interface SectionProps {
  section: SectionDefinition
  context?: BindingContext
}

export function Section({ section, context }: SectionProps) {
  const cols = Math.max(1, Math.min(section.columns, 4))
  return (
    <section
      class={styles.section}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: 'var(--rt-space)',
      }}
    >
      {section.components.map((component, index) => (
        <Container
          key={`${index}:${component.type}`}
          component={component}
          context={context}
        />
      ))}
    </section>
  )
}
