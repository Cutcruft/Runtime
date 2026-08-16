<script setup lang="ts">
import { ref, watch } from 'vue'
import ComponentHost from './ComponentHost.vue'
import { useCfg } from '../renderer/useConfig'
import { runAction, findAction } from '../renderer/bindingEngine'
import type { BindingContext, AccordionConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<AccordionConfig>(props.config, { items: [] })

const openIds = ref<Set<string>>(
  new Set(
    cfg.value.items
      ?.filter((item) => item.open)
      .map((item) => item.id) ?? []
  )
)

watch(
  () => cfg.value.items?.map((item) => item.id).join(','),
  () => {
    const next = new Set<string>()
    for (const item of cfg.value.items ?? []) if (item.open) next.add(item.id)
    openIds.value = next
  }
)

function toggle(id: string): void {
  const next = new Set(openIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openIds.value = next
  runAction(findAction(cfg.value.actions, 'change'), { ...(props.context ?? {}), payload: { id } })
}
</script>

<template>
  <div class="ui-accordion" :class="cfg.className" :style="cfg.style">
    <div v-for="item in cfg.items" :key="item.id" class="ui-accordion__item">
      <button
        class="ui-accordion__header"
        :class="{ 'ui-accordion__header--open': openIds.has(item.id), 'ui-accordion__header--disabled': item.disabled }"
        :disabled="item.disabled"
        :aria-expanded="openIds.has(item.id)"
        @click="toggle(item.id)"
      >
        <span class="ui-accordion__caret">▸</span>
        <span class="ui-accordion__label">{{ item.label }}</span>
      </button>
      <div v-show="openIds.has(item.id)" class="ui-accordion__body">
        <ComponentHost
          v-for="(child, index) in item.components ?? []"
          :key="index"
          :component="child"
          :context="context"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-accordion__item {
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-surface);
  overflow: hidden;
}
.ui-accordion__item + .ui-accordion__item {
  margin-top: var(--rt-space-xs);
}
.ui-accordion__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: none;
  background: transparent;
  font: inherit;
  font-weight: 600;
  color: var(--rt-color-text);
  cursor: pointer;
  text-align: left;
}
.ui-accordion__header:hover:not(:disabled) {
  background: var(--rt-color-bg);
}
.ui-accordion__header--disabled {
  opacity: 0.5;
  cursor: default;
}
.ui-accordion__caret {
  display: inline-block;
  transition: transform 0.15s ease;
  color: var(--rt-color-muted);
  font-size: 0.75rem;
}
.ui-accordion__header--open .ui-accordion__caret {
  transform: rotate(90deg);
}
.ui-accordion__body {
  padding: var(--rt-space-sm) var(--rt-space);
  border-top: 1px solid var(--rt-color-border);
  display: flex;
  flex-direction: column;
  gap: var(--rt-space);
}
</style>
