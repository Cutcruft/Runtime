<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { sessionStore } from '../store/session'
import { useCfg } from '../renderer/useConfig'
import { findAction, runAction } from '../renderer/bindingEngine'
import type { BindingContext, SelectConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<SelectConfig>(props.config, {})

const value = ref<string>(cfg.value.defaultValue ?? '')
const rows = ref<Array<Record<string, unknown>>>([])
const loaded = ref(false)

async function loadOptions(): Promise<void> {
  const options = cfg.value.options
  if (!options || loaded.value) return
  try {
    const result = await sessionStore.execute(options.command, options.params ?? {})
    if (result.status === 'SUCCESS' && Array.isArray(result.value)) {
      rows.value = result.value as Array<Record<string, unknown>>
    }
  } catch {
    /* options are optional */
  }
  loaded.value = true
}

onMounted(loadOptions)

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

function onChange(): void {
  runAction(findAction(cfg.value.actions, 'change'), { ...(props.context ?? {}), payload: { value: value.value } })
}
</script>

<template>
  <label class="ui-field" :class="cfg.className" :style="cfg.style" :title="cfg.tooltip">
    <span v-if="cfg.label" class="ui-field__label">{{ cfg.label }}</span>
    <select v-model="value" :disabled="cfg.disabled" @change="onChange">
      <option value="">—</option>
      <option v-for="option in rows" :key="String(option)" :value="optionValue(option)">
        {{ optionLabel(option) }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.ui-field {
  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: var(--rt-font-size);
}
.ui-field__label {
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
}
.ui-field select {
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
  font: inherit;
}
</style>
