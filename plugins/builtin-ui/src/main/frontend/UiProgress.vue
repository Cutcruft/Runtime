<script setup lang="ts">
import { computed } from 'vue'
import { useCfg } from '@cutcrft/runtime-client'
import { useData } from '@cutcrft/runtime-client'
import type { BindingContext, ProgressConfig } from '@cutcrft/runtime-client'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<ProgressConfig>(props.config, { value: 0, tone: 'default', showLabel: false })

const { value } = useData(
  () => cfg.value.data,
  () => props.context ?? {}
)

const displayValue = computed(() => {
  let source: unknown = cfg.value.data ? value.value : cfg.value.value
  if (Array.isArray(source)) source = source.length
  else if (source && typeof source === 'object' && cfg.value.valueKey) {
    source = (source as Record<string, unknown>)[cfg.value.valueKey]
  }
  const numeric = typeof source === 'number' ? source : Number(source ?? 0)
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0
})

const label = computed(() => {
  if (cfg.value.label != null) return cfg.value.label
  return `${Math.round(displayValue.value)}%`
})
</script>

<template>
  <div class="ui-progress" :class="[`ui-progress--${cfg.tone}`, cfg.className]" :style="cfg.style" :title="cfg.tooltip">
    <div class="ui-progress__bar">
      <div class="ui-progress__fill" :style="{ width: `${displayValue}%` }" />
    </div>
    <span v-if="cfg.showLabel" class="ui-progress__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.ui-progress {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.ui-progress__bar {
  flex: 1;
  height: 0.5rem;
  background: var(--rt-color-bg);
  border: 1px solid var(--rt-color-border);
  border-radius: 999px;
  overflow: hidden;
}
.ui-progress__fill {
  height: 100%;
  background: var(--rt-color-primary);
  border-radius: 999px;
  transition: width 0.3s ease;
}
.ui-progress--green .ui-progress__fill { background: var(--rt-color-success); }
.ui-progress--red .ui-progress__fill { background: var(--rt-color-danger); }
.ui-progress--blue .ui-progress__fill { background: var(--rt-color-info); }
.ui-progress--amber .ui-progress__fill { background: var(--rt-color-warning); }
.ui-progress__label {
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
  min-width: 2.5rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
