import { useSignal } from '@preact/signals'
import { useCfg, sessionStore, findAction, runAction, type BindingContext, type SelectConfig } from '@cutcrft/plugin-sdk'
import { useEffect } from 'preact/hooks'
import type { ComponentProps } from './common'

export default function UiSelect(props: ComponentProps) {
  const cfg = useCfg<SelectConfig>(props.config, {})
  const value = useSignal<string>(cfg.value.defaultValue ?? '')
  const rows = useSignal<Array<Record<string, unknown>>>([])
  const loaded = useSignal(false)

  useEffect(() => {
    const options = cfg.value.options
    if (!options || loaded.value) return
    sessionStore.execute(options.command, options.params ?? {}).then((result) => {
      if (result.status === 'SUCCESS' && Array.isArray(result.value)) {
        rows.value = result.value as Array<Record<string, unknown>>
      }
    }).catch(() => { /* options are optional */ }).finally(() => {
      loaded.value = true
    })
  }, [cfg.value.options])

  function optionValue(option: Record<string, unknown>): string {
    const options = cfg.value.options
    if (!options) return String(option)
    const valueKey = options.valueKey
    return valueKey in option ? String(option[valueKey]) : String(option)
  }

  function optionLabel(option: Record<string, unknown>): string {
    const options = cfg.value.options
    if (!options) return String(option)
    const labelKey = options.labelKey
    return labelKey in option ? String(option[labelKey]) : String(option)
  }

  function onChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    value.value = target.value
    runAction(findAction(cfg.value.actions, 'change'), {
      ...(props.context ?? {}),
      payload: { value: value.value }
    })
  }

  return (
    <label class={`ui-field${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style} title={cfg.value.tooltip}>
      {cfg.value.label ? <span class="ui-field__label">{cfg.value.label}</span> : null}
      <select value={value.value} disabled={cfg.value.disabled} onChange={onChange}>
        <option value="">—</option>
        {rows.value.map((option) => (
          <option key={optionValue(option)} value={optionValue(option)}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
    </label>
  )
}
