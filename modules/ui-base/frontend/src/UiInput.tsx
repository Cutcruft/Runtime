import { useCfg, type InputConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiInput(props: ComponentProps) {
  const cfg = useCfg<InputConfig>(props.config, { type: 'text', placeholder: '' })
  return (
    <label class={`ui-field${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style}>
      {cfg.value.label ? <span class="ui-field__label">{cfg.value.label}</span> : null}
      <input
        class="ui-input"
        type={cfg.value.type ?? 'text'}
        placeholder={cfg.value.placeholder}
        defaultValue={cfg.value.defaultValue as string | number | undefined}
        disabled={cfg.value.disabled}
        title={cfg.value.tooltip}
      />
    </label>
  )
}
