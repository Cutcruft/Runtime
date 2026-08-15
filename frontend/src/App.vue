<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { configStore } from './store/config'
import { sessionStore } from './store/session'
import { dataStore } from './store/data'
import PageView from './components/PageView.vue'
import ToastViewport from './components/ToastViewport.vue'
import CommandPalette from './components/CommandPalette.vue'
import { applyTheme } from './renderer/theme'

const app = computed(() => configStore.app)
const connected = computed(() => sessionStore.isConnected)
const projectId = computed(() => sessionStore.projectId)
const activePageId = computed(() => configStore.activePageId)
const title = computed(() => app.value?.title ?? 'Runtime')
const logo = computed(() => {
  const value = app.value?.logo
  return value && isHttpLogo(value) ? value : undefined
})

const activePage = computed(() =>
  configStore.pages.find((page) => page.id === activePageId.value)
)

const pageContext = computed(() => ({ page: activePageId.value }))

function navigateTo(pageId: string | undefined): void {
  if (pageId) configStore.navigate(pageId)
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
  applyTheme()
  if (!projectId.value && app.value?.landingPageId) {
    configStore.navigate(app.value.landingPageId)
  }
})
</script>

<template>
  <div class="runtime">
    <header class="topbar">
      <div class="topbar__brand">
        <img v-if="logo" :src="logo" class="topbar__logo" alt="" />
        <h1 class="topbar__title">{{ title }}</h1>
      </div>
      <nav class="topbar__nav">
        <a
          v-for="item in configStore.navigation"
          :key="item.id"
          class="topbar__link"
          :class="{ 'topbar__link--active': activePageId === item.pageId }"
          @click.prevent="navigateTo(item.pageId)"
        >
          {{ item.label }}
        </a>
      </nav>
      <div class="topbar__actions">
        <span class="status" :class="connected ? 'status--ok' : 'status--err'">
          {{ connected ? 'online' : 'offline' }}
        </span>
        <span v-if="projectId" class="status">{{ projectId.slice(0, 8) }}</span>
        <button v-if="!projectId" class="ui-button ui-button--primary" @click="createProject">
          New project
        </button>
      </div>
    </header>

    <main class="content">
      <div v-if="!projectId" class="empty">
        <p>No project is open. Create one to start working.</p>
        <button class="ui-button ui-button--primary" @click="createProject">Create project</button>
      </div>
      <PageView v-else-if="activePage" :page="activePage" :context="pageContext" />
      <div v-else class="empty">
        <p>Page not found.</p>
      </div>
    </main>

    <ToastViewport />
    <CommandPalette />
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
}
.topbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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
.content {
  padding: 1.5rem;
  max-width: 72rem;
  margin: 0 auto;
}
.empty {
  padding: 3rem;
  text-align: center;
  background: var(--rt-color-surface);
  border: 1px dashed var(--rt-color-border);
  border-radius: var(--rt-radius);
}
</style>
