<script setup lang="ts">
import { computed } from 'vue'
import { configStore } from '../store/config'

const transport = configStore.transport

const commandsByGroup = computed(() => {
  const map = new Map<string, typeof configStore.commands>()
  for (const cmd of configStore.commands) {
    const g = cmd.group ?? '(no group)'
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(cmd)
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
})

const protocolMessages = configStore.protocol.messages
</script>

<template>
  <div class="docs">
    <header class="docs__header">
      <h1>Runtime API Documentation</h1>
      <p class="docs__subtitle">
        Auto-generated from the live runtime configuration.
      </p>
    </header>

    <section class="docs__section">
      <h2>Transport</h2>
      <dl>
        <dt>WebSocket endpoint</dt>
        <dd><code>{{ transport?.wsPath ?? '/ws' }}</code></dd>
      </dl>
    </section>

    <section class="docs__section">
      <h2>Commands</h2>
      <p>
        {{ configStore.commands.length }} commands registered across
        {{ commandsByGroup.length }} groups.
      </p>

      <div v-for="[group, cmds] in commandsByGroup" :key="group" class="docs__group">
        <h3 class="docs__group-title">{{ group }}</h3>
        <div v-for="cmd in cmds" :key="cmd.id" class="docs__cmd">
          <div class="docs__cmd-header">
            <code class="docs__cmd-id">{{ cmd.id }}</code>
            <span v-if="cmd.type" class="docs__badge">{{ cmd.type }}</span>
            <span v-if="cmd.visibility === 'PRIVATE'" class="docs__badge docs__badge--muted">private</span>
          </div>
          <p class="docs__cmd-desc">{{ cmd.description }}</p>

          <div v-if="cmd.parameters && cmd.parameters.length > 0" class="docs__params">
            <h4>Parameters</h4>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="param in cmd.parameters" :key="param.name">
                  <td><code>{{ param.name }}</code></td>
                  <td>{{ param.type }}</td>
                  <td>{{ param.required ? 'yes' : 'no' }}</td>
                  <td>{{ param.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="cmd.steps && cmd.steps.length > 0" class="docs__steps">
            <h4>Pipeline steps</h4>
            <ol>
              <li v-for="(step, idx) in cmd.steps" :key="idx">{{ step }}</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <section class="docs__section">
      <h2>WebSocket Protocol</h2>
      <p>All messages use a JSON envelope.</p>

      <div class="docs__proto-envelope">
        <h4>Envelope</h4>
        <pre>{ "type": "...", "requestId": "...", "payload": { ... } }</pre>
      </div>

      <table class="docs__proto-table">
        <thead>
          <tr>
            <th>Message type</th>
            <th>Direction</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="msg in protocolMessages" :key="msg.type">
            <td><code>{{ msg.type }}</code></td>
            <td class="docs__direction">{{ msg.direction }}</td>
            <td>{{ msg.description }}</td>
          </tr>
        </tbody>
      </table>

      <div class="docs__proto-example">
        <h4>Request</h4>
        <pre>{ "type": "command.execute", "requestId": "r1", "payload": { "commandId": "demo.taskcreate", "params": { "title": "Hello" } } }</pre>

        <h4>Success response</h4>
        <pre>{ "type": "command.result", "requestId": "r1", "payload": { "status": "SUCCESS", "value": { ... }, "references": [] } }</pre>

        <h4>Error response</h4>
        <pre>{ "type": "error", "requestId": "r1", "payload": { "message": "Missing parameters" } }</pre>
      </div>
    </section>
  </div>
</template>

<style scoped>
.docs {
  max-width: 56rem;
  margin: 0 auto;
  padding: var(--rt-space-lg) var(--rt-space);
  font-family: var(--rt-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  line-height: 1.6;
}
.docs__header { margin-bottom: var(--rt-space-lg); }
.docs__header h1 { margin: 0 0 var(--rt-space-xs); font-size: 1.75rem; }
.docs__subtitle { margin: 0; color: var(--rt-color-muted); }
.docs__section { margin-bottom: var(--rt-space-lg); }
.docs__section h2 {
  font-size: 1.25rem;
  margin: 0 0 var(--rt-space-sm);
  padding-bottom: var(--rt-space-xs);
  border-bottom: 1px solid var(--rt-color-border);
}
.docs__group { margin-top: var(--rt-space); }
.docs__group-title { font-size: 1.05rem; margin: 0 0 var(--rt-space-xs); color: var(--rt-color-muted); }
.docs__cmd {
  background: var(--rt-color-surface);
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius);
  padding: var(--rt-space-sm) var(--rt-space);
  margin-bottom: var(--rt-space-sm);
}
.docs__cmd-header { display: flex; align-items: center; gap: var(--rt-space-sm); flex-wrap: wrap; }
.docs__cmd-id { font-weight: 600; }
.docs__cmd-desc { margin: 0.3rem 0 0; color: var(--rt-color-text); font-size: var(--rt-font-size); }
.docs__badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: var(--rt-radius-sm);
  background: var(--rt-color-bg);
  border: 1px solid var(--rt-color-border);
  color: var(--rt-color-muted);
  text-transform: uppercase;
}
.docs__badge--muted { opacity: 0.7; }
.docs__params, .docs__steps { margin-top: var(--rt-space-sm); }
.docs__params h4, .docs__steps h4, .docs__proto-envelope h4, .docs__proto-example h4 { margin: 0 0 var(--rt-space-xs); font-size: 0.9rem; color: var(--rt-color-muted); }
table { width: 100%; border-collapse: collapse; font-size: var(--rt-font-size); }
th, td { text-align: left; padding: 0.35rem var(--rt-space-sm); border-bottom: 1px solid var(--rt-color-border); }
th { background: var(--rt-color-bg); font-weight: 600; font-size: var(--rt-font-size-sm); }
code { font-family: "SF Mono", Menlo, monospace; font-size: 0.9em; }
pre {
  background: var(--rt-color-bg);
  border: 1px solid var(--rt-color-border);
  border-radius: var(--rt-radius-sm);
  padding: var(--rt-space-sm);
  overflow-x: auto;
  font-size: 0.85em;
  margin: 0;
}
.docs__direction { text-transform: capitalize; }
</style>
