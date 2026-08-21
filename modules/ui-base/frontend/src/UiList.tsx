import { useSignal } from '@preact/signals'
import { useRef } from 'preact/hooks'
import { useCfg, useData, useContainerQuery, runAction, findAction, formatValue, i18nStore, Container, type BindingContext, type ListConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiList(props: ComponentProps) {
  const t = i18nStore.t
  const root = useRef<HTMLDivElement | null>(null)
  const cq = useContainerQuery(root)
  const cfg = useCfg<ListConfig>(props.config, { labelField: 'name', itemKey: 'id' })
  const { value, error, loading } = useData(
    () => cfg.value.data,
    () => props.context ?? {}
  )
  const rows = Array.isArray(value.value) ? (value.value as Array<Record<string, unknown>>) : []

  const dragIndex = useSignal<number | null>(null)
  const dropIndex = useSignal<number | null>(null)

  function label(row: Record<string, unknown>): string {
    return cfg.value.labelField ? formatValue(row[cfg.value.labelField]) : ''
  }

  function valueText(row: Record<string, unknown>): string {
    return cfg.value.valueField ? formatValue(row[cfg.value.valueField]) : ''
  }

  function itemKey(row: Record<string, unknown>, index: number): string {
    const key = cfg.value.itemKey
    return key ? String(row[key] ?? index) : String(index)
  }

  function onDragStart(index: number, event: DragEvent): void {
    if (!cfg.value.sortable) return
    dragIndex.value = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
    }
  }

  function onDragOver(index: number, event: DragEvent): void {
    if (!cfg.value.sortable || dragIndex.value === null) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    dropIndex.value = index
  }

  function onDrop(index: number): void {
    if (!cfg.value.sortable || dragIndex.value === null) return
    const from = dragIndex.value
    const to = index
    dragIndex.value = null
    dropIndex.value = null
    if (from === to) return
    const row = rows[from] ?? null
    const reordered = [...rows]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    const ids = reordered.map((r, i) => itemKey(r, i))
    runAction(findAction(cfg.value.actions, 'reorder'), {
      ...(props.context ?? {}),
      payload: { from, to, row, ids }
    })
  }

  function dragClasses(index: number, base: string): string {
    let cls = base
    if (cfg.value.sortable && dragIndex.value === index) cls += ' ui-list__drag--dragging'
    if (cfg.value.sortable && dropIndex.value === index && dragIndex.value !== null && dragIndex.value !== index) {
      cls += ' ui-list__drag--over'
    }
    return cls
  }

  return (
    <div ref={root} class={`ui-list ui-list--cq-${cq.value}${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style} title={cfg.value.tooltip}>
      {loading.value && rows.length === 0 ? <p class="ui-list__state">{t('core.button.loading')}</p> : null}
      {!loading.value && error.value ? <p class="ui-list__error">{error.value}</p> : null}
      {!loading.value && !error.value ? (
        <>
          {cfg.value.itemTemplate ? (
            <ul class="ui-list__templated">
              {rows.map((row, index) => (
                <li
                  key={itemKey(row, index)}
                  draggable={cfg.value.sortable}
                  class={dragClasses(index, 'ui-list__drag')}
                  onDragStart={(e) => onDragStart(index, e)}
                  onDragOver={(e) => onDragOver(index, e)}
                  onDrop={() => onDrop(index)}
                  onDragEnd={() => { dragIndex.value = null; dropIndex.value = null }}
                >
                  <Container component={cfg.value.itemTemplate!} context={{ ...(props.context ?? {}), row }} />
                </li>
              ))}
            </ul>
          ) : (
            <ul class="ui-list__plain">
              {rows.map((row, index) => (
                <li
                  key={itemKey(row, index)}
                  draggable={cfg.value.sortable}
                  class={dragClasses(index, 'ui-list__row')}
                  onDragStart={(e) => onDragStart(index, e)}
                  onDragOver={(e) => onDragOver(index, e)}
                  onDrop={() => onDrop(index)}
                  onDragEnd={() => { dragIndex.value = null; dropIndex.value = null }}
                >
                  <span class="ui-list__label">{label(row)}</span>
                  {cfg.value.valueField ? <span class="ui-list__value">{valueText(row)}</span> : null}
                </li>
              ))}
            </ul>
          )}
          {!loading.value && rows.length === 0 ? (
            <p class="ui-list__state">{cfg.value.emptyText ?? t('core.table.empty')}</p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
