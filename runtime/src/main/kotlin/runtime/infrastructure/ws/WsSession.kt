package runtime.infrastructure.ws

/**
 * Framework-agnostic WebSocket session abstraction.
 * Decouples the application layer from any specific WebSocket implementation (Ktor, Quarkus, etc.).
 */
interface WsSession {
    /** Send a text message to the client. */
    suspend fun send(text: String)

    /** Receive the next text message from the client. Suspends until a message arrives. */
    suspend fun receive(): String?

    /** Whether the session is still open. */
    val isActive: Boolean

    /** Close the session. */
    suspend fun close()

    /** Blocking send — for use from Java threads / non-suspend contexts. */
    fun sendBlocking(text: String)

    /** Blocking receive — returns null on timeout or if closed. */
    fun receiveBlocking(): String?

    /** Blocking close. */
    fun closeBlocking()
}
