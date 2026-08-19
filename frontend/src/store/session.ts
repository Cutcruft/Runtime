import { ref } from 'vue'
import { WsClient, type WsStatus } from '../protocol/WsClient'
import { WS_MESSAGE_TYPES, type CommandResultPayload, type WsEnvelope } from '../protocol/envelope'
import { emitEvent } from '../events/eventBus'
import { configStore } from './config'
import { dataStore } from './data'
import { layerStore } from './layer'
import { presenceStore } from './presence'
import { cursorStore } from './cursors'
import { toasts } from './toasts'
import { globalSingleton } from '../utils/globalSingleton'

const STORAGE_KEY = 'cc.projectId'

const { wsStatus, projectId, sessionState } = globalSingleton('__cc_sess', () => ({
  wsStatus: ref<WsStatus>('disconnected'),
  projectId: ref<string | null>(null),
  sessionState: { client: null as WsClient | null, reconnectProjectId: null as string | null }
}))

function persistProject(id: string | null): void {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
  } catch { /* localStorage unavailable */ }
}

function loadPersistedProject(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch { return null }
}

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
  get localParticipant() {
    return presenceStore.localParticipant
  },

  init(): void {
    const wsPath = configStore.transport?.wsPath ?? '/ws'
    sessionState.client = new WsClient(wsPath)
    sessionState.client.onStatusChange = (status) => {
      wsStatus.value = status
      if (status === 'connected') {
        sendIdentityIfCollaborationEnabled()
        const target = sessionState.reconnectProjectId ?? loadPersistedProject()
        if (target) {
          openProject(target)
        }
      } else if (status === 'disconnected') {
        presenceStore.clear()
      }
    }
    sessionState.client.onEvent = (envelope) => handleIncoming(envelope)
    sessionState.client.connect()
  },

  execute(commandId: string, params: unknown): Promise<CommandResultPayload> {
    if (!sessionState.client) return Promise.reject(new Error('Session not initialized'))
    return sessionState.client.execute(commandId, params)
  },

  sendRaw(type: string, payload: Record<string, unknown>): void {
    if (!sessionState.client) return
    sessionState.client.sendRaw(type, payload)
  },

  async createProject(): Promise<string> {
    const result = await executeChecked('project.create', null)
    const id = readProjectId(result)
    projectId.value = id
    sessionState.reconnectProjectId = id
    persistProject(id)
    dataStore.refreshAll()
    sendIdentityIfCollaborationEnabled()
    return id
  },

  async openProject(id: string): Promise<string> {
    const result = await executeChecked('project.open', { projectId: id })
    const pid = readProjectId(result)
    projectId.value = pid
    sessionState.reconnectProjectId = pid
    persistProject(pid)
    dataStore.refreshAll()
    sendIdentityIfCollaborationEnabled()
    return pid
  },

  async executeCommand(commandId: string, params: unknown): Promise<CommandResultPayload> {
    const result = await executeChecked(commandId, params)
    if (result.status === 'ERROR') {
      dataStore.reportCommandError(commandId, result.error ?? 'Command failed')
    }
    return result
  }
}

function sendIdentityIfCollaborationEnabled(): void {
  if (!configStore.collaboration?.enabled || !sessionState.client) return
  sessionState.client.sendRaw(WS_MESSAGE_TYPES.CLIENT_IDENTITY, {
    name: generateAnonymousName(),
    color: generateColor()
  })
}

function generateAnonymousName(): string {
  const adjectives = ['Swift', 'Calm', 'Bright', 'Bold', 'Kind']
  const nouns = ['Fox', 'Owl', 'Bear', 'Wolf', 'Hawk']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj} ${noun}`
}

function generateColor(): string {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 50%)`
}

async function executeChecked(commandId: string, params: unknown): Promise<CommandResultPayload> {
  if (!sessionState.client) throw new Error('Session not initialized')
  const result = await sessionState.client.execute(commandId, params)
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
      if (payload.type === 'layer.visibility') {
        layerStore.handleLayerEvent({
          pageId: payload.pageId as string,
          layerId: payload.layerId as string,
          visible: payload.visible as boolean
        })
      }
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
    case WS_MESSAGE_TYPES.PRESENCE_LIST: {
      const participants = envelope.payload.participants as Array<{ sessionId: string; name: string; color?: string }> | undefined
      if (Array.isArray(participants)) {
        presenceStore.updateParticipants(participants)
      }
      break
    }
    case WS_MESSAGE_TYPES.PRESENCE_JOIN: {
      const participant = envelope.payload as { sessionId: string; name: string; color?: string }
      if (participant?.sessionId) {
        presenceStore.addParticipant(participant)
      }
      break
    }
    case WS_MESSAGE_TYPES.PRESENCE_LEAVE: {
      const sessionId = envelope.payload.sessionId as string | undefined
      if (sessionId) {
        presenceStore.removeParticipant(sessionId)
        cursorStore.removeCursor(sessionId)
      }
      break
    }
    case WS_MESSAGE_TYPES.CURSOR_UPDATE: {
      const payload = envelope.payload
      const sid = payload.sessionId as string | undefined
      if (sid && configStore.collaboration?.cursorsEnabled) {
        const participant = presenceStore.participants.find(p => p.sessionId === sid)
        cursorStore.updateCursor({
          sessionId: sid,
          name: (payload.name as string) ?? participant?.name ?? 'Anonymous',
          color: (payload.color as string) ?? participant?.color ?? '#999',
          entityType: payload.entityType as string,
          objectId: payload.objectId as string,
          position: payload.position,
          selection: payload.selection as unknown
        })
      }
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
    console.warn(`[Session] project.open failed for ${id}, creating new project`)
    persistProject(null)
    sessionState.reconnectProjectId = null
    sessionStore.createProject().catch((err) => {
      console.error('[Session] auto-create after failed open also failed:', err)
    })
  })
}
