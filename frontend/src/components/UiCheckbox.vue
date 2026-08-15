<script setup lang="ts">
import { ref } from 'vue'
import { useCfg } from '../renderer/useConfig'
import { findAction, runAction } from '../renderer/bindingEngine'
import type { BindingContext, CheckboxConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<CheckboxConfig>(props.config, {})

const checked = ref<boolean>(cfg.value.defaultValue ?? false)

function onChange(event: Event): void {
  checked.value = (event.target as HTMLInputElement).checked
  runAction(findAction(cfg.value.actions, 'change'), {
    ...(props.context ?? {}),
    payload: { value: checked.value }
  })
}
</script>

<template>
  <label class="ui-checkbox" :class="cfg.className" :style="cfg.style" :title="cfg.tooltip">
    <input type="checkbox" :checked="checked" :disabled="cfg.disabled" @change="onChange" />
    <span>{{ cfg.label }}</span>
  </label>
</template>

<style scoped>
.ui-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-size: var(--rt-font-size);
}
</style>
