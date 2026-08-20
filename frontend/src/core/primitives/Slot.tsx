import type { ComponentChildren } from 'preact'
import * as styles from './styles.css'

interface SlotProps {
  name?: string
  children?: ComponentChildren
}

export function Slot(props: SlotProps) {
  return (
    <div class={styles.slot} data-slot-name={props.name ?? 'default'}>
      {props.children}
    </div>
  )
}
