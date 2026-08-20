import type { ComponentChildren } from 'preact'
import * as styles from './styles.css'

interface StackProps {
  direction?: 'vertical' | 'horizontal'
  gap?: string
  align?: string
  justify?: string
  wrap?: boolean
  padding?: string
  children?: ComponentChildren
}

export function Stack(props: StackProps) {
  const dir = props.direction ?? 'vertical'
  return (
    <div
      class={`${dir === 'vertical' ? styles.stackVertical : styles.stackHorizontal} ${props.wrap ? styles.stackWrap : ''} ${styles.stack}`}
      style={{
        gap: props.gap,
        alignItems: props.align,
        justifyContent: props.justify,
        padding: props.padding,
      }}
    >
      {props.children}
    </div>
  )
}
