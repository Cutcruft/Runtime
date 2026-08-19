<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { configStore } from './store/config'
import { sessionStore } from './store/session'
import { dataStore } from './store/data'
import { i18nStore } from './store/i18n'
import { pageStore } from './store/page'
import { routerStore } from './store/router'
import { themeStore } from './store/theme'
import PageView from './core/primitives/Page.vue'
import ToastViewport from './core/primitives/Toast.vue'
import CommandPalette from './components/CommandPalette.vue'
import Sidebar from './components/Sidebar.vue'
import TabsBar from './core/primitives/Tabs.vue'
import OverlayHost from './overlay/OverlayHost.vue'

const t = i18nStore.t
const tr = i18nStore.tr

const app = computed(() => configStore.app)
const layout = computed(() => app.value?.layout ?? 'topbar')
const connected = computed(() => sessionStore.isConnected)
const projectId = computed(() => sessionStore.projectId)
const title = computed(() => tr(app.value?.title ?? 'Runtime'))
const logo = computed(() => {
  const value = app.value?.logo
  return value && isHttpLogo(value) ? value : undefined
})
const drawerOpen = ref(false)

const activePage = computed(() =>
  configStore.pages.find((page) => page.id === pageStore.activePageId)
)

const pageContext = computed(() => ({ page: pageStore.activePageId }))
const themeLabel = computed(() => {
  switch (themeStore.mode) {
    case 'dark':
      return '☾'
    case 'light':
      return '☀'
    default:
      return '◐'
  }
})

function navigateTo(pageId: string | undefined): void {
  if (pageId) {
    routerStore.open(pageId)
    drawerOpen.value = false
  }
}

function toggleDrawer(): void {
  drawerOpen.value = !drawerOpen.value
}

async function createProject(): Promise<void> {
  try {
    await sessionStore.createProject()
  } catch (error) {
    dataStore.reportCommandError('project.create', error)
  }
}

function isHttpLogo(logo: string): boolean {
  return logo.startsWith('http') || logo.startsWith('data:')
}

onMounted(() => {
  themeStore.init()
})
</script>

<template>
  <div v-if="routerStore.isEmbed" class="runtime runtime--embed">
    <main class="content">
      <div v-if="activePage" class="content__page">
        <PageView :page="activePage" :context="pageContext" />
      </div>
      <div v-else class="content__page">
        <div class="empty">
          <p>{{ t('core.app.pageNotFound') }}</p>
        </div>
      </div>
    </main>
    <ToastViewport />
    <CommandPalette />
    <OverlayHost />
  </div>

  <div v-else class="runtime" :class="`runtime--${layout}`">
    <header class="topbar">
      <button
        v-if="layout === 'sidebar'"
        class="topbar__button topbar__burger"
        :aria-expanded="drawerOpen"
        aria-label="Toggle navigation"
        @click="toggleDrawer"
      >☰</button>
      <div class="topbar__brand">
        <img v-if="logo" :src="logo" class="topbar__logo" alt="" />
        <h1 class="topbar__title">{{ title }}</h1>
      </div>
      <nav v-if="layout !== 'sidebar'" class="topbar__nav">
        <a
          v-for="item in configStore.navigation"
          :key="item.id"
          class="topbar__link"
          :class="{ 'topbar__link--active': pageStore.activePageId === item.pageId }"
          @click.prevent="navigateTo(item.pageId)"
        >
          {{ tr(item.label) }}
        </a>
      </nav>
      <div class="topbar__actions">
        <button
          class="topbar__button"
          :disabled="!pageStore.canGoBack"
          title="Back"
          @click="pageStore.back()"
        >←</button>
        <button
          class="topbar__button"
          :disabled="!pageStore.canGoForward"
          title="Forward"
          @click="pageStore.forward()"
        >→</button>
        <button
          class="topbar__button"
          :title="`Theme: ${themeStore.mode}`"
          @click="themeStore.cycle()"
        >{{ themeLabel }}</button>
        <span class="status" :class="connected ? 'status--ok' : 'status--err'">
          {{ connected ? t('core.app.online') : t('core.app.offline') }}
        </span>
        <span v-if="projectId" class="status">{{ projectId.slice(0, 8) }}</span>
        <button v-if="!projectId" class="ui-button ui-button--primary" @click="createProject">
          {{ t('core.app.newProject') }}
        </button>
      </div>
    </header>

    <div class="runtime__body">
      <Sidebar v-if="layout === 'sidebar'" :open="drawerOpen" @close="drawerOpen = false" />
      <main class="content">
        <TabsBar v-if="pageStore.openPages.length > 0" />
        <div v-if="!projectId" class="content__page">
          <div class="empty">
            <p>{{ t('core.app.noProject') }}</p>
            <button class="ui-button ui-button--primary" @click="createProject">{{ t('core.app.createProject') }}</button>
          </div>
        </div>
        <div v-else-if="activePage" class="content__page">
          <PageView :page="activePage" :context="pageContext" />
        </div>
        <div v-else class="content__page">
          <div class="empty">
            <p>{{ t('core.app.pageNotFound') }}</p>
          </div>
        </div>
      </main>
    </div>

    <ToastViewport />
    <CommandPalette />
    <OverlayHost />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
}
</style>

