<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { configStore } from '../store/config'
import { pageStore } from '../store/page'
import { routerStore } from '../store/router'
import { i18nStore } from '../store/i18n'

const tr = i18nStore.tr
const scrollRef = ref<HTMLElement | null>(null)

const tabs = computed(() =>
  pageStore.openPages
    .map((pageId) => {
      const page = configStore.pages.find((p) => p.id === pageId)
      return { pageId, title: page ? tr(page.title) : pageId }
    })
)

function activate(pageId: string): void {
  routerStore.open(pageId)
}

function close(event: MouseEvent, pageId: string): void {
  event.stopPropagation()
  pageStore.closeTab(pageId)
}

function onAuxClick(event: MouseEvent, pageId: string): void {
  if (event.button === 1) close(event, pageId)
}

watch(
  () => pageStore.activePageId,
  async () => {
    await nextTick()
    const container = scrollRef.value
    const active = container?.querySelector('.tabsbar__tab--active')
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }
)
</script>

<template>
  <div class="tabsbar">
    <div ref="scrollRef" class="tabsbar__scroll">
      <button
        v-for="tab in tabs"
        :key="tab.pageId"
        type="button"
        class="tabsbar__tab"
        :class="{ 'tabsbar__tab--active': pageStore.activePageId === tab.pageId }"
        @click="activate(tab.pageId)"
        @auxclick="onAuxClick($event, tab.pageId)"
      >
        <span class="tabsbar__title">{{ tab.title }}</span>
        <span
          class="tabsbar__close"
          role="button"
          tabindex="-1"
          aria-label="Close"
          @click="close($event, tab.pageId)"
        >×</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tabsbar {
  display: flex;
  align-items: stretch;
  background: var(--rt-color-surface);
  border-bottom: 1px solid var(--rt-color-border);
  padding: 0.25rem 0.5rem 0;
  gap: 0.25rem;
  overflow: hidden;
}
.tabsbar__scroll {
  display: flex;
  align-items: flex-end;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: thin;
}
.tabsbar__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  max-width: 14rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: var(--rt-radius-sm) var(--rt-radius-sm) 0 0;
  background: transparent;
  color: var(--rt-color-muted);
  font: inherit;
  font-size: var(--rt-font-size);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
}
.tabsbar__tab:hover {
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
}
.tabsbar__tab--active {
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
  border-color: var(--rt-color-border);
}
.tabsbar__title {
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabsbar__close {
  flex: 0 0 auto;
  padding: 0 0.2rem;
  border-radius: 4px;
  line-height: 1;
  color: var(--rt-color-muted);
}
.tabsbar__close:hover {
  background: var(--rt-color-border);
  color: var(--rt-color-text);
}
</style>
