<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { configStore } from '../store/config'
import { i18nStore } from '../store/i18n'
import { sessionStore } from '../store/session'
import { pageStore } from '../store/page'
import type { CommandEntry } from '../protocol/types'

const t = i18nStore.t
const tr = i18nStore.tr
const open = ref(false)
const query = ref('')
const selectedIndex = ref(0)

interface PaletteItem {
  kind: 'command' | 'page'
  id: string
  description: string
  icon?: string
  pageId?: string
  command?: CommandEntry
  group?: string
}

interface PaletteGroup {
  label: string
  items: PaletteItem[]
}

const groups = computed<PaletteGroup[]>(() => {
  const pages: PaletteItem[] = configStore.pages.map((page) => ({
    kind: 'page',
    id: `page:${page.id}`,
    description: tr(page.title),
    icon: '◈',
    pageId: page.id
  }))
  const byGroup = new Map<string, PaletteItem[]>()
  for (const command of configStore.commands) {
    if (command.visibility === 'PRIVATE') continue
    const group = command.group ?? 'Commands'
    if (!byGroup.has(group)) byGroup.set(group, [])
    byGroup.get(group)!.push({ kind: 'command', id: command.id, description: command.description, group, command })
  }
  const commandGroups = Array.from(byGroup.entries()).map(([label, items]) => ({ label, items }))
  return [{ label: 'Pages', items: pages }, ...commandGroups].filter((g) => g.items.length > 0)
})

const flatItems = computed(() => groups.value.flatMap((group) => group.items))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return groups.value
  return groups.value
    .map((group) => ({
      label: group.label,
      items: group.items.filter(
        (item) => item.id.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      )
    }))
    .filter((group) => group.items.length > 0)
})

function execute(item: PaletteItem): void {
  open.value = false
  if (item.kind === 'page' && item.pageId) {
    pageStore.openPage(item.pageId)
  } else if (item.command) {
    sessionStore.executeCommand(item.command.id, {}).catch(() => {
      /* error toast already shown */
    })
  }
}

function flatIndex(group: PaletteGroup, index: number): number {
  let offset = 0
  for (const g of filtered.value) {
    if (g === group) return offset + index
    offset += g.items.length
  }
  return index
}

function onKeydown(event: KeyboardEvent): void {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = !open.value
    query.value = ''
    selectedIndex.value = 0
    return
  }
  if (!open.value) return
  if (event.key === 'Escape') {
    open.value = false
    return
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, flatItems.value.length - 1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    return
  }
  if (event.key === 'Enter' && flatItems.value.length > 0) {
    event.preventDefault()
    execute(flatItems.value[selectedIndex.value])
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div v-if="open" class="palette-overlay" @click.self="open = false">
    <div class="palette">
      <input
        v-model="query"
        class="palette__input"
        :placeholder="t('core.palette.placeholder')"
        autofocus
      />
      <ul class="palette__list">
        <template v-for="group in filtered" :key="group.label">
          <li class="palette__group">{{ group.label }}</li>
          <li
            v-for="(item, index) in group.items"
            :key="item.id"
            class="palette__item"
            :class="{ 'palette__item--active': flatIndex(group, index) === selectedIndex }"
            @click="execute(item)"
          >
            <span v-if="item.icon" class="palette__icon">{{ item.icon }}</span>
            <code v-if="item.kind === 'command'" class="palette__id">{{ item.id }}</code>
            <span v-else class="palette__id palette__id--page">{{ item.id.replace(/^page:/, '') }}</span>
            <span class="palette__description">{{ item.description }}</span>
          </li>
        </template>
        <li v-if="flatItems.length === 0" class="palette__empty">{{ t('core.palette.empty') }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 15vh;
  z-index: 900;
}
.palette {
  width: min(36rem, 90vw);
  background: var(--rt-color-surface);
  border-radius: 10px;
  box-shadow: var(--rt-shadow);
  overflow: hidden;
}
.palette__input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1rem;
  border: none;
  border-bottom: 1px solid var(--rt-color-border);
  font-size: 1rem;
  outline: none;
  background: var(--rt-color-surface);
  color: var(--rt-color-text);
}
.palette__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem;
  max-height: 40vh;
  overflow-y: auto;
}
.palette__group {
  padding: 0.5rem 0.75rem 0.25rem;
  font-size: var(--rt-font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--rt-color-muted);
}
.palette__item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
}
.palette__item--active {
  background: var(--rt-color-bg);
}
.palette__icon {
  width: 1.1rem;
  text-align: center;
  color: var(--rt-color-muted);
}
.palette__id {
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--rt-color-primary);
}
.palette__id--page {
  color: var(--rt-color-muted);
}
.palette__description {
  font-size: 0.85rem;
  color: var(--rt-color-muted);
}
.palette__empty {
  padding: 1rem;
  text-align: center;
  color: #999;
  font-size: 0.875rem;
}
</style>
