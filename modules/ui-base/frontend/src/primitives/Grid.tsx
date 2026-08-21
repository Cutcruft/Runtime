import type { ComponentChildren } from 'preact'
import * as styles from './styles.css'

interface GridProps {
  columns?: number | string
  rows?: number | string
  gap?: string
  minColWidth?: string
  minRowHeight?: string
  align?: string
  justify?: string
  padding?: string
  children?: ComponentChildren
}

export function Grid(props: GridProps) {
  const gridTemplateColumns = props.minColWidth
    ? `repeat(auto-fill, minmax(${props.minColWidth}, 1fr))`
    : typeof props.columns === 'number'
      ? `repeat(${props.columns}, 1fr)`
      : props.columns

  const gridTemplateRows = typeof props.rows === 'number'
    ? `repeat(${props.rows}, 1fr)`
    : props.rows

  return (
    <div
      class={styles.grid}
      style={{
        gridTemplateColumns,
        gridTemplateRows,
        gap: props.gap,
        gridAutoRows: props.minRowHeight,
        alignItems: props.align,
        justifyItems: props.justify,
        padding: props.padding,
      }}
    >
      {props.children}
    </div>
  )
}
