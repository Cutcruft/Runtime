import { configStore } from '../store/config'
import type { CommandEntry, WorkspaceConfig } from '../protocol/types'
import { useEffect } from 'preact/hooks'
import {
  docs,
  subtitle,
  cmd as cmdStyle,
  cmdHeader,
  cmdId,
  cmdDesc,
  badge,
  badgeMuted,
  params,
  steps,
  protoEnvelope,
  protoExample,
  direction
} from './docsPage.css.ts'

function groupCommands(config: Partial<WorkspaceConfig>): Array<[string, CommandEntry[]]> {
  const map = new Map<string, CommandEntry[]>()
  for (const cmd of config.commands ?? []) {
    const g = cmd.group ?? '(no group)'
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(cmd)
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
}

export default function DocsPage() {
  useEffect(() => {
    if (!configStore.loadedSections.has('commands')) {
      configStore.loadSection('commands').catch(() => {})
    }
  }, [])

  const config = configStore.value
  if (!config) return null
  const wsPath = configStore.transport?.wsPath ?? '/ws'
  const protocolMessages = config.protocol?.messages ?? []

  return (
    <div class={docs}>
      <header style={{ marginBottom: 'var(--rt-space-lg)' }}>
        <h1>Runtime API Documentation</h1>
        <p class={subtitle}>Auto-generated from the live runtime configuration.</p>
      </header>

      <section style={{ marginBottom: 'var(--rt-space-lg)' }}>
        <h2>Transport</h2>
        <dl>
          <dt>WebSocket endpoint</dt>
          <dd>
            <code>{wsPath}</code>
          </dd>
        </dl>
      </section>

      <section style={{ marginBottom: 'var(--rt-space-lg)' }}>
        <h2>Commands</h2>
        <p>
          {config.commands?.length ?? 0} commands registered across {groupCommands(config).length} groups.
        </p>

        {groupCommands(config).map(([group, cmds]) => (
          <div style={{ marginTop: 'var(--rt-space)' }} key={group}>
            <h3>{group}</h3>
            {cmds.map((cmd) => (
              <div class={cmdStyle} key={cmd.id}>
                <div class={cmdHeader}>
                  <code class={cmdId}>{cmd.id}</code>
                  {cmd.type ? <span class={badge}>{cmd.type}</span> : null}
                  {cmd.visibility === 'PRIVATE' ? (
                    <span class={badge + ' ' + badgeMuted}>private</span>
                  ) : null}
                </div>
                <p class={cmdDesc}>{cmd.description}</p>

                {cmd.parameters && cmd.parameters.length > 0 ? (
                  <div class={params}>
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
                        {cmd.parameters.map((param) => (
                          <tr key={param.name}>
                            <td>
                              <code>{param.name}</code>
                            </td>
                            <td>{param.type}</td>
                            <td>{param.required ? 'yes' : 'no'}</td>
                            <td>{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {cmd.steps && cmd.steps.length > 0 ? (
                  <div class={steps}>
                    <h4>Pipeline steps</h4>
                    <ol>
                      {cmd.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </section>

      <section style={{ marginBottom: 'var(--rt-space-lg)' }}>
        <h2>WebSocket Protocol</h2>
        <p>All messages use a JSON envelope.</p>

        <div class={protoEnvelope}>
          <h4>Envelope</h4>
          <pre>{'{ "type": "...", "requestId": "...", "payload": { ... } }'}</pre>
        </div>

        <table>
          <thead>
            <tr>
              <th>Message type</th>
              <th>Direction</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {protocolMessages.map((msg) => (
              <tr key={msg.type}>
                <td>
                  <code>{msg.type}</code>
                </td>
                <td class={direction}>{msg.direction}</td>
                <td>{msg.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div class={protoExample}>
          <h4>Request</h4>
          <pre>
            {'{ "type": "command.execute", "requestId": "r1", "payload": { "commandId": "demo.taskcreate", "params": { "title": "Hello" } } }'}
          </pre>

          <h4>Success response</h4>
          <pre>
            {'{ "type": "command.result", "requestId": "r1", "payload": { "status": "SUCCESS", "value": { ... }, "references": [] } }'}
          </pre>

          <h4>Error response</h4>
          <pre>
            {'{ "type": "error", "requestId": "r1", "payload": { "message": "Missing parameters" } }'}
          </pre>
        </div>
      </section>
    </div>
  )
}
