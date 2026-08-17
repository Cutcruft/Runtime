export const WS_MESSAGE_TYPES = {
  COMMAND_EXECUTE: 'command.execute',
  COMMAND_RESULT: 'command.result',
  PROJECT_EVENT: 'project.event',
  OBJECT_CHANGED: 'object.changed',
  ERROR: 'error',
  PRESENCE_JOIN: 'presence.join',
  PRESENCE_LEAVE: 'presence.leave',
  PRESENCE_LIST: 'presence.list',
  CLIENT_IDENTITY: 'client.identity',
  CURSOR_UPDATE: 'cursor.update'
} as const

export type WsMessageType = (typeof WS_MESSAGE_TYPES)[keyof typeof WS_MESSAGE_TYPES]

export interface WsEnvelope {
  type: string
  requestId?: string
  payload: Record<string, unknown>
}

export interface CommandResultPayload {
  status: 'SUCCESS' | 'ERROR'
  value?: unknown
  references?: Array<{ entityType: string; objectId: string }>
  error?: string
}

export interface ObjectChangedPayload {
  entityType: string
  objectId: string
  value?: unknown
}

export interface ProjectEventPayload {
  type: string
  projectId?: string
  [key: string]: unknown
}

export interface ErrorPayload {
  message: string
}

export interface ParticipantPayload {
  sessionId: string
  name: string
  color?: string
}

export interface PresenceListPayload {
  participants: ParticipantPayload[]
}

export interface CursorUpdatePayload {
  entityType: string
  objectId: string
  position: unknown
  selection?: unknown
}

export type EventKind =
  | 'object.changed'
  | 'project.event'
  | 'error'
  | 'presence.join'
  | 'presence.leave'
  | 'presence.list'
  | 'cursor.update'
  | 'navigation.request'
  | 'command.request'
  | 'shortcut.triggered'

export interface RuntimeEvent {
  kind: string
  payload: Record<string, unknown>
}

export function decodeEnvelope(raw: string): WsEnvelope {
  const message = JSON.parse(raw) as Partial<WsEnvelope>
  return {
    type: message.type ?? 'unknown',
    requestId: message.requestId,
    payload: message.payload ?? {}
  }
}

export function encodeEnvelope(envelope: WsEnvelope): string {
  return JSON.stringify({
    type: envelope.type,
    ...(envelope.requestId ? { requestId: envelope.requestId } : {}),
    payload: envelope.payload
  })
}
