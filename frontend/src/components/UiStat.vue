<script setup lang="ts">
import { computed } from 'vue'
import { useCfg } from '../renderer/useConfig'
import { useData } from '../renderer/useData'
import { formatNumber } from '../renderer/format'
import type { StatConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: Record<string, unknown> }>()

const cfg = useCfg<StatConfig>(props.config, { tone: 'default', precision: 0 })

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
  return formatNumber(source, cfg.value.precision)
})
</script>

<template>
  <div class="ui-stat" :class="[`ui-stat--${cfg.tone}`, cfg.className]" :style="cfg.style" :title="cfg.tooltip">
    <span class="ui-stat__label">{{ cfg.label }}</span>
    <span class="ui-stat__value">
      <span v-if="cfg.prefix" class="ui-stat__affix">{{ cfg.prefix }}</span>{{ displayValue }}<span v-if="cfg.suffix" class="ui-stat__affix">{{ cfg.suffix }}</span>
    </span>
    <span v-if="cfg.trend" class="ui-stat__trend" :class="`ui-stat__trend--${cfg.trend}`">
      {{ cfg.trend === 'up' ? '▲' : cfg.trend === 'down' ? '▼' : '—' }}
    </span>
  </div>
</template>

<style scoped>
.ui-stat {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--rt-space);
  background: var(--rt-color-surface);
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius);
}
.ui-stat__label {
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
}
.ui-stat__value {
  font-size: var(--rt-font-size-xl);
  font-weight: 700;
}
.ui-stat__affix {
  font-weight: 400;
  font-size: var(--rt-font-size);
  color: var(--rt-color-muted);
  margin: 0 0.1rem;
}
.ui-stat__trend {
  position: absolute;
  top: var(--rt-space-sm);
  right: var(--rt-space);
  font-size: var(--rt-font-size);
}
.ui-stat__trend--up { color: var(--rt-color-success); }
.ui-stat__trend--down { color: var(--rt-color-danger); }
.ui-stat__trend--flat { color: var(--rt-color-muted); }
.ui-stat--green { border-top: 3px solid var(--rt-color-success); }
.ui-stat--red { border-top: 3px solid var(--rt-color-danger); }
.ui-stat--blue { border-top: 3px solid var(--rt-color-info); }
.ui-stat--amber { border-top: 3px solid var(--rt-color-warning); }
</style>
