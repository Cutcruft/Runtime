<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { sessionStore } from '../store/session'
import { mountShortcut } from '../events/ShortcutService'
import { findAction, resolveParams, runAction } from '../renderer/bindingEngine'
import { useCfg } from '../renderer/useConfig'
import type { BindingContext, ButtonConfig } from '../protocol/componentSpec'
import type { ShortcutEntry } from '../protocol/types'

const props = defineProps<{ config: Record<string, unknown>; context?: BindingContext }>()

const cfg = useCfg<ButtonConfig>(props.config, {
  label: 'Execute',
  variant: 'default',
  size: 'medium'
})

const busy = ref(false)

const context = computed<BindingContext>(() => ({ ...(props.context ?? {}), page: props.context?.page ?? null }))

async function run(): Promise<void> {
  if (busy.value || cfg.value.disabled) return

  const clickAction = findAction(cfg.value.actions, 'click')
  if (clickAction) {
    busy.value = true
    try {
      await runAction(clickAction, context.value)
    } finally {
      busy.value = false
    }
    return
  }

  if (cfg.value.command) {
    busy.value = true
    try {
      await sessionStore.executeCommand(cfg.value.command, resolveParams(cfg.value.params, context.value))
    } finally {
      busy.value = false
    }
  }
}

let unregister: (() => void) | null = null

onMounted(() => {
  const keys = cfg.value.shortcutKeys
  if (keys && keys.length > 0 && (cfg.value.command || findAction(cfg.value.actions, 'click'))) {
    const entry: ShortcutEntry = {
      id: `button:${cfg.value.command ?? 'action'}:${cfg.value.label ?? 'btn'}`,
      keys,
      action: 'command',
      command: cfg.value.command,
      params: cfg.value.params,
      scope: 'component'
    }
    unregister = mountShortcut(entry)
  }
})

onUnmounted(() => {
  unregister?.()
})
</script>

<template>
  <button
    class="ui-button"
    :class="[`ui-button--${cfg.variant}`, `ui-button--${cfg.size}`, cfg.className]"
    :disabled="busy || cfg.disabled"
    :title="cfg.tooltip"
    :style="cfg.style"
    @click="run"
  >
    <span v-if="cfg.icon" class="ui-button__icon">{{ cfg.icon }}</span>
    <template v-if="busy">Working…</template>
    <template v-else>{{ cfg.label }}</template>
    <kbd v-if="cfg.shortcutKeys && cfg.shortcutKeys.length > 0" class="ui-button__shortcut">
      {{ cfg.shortcutKeys.join(' ') }}
    </kbd>
  </button>
</template>

