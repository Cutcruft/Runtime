import { useCfg, type TextareaConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiTextarea(props: ComponentProps) {
  const cfg = useCfg<TextareaConfig>(props.config, { rows: 3, placeholder: '' })
  return (
    <label class={`ui-field${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style}>
      {cfg.value.label ? <span class="ui-field__label">{cfg.value.label}</span> : null}
      <textarea
        class="ui-textarea"
        rows={cfg.value.rows}
        placeholder={cfg.value.placeholder}
        defaultValue={cfg.value.defaultValue}
        disabled={cfg.value.disabled}
        title={cfg.value.tooltip}
      />
    </label>
  )
}
