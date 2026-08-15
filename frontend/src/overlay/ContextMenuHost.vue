<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { overlayService, type OverlayInstance } from '../overlay/overlayService'
import { i18nStore } from '../store/i18n'
import type { MenuItemSpec } from '../protocol/componentSpec'

const props = defineProps<{ instance: OverlayInstance }>()

const tr = i18nStore.tr

const submenu = ref<{ item: MenuItemSpec; x: number; y: number } | null>(null)

function onOutsideClick(): void {
  overlayService.close(props.instance.uid)
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    e.stopPropagation()
    overlayService.close(props.instance.uid)
  }
}

function setSubmenu(item: MenuItemSpec, event: MouseEvent): void {
  if (!item.items?.length) {
    submenu.value = null
    return
  }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  submenu.value = { item, x: rect.right + 2, y: rect.top - 4 }
}

function clearSubmenu(): void {
  submenu.value = null
}

onMounted(() => {
  document.addEventListener('mousedown', onOutsideClick, true)
  window.addEventListener('keydown', onKeydown, true)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', onOutsideClick, true)
  window.removeEventListener('keydown', onKeydown, true)
})
</script>

<template>
  <div
    class="rt-menu"
    :style="{ left: `${instance.anchor?.x ?? 0}px`, top: `${instance.anchor?.y ?? 0}px` }"
    @contextmenu.prevent
  >
    <div
      v-for="(item, index) in instance.definition.items ?? []"
      :key="index"
      class="rt-menu__item"
      :class="{
        'rt-menu__item--divider': item.divider,
        'rt-menu__item--disabled': item.disabled,
        'rt-menu__item--danger': item.danger,
        'rt-menu__item--submenu': item.items?.length
      }"
      @click.stop="!item.items?.length && overlayService.executeMenuItem(item, instance)"
      @mouseenter="setSubmenu(item, $event)"
      @mouseleave="clearSubmenu"
    >
      <span v-if="item.divider" class="rt-menu__divider"></span>
      <template v-else>
        <span class="rt-menu__icon">{{ item.icon ?? '' }}</span>
        <span class="rt-menu__label">{{ tr(item.label) }}</span>
        <span v-if="item.shortcut" class="rt-menu__shortcut">{{ item.shortcut }}</span>
        <span v-if="item.items?.length" class="rt-menu__caret">›</span>
      </template>
    </div>
  </div>

  <div
    v-if="submenu"
    class="rt-menu rt-menu--submenu"
    :style="{ left: `${submenu.x}px`, top: `${submenu.y}px` }"
    @click.stop
  >
    <div
      v-for="(child, index) in submenu.item.items ?? []"
      :key="index"
      class="rt-menu__item"
      :class="{ 'rt-menu__item--divider': child.divider, 'rt-menu__item--disabled': child.disabled, 'rt-menu__item--danger': child.danger }"
      @click.stop="overlayService.executeMenuItem(child, instance)"
    >
      <span v-if="child.divider" class="rt-menu__divider"></span>
      <template v-else>
        <span class="rt-menu__icon">{{ child.icon ?? '' }}</span>
        <span class="rt-menu__label">{{ tr(child.label) }}</span>
        <span v-if="child.shortcut" class="rt-menu__shortcut">{{ child.shortcut }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.rt-menu {
  position: fixed;
  min-width: 12rem;
  padding: 0.25rem;
  background: var(--rt-color-surface);
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  z-index: 1100;
}
.rt-menu__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.6rem;
  border-radius: var(--rt-radius-sm);
  cursor: pointer;
  font-size: var(--rt-font-size);
  white-space: nowrap;
}
.rt-menu__item:hover {
  background: var(--rt-color-primary);
  color: var(--rt-color-on-primary);
}
.rt-menu__item--disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}
.rt-menu__item--danger:hover {
  background: var(--rt-color-danger);
  color: #fff;
}
.rt-menu__item--submenu:hover {
  background: var(--rt-color-primary);
  color: var(--rt-color-on-primary);
}
.rt-menu__icon {
  width: 1rem;
  text-align: center;
}
.rt-menu__label {
  flex: 1;
}
.rt-menu__shortcut {
  font-size: 0.75rem;
  opacity: 0.7;
}
.rt-menu__caret {
  font-weight: 700;
}
.rt-menu__divider {
  display: block;
  height: 1px;
  margin: 0.25rem 0;
  background: var(--rt-color-border);
}
</style>
