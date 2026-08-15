import { ref } from 'vue'
import { WsClient, type WsStatus } from '../protocol/WsClient'
import { WS_MESSAGE_TYPES, type CommandResultPayload, type WsEnvelope } from '../protocol/envelope'
import { emitEvent } from '../events/eventBus'
import { configStore } from './config'
import { dataStore } from './data'
import { toasts } from './toasts'

const wsStatus = ref<WsStatus>('disconnected')
const projectId = ref<string | null>(null)

let client: WsClient | null = null
let reconnectProjectId: string | null = null

export const sessionStore = {
  get wsStatus(): WsStatus {
    return wsStatus.value
  },
  get projectId(): string | null {
    return projectId.value
  },
  get isConnected(): boolean {
    return wsStatus.value === 'connected'
  },

  init(): void {
    const wsPath = configStore.transport?.wsPath ?? '/ws'
    client = new WsClient(wsPath)
    client.onStatusChange = (status) => {
      wsStatus.value = status
      if (status === 'connected' && reconnectProjectId) {
        openProject(reconnectProjectId)
      }
    }
    client.onEvent = (envelope) => handleIncoming(envelope)
    client.connect()
  },

  execute(commandId: string, params: unknown): Promise<CommandResultPayload> {
    if (!client) return Promise.reject(new Error('Session not initialized'))
    return client.execute(commandId, params)
  },

  async createProject(): Promise<string> {
    const result = await executeChecked('project.create', null)
    const id = readProjectId(result)
    projectId.value = id
    reconnectProjectId = id
    dataStore.refreshAll()
    return id
  },

  async openProject(id: string): Promise<string> {
    const result = await executeChecked('project.open', { projectId: id })
    projectId.value = readProjectId(result)
    reconnectProjectId = id
    dataStore.refreshAll()
    return id
  },

  async executeCommand(commandId: string, params: unknown): Promise<CommandResultPayload> {
    const result = await executeChecked(commandId, params)
    if (result.status === 'ERROR') {
      dataStore.reportCommandError(commandId, result.error ?? 'Command failed')
    }
    return result
  }
}

async function executeChecked(commandId: string, params: unknown): Promise<CommandResultPayload> {
  if (!client) throw new Error('Session not initialized')
  const result = await client.execute(commandId, params)
  if (result.status === 'ERROR') {
    throw new Error(result.error ?? `Command '${commandId}' failed`)
  }
  return result
}

function readProjectId(result: CommandResultPayload): string {
  const value = result.value as { projectId?: string } | undefined
  if (value && typeof value.projectId === 'string') return value.projectId
  throw new Error('Command result did not contain projectId')
}

function handleIncoming(envelope: WsEnvelope): void {
  switch (envelope.type) {
    case WS_MESSAGE_TYPES.PROJECT_EVENT: {
      const payload = envelope.payload
      const pid = payload.projectId
      if (typeof pid === 'string') projectId.value = pid
      emitEvent({ kind: WS_MESSAGE_TYPES.PROJECT_EVENT, payload })
      break
    }
    case WS_MESSAGE_TYPES.OBJECT_CHANGED: {
      const entityType = envelope.payload.entityType
      if (typeof entityType === 'string') {
        dataStore.invalidate(entityType)
      }
      emitEvent({ kind: WS_MESSAGE_TYPES.OBJECT_CHANGED, payload: envelope.payload })
      break
    }
    case WS_MESSAGE_TYPES.ERROR: {
      const message = (envelope.payload.message as string) ?? 'Unknown error'
      toasts.push({ message, kind: 'error' })
      emitEvent({ kind: WS_MESSAGE_TYPES.ERROR, payload: envelope.payload })
      break
    }
    default:
      emitEvent({ kind: envelope.type, payload: envelope.payload })
  }
}

function openProject(id: string): void {
  sessionStore.openProject(id).catch(() => {
    /* rebind on reconnect failed — will retry next reconnect */
  })
}
