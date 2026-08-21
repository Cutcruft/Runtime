import { useCfg, useData, formatNumber, type StatConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiStat(props: ComponentProps) {
  const cfg = useCfg<StatConfig>(props.config, { tone: 'default', precision: 0 })
  const { value } = useData(
    () => cfg.value.data,
    () => props.context ?? {}
  )

  let source: unknown = cfg.value.data ? value.value : cfg.value.value
  if (Array.isArray(source)) source = source.length
  else if (source && typeof source === 'object' && cfg.value.valueKey) {
    source = (source as Record<string, unknown>)[cfg.value.valueKey]
  }
  const displayValue = formatNumber(source, cfg.value.precision)

  return (
    <div class={`ui-stat ui-stat--${cfg.value.tone}${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style} title={cfg.value.tooltip}>
      <span class="ui-stat__label">{cfg.value.label}</span>
      <span class="ui-stat__value">
        {cfg.value.prefix ? <span class="ui-stat__affix">{cfg.value.prefix}</span> : null}
        {displayValue}
        {cfg.value.suffix ? <span class="ui-stat__affix">{cfg.value.suffix}</span> : null}
      </span>
      {cfg.value.trend ? (
        <span class={`ui-stat__trend ui-stat__trend--${cfg.value.trend}`}>
          {cfg.value.trend === 'up' ? '▲' : cfg.value.trend === 'down' ? '▼' : '—'}
        </span>
      ) : null}
    </div>
  )
}
