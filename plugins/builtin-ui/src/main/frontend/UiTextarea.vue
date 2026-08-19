<script setup lang="ts">
import { ref } from 'vue'
import { useCfg } from '@cutcrft/runtime-client'
import { findAction, runAction } from '@cutcrft/runtime-client'
import type { BindingContext, TextareaConfig } from '@cutcrft/runtime-client'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<TextareaConfig>(props.config, { rows: 3 })

const value = ref<string>(cfg.value.defaultValue ?? '')

function onChange(event: Event): void {
  value.value = (event.target as HTMLTextAreaElement).value
  runAction(findAction(cfg.value.actions, 'change'), { ...(props.context ?? {}), payload: { value: value.value } })
}
</script>

<template>
  <label class="ui-field" :class="cfg.className" :style="cfg.style" :title="cfg.tooltip">
    <span v-if="cfg.label" class="ui-field__label">{{ cfg.label }}</span>
    <textarea
      :value="value"
      :rows="cfg.rows"
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
.ui-field textarea {
  padding: 0.4rem 0.5rem;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
  font: inherit;
  resize: vertical;
}
.ui-field textarea:focus {
  outline: 2px solid var(--rt-color-primary);
  outline-offset: -1px;
}
</style>
