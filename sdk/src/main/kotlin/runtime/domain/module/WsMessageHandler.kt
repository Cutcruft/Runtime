package runtime.domain.module

/**
 * V8 — a WS message handler registered by a module for a custom message type.
 * Receives the request payload and returns a response payload (or `null` for no
 * response). Suspending to allow async handling.
 */
fun interface WsMessageHandler {
    suspend fun handle(payload: Map<String, Any?>): Map<String, Any?>?
}
