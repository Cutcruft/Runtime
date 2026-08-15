<script setup lang="ts">
import { useCfg } from '../renderer/useConfig'
import { runAction, findAction, resolveParams } from '../renderer/bindingEngine'
import { sessionStore } from '../store/session'
import ComponentHost from './ComponentHost.vue'
import type { BindingContext, CardConfig } from '../protocol/componentSpec'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<CardConfig>(props.config, {
  bordered: true,
  padding: 'var(--rt-space-lg)'
})

async function headerActionClick(
  command: string | undefined,
  params: Record<string, unknown> | undefined
): Promise<void> {
  if (command) {
    runAction(findAction(cfg.value.actions, 'headerAction'), {
      ...(props.context ?? {}),
      payload: { command, params: resolveParams(params, props.context ?? {}) }
    })
    await sessionStore.executeCommand(command, resolveParams(params, props.context ?? {}))
  }
}
</script>

<template>
  <section
    class="ui-card"
    :class="[cfg.className, { 'ui-card--bordered': cfg.bordered }]"
    :style="cfg.style"
  >
    <header v-if="cfg.title || cfg.subtitle || cfg.headerActions?.length" class="ui-card__header">
      <div class="ui-card__heading">
        <h3 v-if="cfg.title" class="ui-card__title">{{ cfg.title }}</h3>
        <p v-if="cfg.subtitle" class="ui-card__subtitle">{{ cfg.subtitle }}</p>
      </div>
      <div v-if="cfg.headerActions" class="ui-card__actions">
        <button
          v-for="(action, index) in cfg.headerActions"
          :key="index"
          class="ui-button"
          :class="[`ui-button--${action.variant ?? 'default'}`, 'ui-button--small']"
          @click="headerActionClick(action.command ?? '', action.params)"
        >
          {{ action.label }}
        </button>
      </div>
    </header>
    <div class="ui-card__body" :style="{ padding: cfg.padding }">
      <ComponentHost
        v-for="(child, index) in cfg.components ?? []"
        :key="index"
        :component="child"
        :context="context"
      />
    </div>
  </section>
</template>

<style scoped>
.ui-card {
  background: var(--rt-color-surface);
  border-radius: var(--rt-radius);
  overflow: hidden;
}
.ui-card--bordered {
  border: 1px solid var(--rt-color-border);
}
.ui-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--rt-space-sm);
  padding: var(--rt-space) var(--rt-space-lg);
  border-bottom: 1px solid var(--rt-color-border);
}
.ui-card__title {
  margin: 0;
  font-size: var(--rt-font-size-lg);
}
.ui-card__subtitle {
  margin: 0.1rem 0 0;
  font-size: var(--rt-font-size-sm);
  color: var(--rt-color-muted);
}
.ui-card__actions {
  display: flex;
  gap: var(--rt-space-xs);
}
.ui-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--rt-space);
}
</style>
