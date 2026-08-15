import { WS_MESSAGE_TYPES, decodeEnvelope, encodeEnvelope, type CommandResultPayload, type WsEnvelope } from './envelope'

export type WsStatus = 'connecting' | 'connected' | 'disconnected'

interface PendingRequest {
  resolve: (payload: CommandResultPayload) => void
  reject: (error: string) => void
  timer: number
}

const DEFAULT_TIMEOUT_MS = 20000
const RECONNECT_BASE_MS = 1000
const RECONNECT_MAX_MS = 10000

export class WsClient {
  private socket: WebSocket | null = null
  private readonly pending = new Map<string, PendingRequest>()
  private reconnectAttempt = 0
  private reconnectTimer: number | null = null
  private closed = false
  private url: string
  private status: WsStatus = 'disconnected'

  onStatusChange: ((status: WsStatus) => void) | null = null
  onEvent: ((envelope: WsEnvelope) => void) | null = null

  constructor(wsPath: string) {
    this.url = buildWsUrl(wsPath)
  }

  connect(): void {
    this.closed = false
    this.setStatus('connecting')
    try {
      const socket = new WebSocket(this.url)
      this.socket = socket
      socket.onopen = () => this.handleOpen()
      socket.onmessage = (event) => this.handleMessage(event.data)
      socket.onerror = () => {
        /* onclose follows */
      }
      socket.onclose = () => this.handleClose()
    } catch {
      this.handleClose()
    }
  }

  close(): void {
    this.closed = true
    this.clearReconnectTimer()
    this.socket?.close()
    this.socket = null
    this.rejectAll('Connection closed')
    this.setStatus('disconnected')
  }

  getStatus(): WsStatus {
    return this.status
  }

  execute(commandId: string, params: unknown, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<CommandResultPayload> {
    return new Promise<CommandResultPayload>((resolve, reject) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        reject('Not connected')
        return
      }
      const requestId = generateRequestId()
      const timer = window.setTimeout(() => {
        this.pending.delete(requestId)
        reject(`Command '${commandId}' timed out`)
      }, timeoutMs)
      this.pending.set(requestId, { resolve, reject, timer })
      this.socket.send(
        encodeEnvelope({
          type: WS_MESSAGE_TYPES.COMMAND_EXECUTE,
          requestId,
          payload: { commandId, params }
        })
      )
    })
  }

  private handleOpen(): void {
    this.reconnectAttempt = 0
    this.setStatus('connected')
  }

  private handleMessage(data: unknown): void {
    let envelope: WsEnvelope
    try {
      envelope = decodeEnvelope(String(data))
    } catch {
      return
    }

    if (envelope.type === WS_MESSAGE_TYPES.COMMAND_RESULT) {
      this.resolvePending(envelope.requestId, envelope.payload as unknown as CommandResultPayload)
      return
    }
    if (envelope.type === WS_MESSAGE_TYPES.ERROR) {
      this.rejectPending(envelope.requestId, (envelope.payload.message as string) ?? 'Unknown error')
    }
    this.onEvent?.(envelope)
  }

  private handleClose(): void {
    this.socket = null
    this.rejectAll('Connection lost')
    this.setStatus('disconnected')
    if (this.closed) return
    this.scheduleReconnect()
  }

  private scheduleReconnect(): void {
    this.clearReconnectTimer()
    const delay = Math.min(RECONNECT_BASE_MS * 2 ** this.reconnectAttempt, RECONNECT_MAX_MS)
    this.reconnectAttempt += 1
    this.reconnectTimer = window.setTimeout(() => this.connect(), delay)
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private resolvePending(requestId: string | undefined, payload: CommandResultPayload): void {
    if (!requestId) return
    const pending = this.pending.get(requestId)
    if (!pending) return
    this.pending.delete(requestId)
    window.clearTimeout(pending.timer)
    pending.resolve(payload)
  }

  private rejectPending(requestId: string | undefined, error: string): void {
    if (!requestId) return
    const pending = this.pending.get(requestId)
    if (!pending) return
    this.pending.delete(requestId)
    window.clearTimeout(pending.timer)
    pending.reject(error)
  }

  private rejectAll(error: string): void {
    this.pending.forEach((pending) => {
      window.clearTimeout(pending.timer)
      pending.reject(error)
    })
    this.pending.clear()
  }

  private setStatus(status: WsStatus): void {
    this.status = status
    this.onStatusChange?.(status)
  }
}

function buildWsUrl(wsPath: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}${wsPath}`
}

function generateRequestId(): string {
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join('')
  ].join('-')
}
