<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentHost from './ComponentHost.vue'
import { i18nStore } from '@cutcrft/runtime-client'
import { useCfg } from '@cutcrft/runtime-client'
import { useContainerQuery } from '@cutcrft/runtime-client'
import { useData } from '@cutcrft/runtime-client'
import { runAction, findAction } from '@cutcrft/runtime-client'
import { formatValue } from '@cutcrft/runtime-client'
import type { BindingContext, ListConfig } from '@cutcrft/runtime-client'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const t = i18nStore.t
const root = ref<HTMLElement | null>(null)
const cq = useContainerQuery(root)

const cfg = useCfg<ListConfig>(props.config, { labelField: 'name', itemKey: 'id' })

const { value, error, loading } = useData(
  () => cfg.value.data,
  () => props.context ?? {}
)

const rows = computed<Array<Record<string, unknown>>>(() =>
  Array.isArray(value.value) ? (value.value as Array<Record<string, unknown>>) : []
)

const dragIndex = ref<number | null>(null)
const dropIndex = ref<number | null>(null)

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
  const row = rows.value[from] ?? null
  const reordered = [...rows.value]
  const [moved] = reordered.splice(from, 1)
  reordered.splice(to, 0, moved)
  const ids = reordered.map((r, i) => itemKey(r, i))
  runAction(findAction(cfg.value.actions, 'reorder'), {
    ...(props.context ?? {}),
    payload: { from, to, row, ids }
  })
}

function onDragEnd(): void {
  dragIndex.value = null
  dropIndex.value = null
}
</script>

<template>
  <div ref="root" class="ui-list" :class="[cfg.className, `ui-list--cq-${cq}`]" :style="cfg.style" :title="cfg.tooltip">
    <p v-if="loading && rows.length === 0" class="ui-list__state">{{ t('core.button.loading') }}</p>
    <p v-else-if="error" class="ui-list__error">{{ error }}</p>
    <template v-else>
      <ul v-if="cfg.itemTemplate" class="ui-list__templated">
        <li
          v-for="(row, index) in rows"
          :key="itemKey(row, index)"
          :draggable="cfg.sortable"
          class="ui-list__drag"
          :class="{
            'ui-list__drag--dragging': cfg.sortable && dragIndex === index,
            'ui-list__drag--over': cfg.sortable && dropIndex === index && dragIndex !== null && dragIndex !== index
          }"
          @dragstart="onDragStart(index, $event)"
          @dragover="onDragOver(index, $event)"
          @drop="onDrop(index)"
          @dragend="onDragEnd"
        >
          <ComponentHost :component="cfg.itemTemplate" :context="{ ...(props.context ?? {}), row }" />
        </li>
      </ul>
      <ul v-else class="ui-list__plain">
        <li
          v-for="(row, index) in rows"
          :key="itemKey(row, index)"
          :draggable="cfg.sortable"
          class="ui-list__row"
          :class="{
            'ui-list__row--dragging': cfg.sortable && dragIndex === index,
            'ui-list__row--over': cfg.sortable && dropIndex === index && dragIndex !== null && dragIndex !== index
          }"
          @dragstart="onDragStart(index, $event)"
          @dragover="onDragOver(index, $event)"
          @drop="onDrop(index)"
          @dragend="onDragEnd"
        >
          <span class="ui-list__label">{{ label(row) }}</span>
          <span v-if="cfg.valueField" class="ui-list__value">{{ valueText(row) }}</span>
        </li>
      </ul>
      <p v-if="!loading && rows.length === 0" class="ui-list__state">
        {{ cfg.emptyText ?? t('core.table.empty') }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.ui-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ui-list__plain {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.ui-list__row {
  display: flex;
  justify-content: space-between;
  gap: var(--rt-space-sm);
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--rt-color-border);
}
.ui-list__row:last-child {
  border-bottom: none;
}
.ui-list__label {
  color: var(--rt-color-text);
}
.ui-list__value {
  color: var(--rt-color-muted);
  font-variant-numeric: tabular-nums;
}
.ui-list__templated {
  display: flex;
  flex-direction: column;
  gap: var(--rt-space-sm);
}
.ui-list__drag--dragging {
  opacity: 0.5;
}
.ui-list__drag--over {
  outline: 2px dashed var(--rt-color-primary);
  outline-offset: 2px;
  border-radius: var(--rt-radius-sm);
}
.ui-list__row--dragging {
  opacity: 0.5;
}
.ui-list__row--over {
  outline: 2px dashed var(--rt-color-primary);
  outline-offset: 2px;
  border-radius: var(--rt-radius-sm);
}
.ui-list__state {
  margin: 0;
  padding: var(--rt-space-sm) 0;
  color: var(--rt-color-muted);
  font-size: var(--rt-font-size-sm);
}
.ui-list__error {
  margin: 0;
  padding: var(--rt-space-sm);
  color: var(--rt-color-danger);
  background: var(--rt-color-bg);
  border-radius: var(--rt-radius-sm);
  font-size: var(--rt-font-size-sm);
}
.ui-list--cq-sm .ui-list__row {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}
.ui-list--cq-sm .ui-list__value {
  font-size: var(--rt-font-size-sm);
}
</style>
