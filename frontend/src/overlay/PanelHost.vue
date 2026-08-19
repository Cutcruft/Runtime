<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import ComponentHost from '../core/primitives/Container.vue'
import { overlayService, type OverlayInstance } from '../overlay/overlayService'
import { i18nStore } from '../store/i18n'

const props = defineProps<{ instance: OverlayInstance }>()

const tr = i18nStore.tr

const side = props.instance.definition.side ?? 'right'
const width = props.instance.definition.width ?? '24rem'
const height = props.instance.definition.width ?? '40vh'

function close(): void {
  overlayService.close(props.instance.uid)
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    e.stopPropagation()
    close()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown, true))
onUnmounted(() => window.removeEventListener('keydown', onKeydown, true))
</script>

<template>
  <div class="rt-panel-backdrop" @mousedown.self="close">
    <aside
      class="rt-panel"
      :class="`rt-panel--${side}`"
      :style="side === 'bottom' ? { height } : { width }"
    >
      <header v-if="instance.definition.title" class="rt-panel__header">
        <h3 class="rt-panel__title">{{ tr(instance.definition.title ?? '') }}</h3>
        <button class="rt-panel__close" @click="close">✕</button>
      </header>
      <div class="rt-panel__body">
        <ComponentHost v-if="instance.definition.content" :component="instance.definition.content" :context="instance.context" />
      </div>
    </aside>
  </div>
</template>

<style scoped>
.rt-panel-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1150;
}
.rt-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  background: var(--rt-color-surface);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}
.rt-panel--left { left: 0; }
.rt-panel--right { right: 0; }
.rt-panel--bottom {
  left: 0;
  right: 0;
  bottom: 0;
  top: auto;
}
.rt-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--rt-space) var(--rt-space-lg);
  border-bottom: 1px solid var(--rt-color-border);
}
.rt-panel__title {
  margin: 0;
  font-size: var(--rt-font-size-lg);
}
.rt-panel__close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: var(--rt-font-size);
  color: var(--rt-color-muted);
}
.rt-panel__body {
  flex: 1;
  padding: var(--rt-space-lg);
  overflow-y: auto;
}
</style>
