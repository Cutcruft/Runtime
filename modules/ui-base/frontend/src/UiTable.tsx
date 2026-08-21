import { useSignal, computed } from '@preact/signals'
import { useRef, useEffect } from 'preact/hooks'
import { sessionStore, i18nStore, useCfg, useContainerQuery, useData, findAction, resolveParams, runAction, formatValue, isDisabledByModel, buildModelParams, animationApi, type BadgeTone, type BindingContext, type DataBinding, type TableColumnConfig, type TableConfig, type TableRowAction } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiTable(props: ComponentProps) {
  const t = i18nStore.t
  const root = useRef<HTMLDivElement | null>(null)
  const cq = useContainerQuery(root)
  const cfg = useCfg<TableConfig>(props.config, {
    // V7.3: auto-refresh via revision signals; the manual button is opt-in.
    showRefresh: false,
    showRowCount: true,
    searchable: false,
    sortable: false,
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] }
  })

  const data = computed<DataBinding | undefined>(() => {
    if (cfg.value.data) return cfg.value.data
    const command = props.config.command as string | undefined
    if (!command) return undefined
    return { command, entityType: props.config.entityType as string | undefined }
  })

  const { value, error, loading, reload } = useData(
    () => data.value,
    () => props.context ?? {}
  )

  const allRows = computed<Array<Record<string, unknown>>>(() =>
    Array.isArray(value.value) ? (value.value as Array<Record<string, unknown>>) : []
  )

  // V7.3: soft flash when data refreshes automatically.
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null)
  useEffect(() => {
    if (!tbodyRef.current) return
    if (!allRows.value.length) return
    const tbody = tbodyRef.current
    const cleanup = animationApi.apply(tbody, {
      keyframes: [{ backgroundColor: 'rgba(64, 128, 255, 0.08)' }, { backgroundColor: 'rgba(64, 128, 255, 0)' }],
      duration: 400,
      easing: 'ease-out',
      iterations: 1,
      fill: 'none'
    })
    return () => cleanup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.value])

  const configuredColumns = computed<TableColumnConfig[]>(() => {
    if (cfg.value.columns && cfg.value.columns.length > 0) return cfg.value.columns
    const legacy = props.config.columns as TableColumnConfig[] | undefined
    if (legacy && legacy.length > 0) return legacy
    const first = allRows.value[0]
    if (!first) return []
    return Object.keys(first).map((key) => ({ key }))
  })

  const searchText = useSignal('')
  const filteredRows = computed(() => {
    const q = searchText.value.trim().toLowerCase()
    if (!q) return allRows.value
    const cols = configuredColumns.value
    return allRows.value.filter((row) =>
      cols.some((col) => formatValue(row[col.key]).toLowerCase().includes(q))
    )
  })

  const sortKey = useSignal<string | null>(null)
  const sortDir = useSignal<'asc' | 'desc'>('asc')

  function columnSortable(col: TableColumnConfig): boolean {
    return col.sortable ?? cfg.value.sortable ?? false
  }

  function toggleSort(key: string): void {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDir.value = 'asc'
    }
  }

  const sortedRows = computed(() => {
    if (!sortKey.value) return filteredRows.value
    const key = sortKey.value
    return [...filteredRows.value].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      let cmp: number
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv
      } else {
        cmp = String(av ?? '').localeCompare(String(bv ?? ''))
      }
      return sortDir.value === 'asc' ? cmp : -cmp
    })
  })

  const pagination = cfg.value.pagination === false ? null : (cfg.value.pagination ?? {})
  const paginated = pagination !== null
  const pageSize = useSignal(pagination?.pageSize ?? 10)
  const pageSizeOptions = pagination?.pageSizeOptions ?? [10, 25, 50]
  const page = useSignal(1)

  const totalPages = computed(() => {
    if (!paginated) return 1
    return Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value))
  })

  const visibleRows = computed(() => {
    if (!paginated) return sortedRows.value
    const start = (page.value - 1) * pageSize.value
    return sortedRows.value.slice(start, start + pageSize.value)
  })

  const rowActionCount = (cfg.value.rowActions?.length ?? 0) + (cfg.value.deleteCommand || props.config.deleteCommand ? 1 : 0)

  const selectedKeys = useSignal<Set<string>>(new Set())

  function toggleSelect(row: Record<string, unknown>): void {
    const key = String(row.id ?? row[configuredColumns.value[0]?.key ?? ''])
    const next = new Set(selectedKeys.value)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    selectedKeys.value = next
    const selected = allRows.value.filter((r) => next.has(String(r.id ?? r[configuredColumns.value[0]?.key ?? ''])))
    runAction(findAction(cfg.value.actions, 'selectionChange'), { ...(props.context ?? {}), payload: { selected } })
  }

  function rowKey(row: Record<string, unknown>, index: number): string {
    return String(row.id ?? index)
  }

  function columnLabel(col: TableColumnConfig): string {
    return col.label ?? col.key
  }

  function badgeTone(col: TableColumnConfig, row: Record<string, unknown>): BadgeTone {
    if (col.badge?.toneField) return (row[col.badge.toneField] as BadgeTone) ?? 'neutral'
    const value = formatValue(row[col.key])
    return col.badge?.tones?.[value] ?? 'neutral'
  }

  function cellContent(col: TableColumnConfig, row: Record<string, unknown>): string {
    return formatValue(row[col.key])
  }

  function onRowClick(row: Record<string, unknown>): void {
    runAction(findAction(cfg.value.actions, 'rowSelect'), { ...(props.context ?? {}), row })
  }

  async function runRowAction(action: TableRowAction, row: Record<string, unknown>): Promise<void> {
    if (action.confirm && !window.confirm(action.confirm)) return
    const rowContext: BindingContext = { ...(props.context ?? {}), row }
    if (action.spec) {
      await runAction({ event: 'click', spec: action.spec, confirm: action.confirm }, rowContext)
      return
    }
    if (action.command) {
      try {
        // V6: model-bound actions resolve params from fields/entityType.
        const params = buildModelParams(action.command, action.params, action.entityType, action.fields, rowContext)
        await sessionStore.executeCommand(action.command, params)
        await reload()
      } catch { /* error toast already shown */ }
    }
  }

  function rowActionDisabled(action: TableRowAction, row: Record<string, unknown>): boolean {
    return isDisabledByModel(action.disabledWhen, { ...(props.context ?? {}), row })
  }

  async function deleteRow(row: Record<string, unknown>): Promise<void> {
    if (typeof row.id !== 'string') return
    const rowDelete = findAction(cfg.value.actions, 'rowDelete')
    if (rowDelete) {
      await runAction(rowDelete, { ...(props.context ?? {}), row })
      await reload()
      return
    }
    const deleteCommand = cfg.value.deleteCommand ?? (props.config.deleteCommand as string | undefined)
    if (!deleteCommand) return
    if (!window.confirm('Delete this row?')) return
    try {
      await sessionStore.executeCommand(deleteCommand, { id: row.id })
      await reload()
    } catch { /* error toast already shown */ }
  }

  const showDeleteColumn = Boolean(cfg.value.deleteCommand || props.config.deleteCommand || findAction(cfg.value.actions, 'rowDelete'))
  const columns = configuredColumns.value
  const colspan = columns.length + (cfg.value.selectable ? 1 : 0) + (rowActionCount > 0 ? 1 : 0)

  return (
    <div ref={root} class={`ui-table ui-table--cq-${cq.value}${cfg.value.className ? ' ' + cfg.value.className : ''}`} style={cfg.value.style} title={cfg.value.tooltip}>
      {cfg.value.searchable || cfg.value.showRefresh || cfg.value.showRowCount ? (
        <div class="ui-table__toolbar">
          {cfg.value.searchable ? (
            <input
              class="ui-table__search"
              type="search"
              placeholder={t('core.table.search')}
              value={searchText.value}
              onInput={(e) => { searchText.value = (e.target as HTMLInputElement).value; page.value = 1 }}
            />
          ) : null}
          {cfg.value.showRowCount ? (
            <span class="ui-table__count">{t('core.table.rows', { count: allRows.value.length })}</span>
          ) : null}
          {cfg.value.showRefresh ? (
            <button class="ui-button ui-button--small" disabled={loading.value} onClick={() => reload()}>
              {loading.value ? t('core.button.loading') : t('core.table.refresh')}
            </button>
          ) : null}
        </div>
      ) : null}

      {error.value ? <p class="ui-table__error">{error.value}</p> : (
        <table class="ui-table__grid">
          <thead>
            <tr>
              {cfg.value.selectable ? <th class="ui-table__checkbox-col"></th> : null}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width, textAlign: col.align }}
                  class={columnSortable(col) ? 'ui-table__sortable' : ''}
                  onClick={() => columnSortable(col) && toggleSort(col.key)}
                >
                  {columnLabel(col)}
                  {sortKey.value === col.key ? (
                    <span class="ui-table__sort-indicator">{sortDir.value === 'asc' ? '↑' : '↓'}</span>
                  ) : null}
                </th>
              ))}
              {rowActionCount > 0 ? <th class="ui-table__actions-col"></th> : null}
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {loading.value && visibleRows.value.length === 0 ? (
              <tr><td colspan={colspan} class="ui-table__state">{t('core.button.loading')}</td></tr>
            ) : null}
            {!loading.value && visibleRows.value.length === 0 ? (
              <tr><td colspan={colspan} class="ui-table__state">{cfg.value.emptyText ?? t('core.table.empty')}</td></tr>
            ) : null}
            {visibleRows.value.map((row, index) => (
              <tr
                key={rowKey(row, index)}
                class="ui-table__row"
                data-gesture-role="row"
                data-gesture-object-type={data.value?.entityType ?? undefined}
                data-gesture-row={JSON.stringify(row)}
                onClick={() => onRowClick(row)}
              >
                {cfg.value.selectable ? (
                  <td class="ui-table__checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedKeys.value.has(String(row.id))}
                      onClick={(e) => { e.stopPropagation(); toggleSelect(row) }}
                    />
                  </td>
                ) : null}
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align }}>
                    {col.render === 'badge' ? (
                      <span class="ui-table__badge-wrap">
                        <span class={`ui-badge ui-badge--${badgeTone(col, row)}`}>{cellContent(col, row)}</span>
                      </span>
                    ) : null}
                    {col.render === 'boolean' ? (
                      <span class={`ui-table__bool ${row[col.key] ? 'ui-table__bool--yes' : 'ui-table__bool--no'}`}>
                        {row[col.key] ? '✓' : '✕'}
                      </span>
                    ) : null}
                    {col.render !== 'badge' && col.render !== 'boolean' ? <span>{cellContent(col, row)}</span> : null}
                  </td>
                ))}
                {rowActionCount > 0 ? (
                  <td class="ui-table__actions-col" onClick={(e) => e.stopPropagation()}>
                    {(cfg.value.rowActions ?? []).map((action) => (
                      <button
                        key={action.label}
                        class={`ui-button ui-button--small${action.variant === 'danger' ? ' ui-button--danger' : ''}`}
                        disabled={rowActionDisabled(action, row)}
                        onClick={() => runRowAction(action, row)}
                      >
                        {action.label}
                      </button>
                    ))}
                    {showDeleteColumn ? (
                      <button class="ui-button ui-button--small ui-button--danger" onClick={() => deleteRow(row)}>
                        {t('core.table.delete')}
                      </button>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {paginated ? (
        <div class="ui-table__pagination">
          <button class="ui-button ui-button--small" disabled={page.value <= 1} onClick={() => { page.value -= 1 }}>‹</button>
          <span class="ui-table__page-info">{page.value} / {totalPages.value}</span>
          <button class="ui-button ui-button--small" disabled={page.value >= totalPages.value} onClick={() => { page.value += 1 }}>›</button>
          <select
            class="ui-table__page-size"
            value={pageSize.value}
            onChange={(e) => { pageSize.value = Number((e.target as HTMLSelectElement).value); page.value = 1 }}
          >
            {pageSizeOptions.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
      ) : null}
    </div>
  )
}
