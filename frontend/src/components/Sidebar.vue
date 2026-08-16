<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { configStore } from '../store/config'
import { pageStore } from '../store/page'
import { routerStore } from '../store/router'
import { i18nStore } from '../store/i18n'
import { iconView } from '../renderer/icon'
import type { NavigationEntry } from '../protocol/types'

defineProps<{
  open?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const tr = i18nStore.tr
const collapsedGroups = ref<Set<string>>(new Set())

const groups = computed(() => {
  const byGroup = new Map<string, NavigationEntry[]>()
  for (const item of configStore.navigation) {
    const key = item.group ? tr(item.group) : ''
    if (!byGroup.has(key)) byGroup.set(key, [])
    byGroup.get(key)!.push(item)
  }
  return Array.from(byGroup.entries()).map(([title, items]) => ({ title, items }))
})

function navigate(pageId: string | undefined): void {
  if (!pageId) return
  routerStore.open(pageId)
  emit('close')
}

function toggleGroup(title: string): void {
  const next = new Set(collapsedGroups.value)
  if (next.has(title)) next.delete(title)
  else next.add(title)
  collapsedGroups.value = next
}

watch(
  () => pageStore.activePageId,
  () => {
    const active = pageStore.activePageId
    if (!active) return
    const item = configStore.navigation.find((entry) => entry.pageId === active)
    if (item && item.group) collapsedGroups.value.delete(tr(item.group))
  }
)
</script>

<template>
  <div v-if="open" class="sidebar__scrim" @click="emit('close')" />
  <aside class="sidebar" :class="{ 'sidebar--drawer': open }">
    <nav class="sidebar__nav">
      <template v-for="group in groups" :key="group.title">
        <div v-if="group.title" class="sidebar__group-heading" @click="toggleGroup(group.title)">
          <span class="sidebar__caret" :class="{ 'sidebar__caret--open': !collapsedGroups.has(group.title) }">▸</span>
          <span>{{ group.title }}</span>
        </div>
        <ul v-if="!collapsedGroups.has(group.title)" class="sidebar__list">
          <li v-for="item in group.items" :key="item.id">
            <a
              class="sidebar__item"
              :class="{ 'sidebar__item--active': pageStore.activePageId === item.pageId }"
              @click.prevent="navigate(item.pageId)"
            >
              <img v-if="iconView(item.icon).src" class="sidebar__icon sidebar__icon--img" :src="iconView(item.icon).src" alt="" />
              <span v-else-if="iconView(item.icon).glyph" class="sidebar__icon">{{ iconView(item.icon).glyph }}</span>
              <span class="sidebar__label">{{ tr(item.label) }}</span>
            </a>
          </li>
        </ul>
      </template>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 14rem;
  flex: 0 0 auto;
  background: var(--rt-color-surface);
  border-right: 1px solid var(--rt-color-border);
  overflow-y: auto;
  padding: 0.5rem 0.5rem 1rem;
}
.sidebar__group-heading {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.5rem 0.25rem;
  font-size: var(--rt-font-size-sm);
  font-weight: 600;
  color: var(--rt-color-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  user-select: none;
}
.sidebar__caret {
  display: inline-block;
  font-size: 0.6rem;
  transition: transform 0.15s ease;
}
.sidebar__caret--open {
  transform: rotate(90deg);
}
.sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0 0 0.5rem;
}
.sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  border-radius: var(--rt-radius-sm);
  color: var(--rt-color-text);
  text-decoration: none;
  cursor: pointer;
  font-size: var(--rt-font-size);
}
.sidebar__item:hover {
  background: var(--rt-color-bg);
}
.sidebar__item--active {
  background: var(--rt-color-bg);
  color: var(--rt-color-primary);
  font-weight: 600;
}
.sidebar__icon {
  width: 1.1rem;
  height: 1.1rem;
  text-align: center;
  color: var(--rt-color-muted);
}
.sidebar__icon--img {
  object-fit: contain;
}
.sidebar__item--active .sidebar__icon {
  color: var(--rt-color-primary);
}
.sidebar__scrim {
  display: none;
}

@media (max-width: 48rem) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 40;
    width: min(18rem, 85vw);
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    box-shadow: 0 0.5rem 2rem rgb(0 0 0 / 0.15);
  }
  .sidebar--drawer {
    transform: translateX(0);
  }
  .sidebar__scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 30;
    background: rgb(0 0 0 / 0.35);
  }
}
</style>
