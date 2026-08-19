<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import ComponentHost from '../core/primitives/Container.vue'
import { overlayService, type OverlayInstance } from '../overlay/overlayService'
import { i18nStore } from '../store/i18n'

const props = defineProps<{ instance: OverlayInstance }>()

const tr = i18nStore.tr

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
  <div class="rt-modal-backdrop" @mousedown.self="close">
    <div class="rt-modal" :style="{ width: instance.definition.width ?? 'min(90vw, 32rem)' }" role="dialog">
      <header v-if="instance.definition.title" class="rt-modal__header">
        <h3 class="rt-modal__title">{{ tr(instance.definition.title ?? '') }}</h3>
        <button class="rt-modal__close" @click="close">✕</button>
      </header>
      <div class="rt-modal__body">
        <ComponentHost v-if="instance.definition.content" :component="instance.definition.content" :context="instance.context" />
        <slot v-else></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rt-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
}
.rt-modal {
  background: var(--rt-color-surface);
  border-radius: var(--rt-radius);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.28);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.rt-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--rt-space) var(--rt-space-lg);
  border-bottom: 1px solid var(--rt-color-border);
}
.rt-modal__title {
  margin: 0;
  font-size: var(--rt-font-size-lg);
}
.rt-modal__close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: var(--rt-font-size);
  color: var(--rt-color-muted);
}
.rt-modal__body {
  padding: var(--rt-space-lg);
  overflow-y: auto;
}
</style>
