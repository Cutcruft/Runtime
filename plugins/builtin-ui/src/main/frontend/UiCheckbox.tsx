import { useCfg, type CheckboxConfig } from '@cutcrft/runtime-client'
import type { ComponentProps } from './common'

export default function UiCheckbox(props: ComponentProps) {
  const cfg = useCfg<CheckboxConfig>(props.config, { label: '', defaultValue: false })
  return (
    <label class={`ui-field ui-field--checkbox${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style}>
      <input type="checkbox" class="ui-checkbox" defaultChecked={cfg.value.defaultValue} disabled={cfg.value.disabled} title={cfg.value.tooltip} />
      {cfg.value.label ? <span class="ui-field__label">{cfg.value.label}</span> : null}
    </label>
  )
}
