<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ComponentHost from './ComponentHost.vue'
import { useCfg } from '../renderer/useConfig'
import { runAction, findAction } from '../renderer/bindingEngine'
import type { BindingContext, TabsConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<TabsConfig>(props.config, { tabs: [] })

const activeTab = ref<string>(cfg.value.activeTab ?? cfg.value.tabs?.[0]?.id ?? '')

watch(
  () => cfg.value.activeTab,
  (value) => {
    if (value) activeTab.value = value
  }
)

const currentTab = computed(() => cfg.value.tabs?.find((tab) => tab.id === activeTab.value))

function selectTab(id: string): void {
  if (currentTab.value?.disabled) return
  activeTab.value = id
  runAction(findAction(cfg.value.actions, 'tabsChange'), { ...(props.context ?? {}), payload: { tab: id } })
}
</script>

<template>
  <div class="ui-tabs" :class="cfg.className" :style="cfg.style">
    <div class="ui-tabs__bar" role="tablist">
      <button
        v-for="tab in cfg.tabs"
        :key="tab.id"
        class="ui-tabs__tab"
        :class="{ 'ui-tabs__tab--active': tab.id === activeTab, 'ui-tabs__tab--disabled': tab.disabled }"
        role="tab"
        :aria-selected="tab.id === activeTab"
        :disabled="tab.disabled"
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="ui-tabs__content">
      <ComponentHost
        v-for="(child, index) in currentTab?.components ?? []"
        :key="index"
        :component="child"
        :context="context"
      />
    </div>
  </div>
</template>

<style scoped>
.ui-tabs__bar {
  display: flex;
  gap: var(--rt-space-xs);
  border-bottom: 1px solid var(--rt-color-border);
  margin-bottom: var(--rt-space);
}
.ui-tabs__tab {
  padding: 0.4rem 0.9rem;
  border: none;
  background: transparent;
  color: var(--rt-color-muted);
  cursor: pointer;
  font: inherit;
  font-size: var(--rt-font-size);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.ui-tabs__tab:hover:not(:disabled) {
  color: var(--rt-color-text);
}
.ui-tabs__tab--active {
  color: var(--rt-color-primary);
  border-bottom-color: var(--rt-color-primary);
  font-weight: 600;
}
.ui-tabs__tab--disabled {
  opacity: 0.5;
  cursor: default;
}
.ui-tabs__content {
  display: flex;
  flex-direction: column;
  gap: var(--rt-space);
}
</style>