<style scoped>
.runtime {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.runtime__body {
  display: flex;
  flex: 1;
  min-height: 0;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.content__page {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1.5rem;
  max-width: 72rem;
  margin: 0 auto;
  width: 100%;
}
.topbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  padding: 0.5rem 1.5rem;
  background: var(--rt-color-surface);
  border-bottom: 1px solid var(--rt-color-border);
}
.topbar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.topbar__logo {
  height: 1.75rem;
  width: 1.75rem;
  object-fit: contain;
}
.topbar__title {
  margin: 0;
  font-size: 1.1rem;
}
.topbar__nav {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}
.topbar__link {
  padding: 0.4rem 0.75rem;
  border-radius: var(--rt-radius-sm);
  color: var(--rt-color-muted);
  text-decoration: none;
  cursor: pointer;
  font-size: var(--rt-font-size);
}
.topbar__link:hover {
  background: var(--rt-color-bg);
  color: var(--rt-color-text);
}
.topbar__link--active {
  background: var(--rt-color-bg);
  color: var(--rt-color-primary);
  font-weight: 600;
}
.topbar__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
}
.topbar__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.9rem;
  height: 1.9rem;
  padding: 0 0.4rem;
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-surface);
  color: var(--rt-color-text);
  cursor: pointer;
  font: inherit;
}
.topbar__button:hover:not(:disabled) {
  background: var(--rt-color-bg);
}
.topbar__button:disabled {
  opacity: 0.4;
  cursor: default;
}
.status {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: var(--rt-font-size-sm);
  font-weight: 600;
  background: var(--rt-color-bg);
  color: var(--rt-color-muted);
}
.status--ok {
  background: var(--rt-color-success);
  color: #fff;
}
.status--err {
  background: var(--rt-color-danger);
  color: #fff;
}
.empty {
  padding: 3rem;
  text-align: center;
  background: var(--rt-color-surface);
  border: 1px dashed var(--rt-color-border);
  border-radius: var(--rt-radius);
}

@media (max-width: 48rem) {
  .topbar {
    padding: 0.5rem 0.75rem;
  }
  .topbar__nav {
    order: 3;
    flex-basis: 100%;
    overflow-x: auto;
  }
  .topbar__burger {
    display: inline-flex;
  }
  .topbar__actions .status:not(.status--ok, .status--err) {
    display: none;
  }
}

@media (min-width: 48.0625rem) {
  .topbar__burger {
    display: none;
  }
}

.runtime--embed {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.runtime--embed .content__page {
  max-width: none;
}
</style>
