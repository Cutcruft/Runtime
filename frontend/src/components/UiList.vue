<script setup lang="ts">
import { computed } from 'vue'
import ComponentHost from './ComponentHost.vue'
import { useCfg } from '../renderer/useConfig'
import { useData } from '../renderer/useData'
import { formatValue } from '../renderer/format'
import type { BindingContext, ListConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<ListConfig>(props.config, { labelField: 'name', itemKey: 'id' })

const { value, error, loading } = useData(
  () => cfg.value.data,
  () => props.context ?? {}
)

const rows = computed<Array<Record<string, unknown>>>(() =>
  Array.isArray(value.value) ? (value.value as Array<Record<string, unknown>>) : []
)

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
</script>

<template>
  <div class="ui-list" :class="cfg.className" :style="cfg.style" :title="cfg.tooltip">
    <p v-if="loading && rows.length === 0" class="ui-list__state">{{ loading ? 'Loading…' : '' }}</p>
    <p v-else-if="error" class="ui-list__error">{{ error }}</p>
    <template v-else>
      <ul v-if="cfg.itemTemplate" class="ui-list__templated">
        <li v-for="(row, index) in rows" :key="itemKey(row, index)">
          <ComponentHost :component="cfg.itemTemplate" :context="{ ...(props.context ?? {}), row }" />
        </li>
      </ul>
      <ul v-else class="ui-list__plain">
        <li v-for="(row, index) in rows" :key="itemKey(row, index)" class="ui-list__row">
          <span class="ui-list__label">{{ label(row) }}</span>
          <span v-if="cfg.valueField" class="ui-list__value">{{ valueText(row) }}</span>
        </li>
      </ul>
      <p v-if="!loading && rows.length === 0" class="ui-list__state">
        {{ cfg.emptyText ?? 'No data' }}
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
</style>
