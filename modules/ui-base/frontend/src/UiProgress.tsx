import { useCfg, useData, formatNumber, type ProgressConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiProgress(props: ComponentProps) {
  const cfg = useCfg<ProgressConfig>(props.config, { value: 0, tone: 'default', showLabel: false })
  const { value } = useData(
    () => cfg.value.data,
    () => props.context ?? {}
  )

  let raw = cfg.value.value
  if (cfg.value.data) {
    const v = cfg.value.valueKey && value.value && typeof value.value === 'object'
      ? (value.value as Record<string, unknown>)[cfg.value.valueKey]
      : value.value
    if (typeof v === 'number') raw = v
  }
  const percent = Math.max(0, Math.min(100, Number(raw) || 0))
  const label = cfg.value.label ?? formatNumber(percent, 0) + '%'

  return (
    <div class={`ui-progress ui-progress--${cfg.value.tone}${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style} title={cfg.value.tooltip}>
      <div class="ui-progress__track">
        <div class="ui-progress__bar" style={{ width: `${percent}%` }} />
      </div>
      {cfg.value.showLabel ? <span class="ui-progress__label">{label}</span> : null}
    </div>
  )
}
