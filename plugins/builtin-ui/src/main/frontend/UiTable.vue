<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { sessionStore } from '@cutcrft/runtime-client'
import { i18nStore } from '@cutcrft/runtime-client'
import { useCfg } from '@cutcrft/runtime-client'
import { useContainerQuery } from '@cutcrft/runtime-client'
import { useData } from '@cutcrft/runtime-client'
import { findAction, resolveParams, runAction } from '@cutcrft/runtime-client'
import { formatValue } from '@cutcrft/runtime-client'
import type {
  BadgeTone,
  BindingContext,
  DataBinding,
  TableColumnConfig,
  TableConfig,
  TableRowAction
} from '@cutcrft/runtime-client'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const t = i18nStore.t
const root = ref<HTMLElement | null>(null)
const cq = useContainerQuery(root)

const cfg = useCfg<TableConfig>(props.config, {
  showRefresh: true,
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

const configuredColumns = computed<TableColumnConfig[]>(() => {
  if (cfg.value.columns && cfg.value.columns.length > 0) return cfg.value.columns
  const legacy = props.config.columns as TableColumnConfig[] | undefined
  if (legacy && legacy.length > 0) return legacy
  const first = allRows.value[0]
  if (!first) return []
  return Object.keys(first).map((key) => ({ key }))
})

const columns = computed(() => {
  const cols = configuredColumns.value
  if (cols.length > 0 || allRows.value.length === 0) return cols
  return []
})

const searchText = ref('')
const filteredRows = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return allRows.value
  const cols = configuredColumns.value
  return allRows.value.filter((row) =>
    cols.some((col) => formatValue(row[col.key]).toLowerCase().includes(q))
  )
})

const sortKey = ref<string | null>(null)
const sortDir = ref<'asc' | 'desc'>('asc')

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

const pagination = computed(() =>
  cfg.value.pagination === false ? null : (cfg.value.pagination ?? {})
)
const paginated = computed(() => pagination.value !== null)
const pageSize = ref(pagination.value?.pageSize ?? 10)
const pageSizeOptions = computed(() => pagination.value?.pageSizeOptions ?? [10, 25, 50])
const page = ref(1)

const totalPages = computed(() => {
  if (!paginated.value) return 1
  return Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value))
})

const visibleRows = computed(() => {
  if (!paginated.value) return sortedRows.value
  const start = (page.value - 1) * pageSize.value
  return sortedRows.value.slice(start, start + pageSize.value)
})

watch(totalPages, () => {
  if (page.value > totalPages.value) page.value = Math.max(1, totalPages.value)
})

const rowActionCount = computed(() => {
  const count = cfg.value.rowActions?.length ?? 0
  return count + (cfg.value.deleteCommand || props.config.deleteCommand ? 1 : 0)
})

const selectedKeys = ref<Set<string>>(new Set())

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
      await sessionStore.executeCommand(action.command, {
        id: row.id,
        ...resolveParams(action.params, rowContext)
      })
      await reload()
    } catch {
      /* error toast already shown */
    }
  }
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
  if (!window.confirm(`Delete this row?`)) return
  try {
    await sessionStore.executeCommand(deleteCommand, { id: row.id })
    await reload()
  } catch {
    /* error toast already shown */
  }
}

const legacyDelete = computed(() => Boolean(cfg.value.deleteCommand || props.config.deleteCommand))
const showDeleteColumn = computed(() => legacyDelete.value || Boolean(findAction(cfg.value.actions, 'rowDelete')))
</script>

