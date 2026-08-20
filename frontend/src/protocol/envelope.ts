export const WS_MESSAGE_TYPES = {
  COMMAND_EXECUTE: 'command.execute',
  COMMAND_RESULT: 'command.result',
  PROJECT_EVENT: 'project.event',
  PROJECT_BOUND: 'project.bound',
  WORKSPACE_STATE: 'workspace.state',
  OBJECT_CHANGED: 'object.changed',
  ERROR: 'error',
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  COMMANDS_RELOADED: 'commands.reloaded',
  PRESENCE_JOIN: 'presence.join',
  PRESENCE_LEAVE: 'presence.leave',
  PRESENCE_LIST: 'presence.list',
  CLIENT_IDENTITY: 'client.identity',
  CURSOR_UPDATE: 'cursor.update'
} as const

export interface WsEnvelope {
  type: string
  requestId?: string
  payload: Record<string, unknown>
}

export interface FieldError {
  field: string
  code: string
  message: string
}

export interface CommandResultPayload {
  status: 'SUCCESS' | 'ERROR'
  value?: unknown
  references?: Array<{ entityType: string; objectId: string }>
  error?: string
  fieldErrors?: FieldError[]
}

export interface ProjectBoundPayload {
  projectId: string
  workspaceId?: string
}

export interface CommandsReloadedPayload {
  commands?: Array<Record<string, unknown>>
  entities?: string[]
}

export interface ParticipantPayload {
  sessionId: string
  name: string
  color?: string
}

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
