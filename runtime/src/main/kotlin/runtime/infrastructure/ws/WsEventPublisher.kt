package runtime.infrastructure.ws

import io.ktor.websocket.DefaultWebSocketSession
import io.ktor.websocket.Frame
import io.ktor.websocket.send
import runtime.application.event.EventPublisher
import runtime.application.session.SessionManager
import runtime.domain.models.RuntimeEvent

class WsEventPublisher(
    private val sessionManager: SessionManager,
    private val activeSessions: MutableMap<String, DefaultWebSocketSession>
) : EventPublisher {

    override suspend fun publish(event: RuntimeEvent) {
        val sessions = sessionManager.sessionsForProject(event.projectId)
        for (session in sessions) {
            val webSocket = activeSessions[session.sessionId] ?: continue
            val envelope = when (event) {
                is RuntimeEvent.ObjectChanged -> WsEnvelope(
                    type = WsMessageType.OBJECT_CHANGED.value,
                    payload = mapOf(
                        "entityType" to event.entityType.value,
                        "objectId" to event.objectId.value.toString(),
                        "value" to event.value
                    )
                )
                is RuntimeEvent.ProjectEvent -> WsEnvelope(
                    type = WsMessageType.PROJECT_EVENT.value,
                    payload = event.payload + ("type" to event.type)
                )
            }
            webSocket.send(Frame.Text(WsProtocol.encode(envelope)))
        }
    }
}
