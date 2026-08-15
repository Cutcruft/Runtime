<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { configStore } from '../store/config'
import { sessionStore } from '../store/session'
import type { CommandEntry } from '../protocol/types'

const open = ref(false)
const query = ref('')
const selectedIndex = ref(0)

const commands = computed(() => configStore.commands)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return commands.value
  return commands.value.filter(
    (c) => c.id.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
  )
})

function execute(command: CommandEntry): void {
  open.value = false
  sessionStore.executeCommand(command.id, {}).catch(() => {
    /* error toast already shown */
  })
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
    selectedIndex.value = Math.min(selectedIndex.value + 1, filtered.value.length - 1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    return
  }
  if (event.key === 'Enter' && filtered.value.length > 0) {
    event.preventDefault()
    execute(filtered.value[selectedIndex.value])
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
        placeholder="Search commands…"
        autofocus
      />
      <ul class="palette__list">
        <li
          v-for="(command, index) in filtered"
          :key="command.id"
          class="palette__item"
          :class="{ 'palette__item--active': index === selectedIndex }"
          @click="execute(command)"
        >
          <code class="palette__id">{{ command.id }}</code>
          <span class="palette__description">{{ command.description }}</span>
        </li>
        <li v-if="filtered.length === 0" class="palette__empty">No commands found</li>
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
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}
.palette__input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1rem;
  border: none;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
  outline: none;
}
.palette__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem;
  max-height: 40vh;
  overflow-y: auto;
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
  background: #eef4ff;
}
.palette__id {
  font-family: monospace;
  font-size: 0.85rem;
  color: #0066cc;
}
.palette__description {
  font-size: 0.85rem;
  color: #666;
}
.palette__empty {
  padding: 1rem;
  text-align: center;
  color: #999;
  font-size: 0.875rem;
}
</style>