<template>
  <div ref="root" class="ui-table" :class="[cfg.className, `ui-table--cq-${cq}`]" :style="cfg.style" :title="cfg.tooltip">
    <div v-if="cfg.searchable || cfg.showRefresh || cfg.showRowCount" class="ui-table__toolbar">
      <input
        v-if="cfg.searchable"
        v-model="searchText"
        class="ui-table__search"
        type="search"
        :placeholder="t('core.table.search')"
      />
      <span v-if="cfg.showRowCount" class="ui-table__count">
        {{ t('core.table.rows', { count: allRows.length }) }}
      </span>
      <button v-if="cfg.showRefresh" class="ui-button ui-button--small" :disabled="loading" @click="reload">
        {{ loading ? t('core.button.loading') : t('core.table.refresh') }}
      </button>
    </div>

    <p v-if="error" class="ui-table__error">{{ error }}</p>
    <table v-else class="ui-table__grid">
      <thead>
        <tr>
          <th v-if="cfg.selectable" class="ui-table__checkbox-col"></th>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ width: col.width, textAlign: col.align }"
            :class="{ 'ui-table__sortable': columnSortable(col) }"
            @click="columnSortable(col) && toggleSort(col.key)"
          >
            {{ columnLabel(col) }}
            <span v-if="sortKey === col.key" class="ui-table__sort-indicator">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th v-if="rowActionCount > 0" class="ui-table__actions-col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading && visibleRows.length === 0">
          <td :colspan="columns.length + (cfg.selectable ? 1 : 0) + (rowActionCount > 0 ? 1 : 0)" class="ui-table__state">
            {{ t('core.button.loading') }}
          </td>
        </tr>
        <tr v-else-if="visibleRows.length === 0">
          <td :colspan="columns.length + (cfg.selectable ? 1 : 0) + (rowActionCount > 0 ? 1 : 0)" class="ui-table__state">
            {{ cfg.emptyText ?? t('core.table.empty') }}
          </td>
        </tr>
        <tr
          v-for="(row, index) in visibleRows"
          :key="rowKey(row, index)"
          class="ui-table__row"
          data-gesture-role="row"
          :data-gesture-object-type="data?.entityType ?? undefined"
          :data-gesture-row="JSON.stringify(row)"
          @click="onRowClick(row)"
        >
          <td v-if="cfg.selectable" class="ui-table__checkbox-col">
            <input type="checkbox" :checked="selectedKeys.has(String(row.id))" @click.stop="toggleSelect(row)" />
          </td>
          <td
            v-for="col in columns"
            :key="col.key"
            :style="{ textAlign: col.align }"
          >
            <span v-if="col.render === 'badge'" class="ui-table__badge-wrap">
              <span class="ui-badge" :class="`ui-badge--${badgeTone(col, row)}`">{{ cellContent(col, row) }}</span>
            </span>
            <span v-else-if="col.render === 'boolean'" :class="row[col.key] ? 'ui-table__bool ui-table__bool--yes' : 'ui-table__bool ui-table__bool--no'">
              {{ row[col.key] ? '✓' : '✕' }}
            </span>
            <span v-else>{{ cellContent(col, row) }}</span>
          </td>
          <td v-if="rowActionCount > 0" class="ui-table__actions-col" @click.stop>
            <button
              v-for="action in cfg.rowActions ?? []"
              :key="action.label"
              class="ui-button ui-button--small"
              :class="{ 'ui-button--danger': action.variant === 'danger' }"
              @click="runRowAction(action, row)"
            >
              {{ action.label }}
            </button>
            <button
              v-if="showDeleteColumn"
              class="ui-button ui-button--small ui-button--danger"
              @click="deleteRow(row)"
            >
              {{ t('core.table.delete') }}
            </button>          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="paginated" class="ui-table__pagination">
      <button class="ui-button ui-button--small" :disabled="page <= 1" @click="page -= 1">‹</button>
      <span class="ui-table__page-info">{{ page }} / {{ totalPages }}</span>
      <button class="ui-button ui-button--small" :disabled="page >= totalPages" @click="page += 1">›</button>
      <select v-model.number="pageSize" class="ui-table__page-size">
        <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.ui-table {
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius);
  overflow: hidden;
  background: var(--rt-color-surface);
}
.ui-table__toolbar {
  display: flex;
  align-items: center;
  gap: var(--rt-space-sm);
  padding: var(--rt-space-sm) var(--rt-space);
  border-bottom: 1px solid var(--rt-color-border);
}
.ui-table__search {
  flex: 1;
  max-width: 16rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
  font: inherit;
  font-size: var(--rt-font-size);
}
.ui-table__count {
  margin-left: auto;
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
}
.ui-table__error {
  margin: 0;
  padding: var(--rt-space);
  color: var(--rt-color-danger);
  background: var(--rt-color-bg);
  font-size: var(--rt-font-size);
}
.ui-table__grid {
  width: 100%;
  border-collapse: collapse;
}
.ui-table__grid th,
.ui-table__grid td {
  text-align: left;
  padding: 0.5rem var(--rt-space);
  border-bottom: 1px solid var(--rt-color-border);
  font-size: var(--rt-font-size);
}
.ui-table__grid th {
  background: var(--rt-color-bg);
  font-weight: 600;
  white-space: nowrap;
}
.ui-table__sortable {
  cursor: pointer;
  user-select: none;
}
.ui-table__sortable:hover {
  color: var(--rt-color-primary);
}
.ui-table__sort-indicator {
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-primary);
}
.ui-table__row:hover {
  background: var(--rt-color-bg);
}
.ui-table__checkbox-col {
  width: 1%;
  text-align: center !important;
}
.ui-table__actions-col {
  width: 1%;
  text-align: right !important;
  white-space: nowrap;
}
.ui-table__actions-col .ui-button {
  margin-left: 0.25rem;
}
.ui-table__state {
  padding: var(--rt-space) !important;
  text-align: center;
  color: var(--rt-color-muted);
}
.ui-table__badge-wrap {
  display: inline-flex;
}
.ui-table__bool {
  font-weight: 700;
}
.ui-table__bool--yes {
  color: var(--rt-color-success);
}
.ui-table__bool--no {
  color: var(--rt-color-danger);
}
.ui-table__pagination {
  display: flex;
  align-items: center;
  gap: var(--rt-space-sm);
  padding: var(--rt-space-sm) var(--rt-space);
  border-top: 1px solid var(--rt-color-border);
}
.ui-table__page-info {
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
  min-width: 3.5rem;
  text-align: center;
}
.ui-table__page-size {
  margin-left: auto;
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
  font: inherit;
  font-size: var(--rt-font-size-sm);
}
.ui-table--cq-md .ui-table__grid th,
.ui-table--cq-md .ui-table__grid td {
  padding: 0.4rem var(--rt-space-sm);
}
.ui-table--cq-sm .ui-table__toolbar,
.ui-table--cq-sm .ui-table__pagination {
  flex-wrap: wrap;
}
.ui-table--cq-sm .ui-table__grid th,
.ui-table--cq-sm .ui-table__grid td {
  padding: 0.35rem var(--rt-space-sm);
  font-size: var(--rt-font-size-sm);
}
.ui-table--cq-sm .ui-table__search {
  max-width: none;
  flex-basis: 100%;
}
</style>
