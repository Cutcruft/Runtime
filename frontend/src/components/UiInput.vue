<script setup lang="ts">
import { ref } from 'vue'
import { useCfg } from '../renderer/useConfig'
import { findAction, runAction } from '../renderer/bindingEngine'
import type { BindingContext, InputConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<InputConfig>(props.config, { type: 'text' })

const value = ref<string | number>(cfg.value.defaultValue ?? '')

function onChange(event: Event): void {
  value.value = (event.target as HTMLInputElement).value
  runAction(findAction(cfg.value.actions, 'change'), { ...(props.context ?? {}), payload: { value: value.value } })
}
</script>

<template>
  <label class="ui-field" :class="cfg.className" :style="cfg.style" :title="cfg.tooltip">
    <span v-if="cfg.label" class="ui-field__label">{{ cfg.label }}</span>
    <input
      :type="cfg.type"
      :value="value"
      :placeholder="cfg.placeholder"
      :disabled="cfg.disabled"
      @input="onChange"
    />
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
.ui-field input {
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
  font: inherit;
}
.ui-field input:focus {
  outline: 2px solid var(--rt-color-primary);
  outline-offset: -1px;
}
</style>
