import { useCfg, useData, formatValue, type TextConfig, type BindingContext } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiText(props: ComponentProps) {
  const cfg = useCfg<TextConfig>(props.config, { tag: 'p', text: '', align: 'left' })
  const { value } = useData(
    () => cfg.value.data,
    () => props.context ?? {}
  )

  const text = cfg.value.text || (cfg.value.data ? formatValue(value.value) : '')
  const tag = cfg.value.tag ?? 'p'

  // Use a switch to render the dynamic tag (avoid createElement complexity in JSX).
  const style = { textAlign: cfg.value.align, ...(cfg.value.style ?? {}) } as Record<string, string>
  const common = {
    class: `ui-text${cfg.value.className ? ' ' + cfg.value.className : ''}`,
    style,
    title: cfg.value.tooltip
  }

  switch (tag) {
    case 'h1':
      return <h1 {...common}>{text}</h1>
    case 'h2':
      return <h2 {...common}>{text}</h2>
    case 'h3':
      return <h3 {...common}>{text}</h3>
    case 'h4':
      return <h4 {...common}>{text}</h4>
    case 'span':
      return <span {...common}>{text}</span>
    case 'div':
      return <div {...common}>{text}</div>
    case 'label':
      return <label {...common}>{text}</label>
    default:
      return <p {...common}>{text}</p>
  }
}
