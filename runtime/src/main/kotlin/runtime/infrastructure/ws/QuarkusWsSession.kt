package runtime.infrastructure.ws

import io.quarkus.websockets.next.WebSocketConnection
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean
import kotlinx.coroutines.CompletableDeferred

/**
 * Quarkus adapter for [WsSession].
 * Bridges Quarkus's callback-based WebSocket to a channel-based receive API.
 */
class QuarkusWsSession(
    val id: String,
    val connection: WebSocketConnection,
    val closeDeferred: CompletableDeferred<Unit> = CompletableDeferred()
) : WsSession {

    internal val incoming = LinkedBlockingQueue<String>(1024)
    internal val closed = AtomicBoolean(false)

    override suspend fun send(text: String) {
        connection.sendTextAndAwait(text)
    }

    override suspend fun receive(): String? {
        if (closed.get()) return null
        return incoming.poll(1, TimeUnit.HOURS)
    }

    override val isActive: Boolean
        get() = connection.isOpen

    override suspend fun close() {
        closed.set(true)
        connection.closeAndAwait()
        closeDeferred.complete(Unit)
    }

    override fun sendBlocking(text: String) {
        if (!closed.get() && connection.isOpen) {
            connection.sendText(text).await()
        }
    }

    override fun receiveBlocking(): String? {
        if (closed.get()) return null
        return incoming.poll(100, TimeUnit.MILLISECONDS)
    }

    override fun closeBlocking() {
        closed.set(true)
        connection.close()
        closeDeferred.complete(Unit)
    }
}
