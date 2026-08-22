package runtime.infrastructure.ws

import io.quarkus.websockets.next.OnClose
import io.quarkus.websockets.next.OnError
import io.quarkus.websockets.next.OnOpen
import io.quarkus.websockets.next.OnTextMessage
import io.quarkus.websockets.next.WebSocket
import io.quarkus.websockets.next.WebSocketConnection
import jakarta.inject.Singleton
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import runtime.infrastructure.web.RuntimeState

@Singleton
@WebSocket(path = "/ws/{workspace}/{projectId}")
class WsResource {

    private val connections = ConcurrentHashMap<WebSocketConnection, ConnectionState>()

    private class ConnectionState(
        val sessionId: String,
        val session: QuarkusWsSession,
        val scope: CoroutineScope
    )

    @OnOpen
    fun onOpen(connection: WebSocketConnection) {
        val sessionId = UUID.randomUUID().toString()
        val workspaceId = connection.pathParam("workspace")
        val projectId = connection.pathParam("projectId")
        val session = QuarkusWsSession(sessionId, connection)
        val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

        connections[connection] = ConnectionState(sessionId, session, scope)

        scope.launch {
            val registry = RuntimeState.registry
            val messages = RuntimeState.messages
            val ws = registry.get(workspaceId) ?: registry.default()

            WsSessionHandler(
                ws.dispatchService,
                ws.runtime.sessionRepository,
                ws.activeSessions,
                messages,
                ws.presenceManager,
                ws.eventPublisher,
                collaborationEnabled = ws.runtime.config.collaboration.enabled,
                cursorsEnabled = ws.runtime.config.collaboration.cursorsEnabled,
                wsHandlers = ws.wsHandlers,
                concurrencyLimit = ws.runtime.config.command.wsConcurrency ?: 8,
                workspaceId = workspaceId,
                projectId = projectId
            ).handle(session)
        }
    }

    @OnTextMessage
    fun onTextMessage(connection: WebSocketConnection, message: String) {
        val state = connections[connection] ?: return
        state.session.incoming.offer(message)
    }

    @OnClose
    fun onClose(connection: WebSocketConnection) {
        val state = connections.remove(connection) ?: return
        state.session.closed.set(true)
        state.session.closeDeferred.complete(Unit)
    }

    @OnError
    fun onError(connection: WebSocketConnection, error: Throwable) {
        connections.remove(connection)
        error.printStackTrace()
    }
}
