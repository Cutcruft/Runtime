<template>
  <div class="runtime">
    <header>
      <h1>Runtime</h1>
      <nav>
        <a v-for="item in config.navigation" :key="item.id" @click.prevent>
          {{ item.label }}
        </a>
      </nav>
    </header>
    <main>
      <div v-for="page in config.pages" :key="page.id" class="page">
        <h2>{{ page.title }}</h2>
        <div v-for="component in componentsForPage(page.id)" :key="component.type">
          <pre>{{ JSON.stringify(component, null, 2) }}</pre>
        </div>
      </div>
      <section class="registry">
        <h3>Registered Commands</h3>
        <ul>
          <li v-for="cmd in config.commands" :key="cmd.id">
            <strong>{{ cmd.id }}</strong> — {{ cmd.description }}
          </li>
        </ul>
        <h3>Registered Entities</h3>
        <ul>
          <li v-for="entity in config.entities" :key="entity.type">
            {{ entity.type }}
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { WorkspaceConfig } from './main'

const config = inject('config') as WorkspaceConfig

function componentsForPage(pageId: string) {
  return config.components.filter(c => c.config.pageId === pageId)
}
</script>

<style scoped>
.runtime { font-family: system-ui, sans-serif; margin: 0; padding: 0; }
header { padding: 1rem; background: #f5f5f5; border-bottom: 1px solid #ddd; }
nav a { margin-right: 1rem; cursor: pointer; color: #0066cc; }
main { padding: 2rem; }
.page { margin-bottom: 2rem; }
.registry { margin-top: 2rem; padding: 1rem; background: #fafafa; border: 1px solid #eee; }
ul { list-style: none; padding: 0; }
li { padding: 0.25rem 0; }
pre { background: #f0f0f0; padding: 0.5rem; border-radius: 4px; }
</style>
