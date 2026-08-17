package runtime.infrastructure.ws

import java.util.concurrent.ConcurrentHashMap
import io.ktor.websocket.DefaultWebSocketSession
import io.ktor.websocket.Frame
import io.ktor.websocket.send
import runtime.application.event.EventPublisher
import runtime.application.session.SessionManager
import runtime.domain.models.ProjectId
import runtime.domain.models.RuntimeEvent

class WsEventPublisher(
    private val sessionManager: SessionManager,
    private val activeSessions: MutableMap<String, DefaultWebSocketSession>,
    private val presenceManager: PresenceManager,
    private val collaborationEnabled: Boolean = false
) : EventPublisher {

    private val sessionToProject = ConcurrentHashMap<String, ProjectId>()

    fun bindSession(sessionId: String, projectId: ProjectId) {
        sessionToProject[sessionId] = projectId
    }

    fun unbindSession(sessionId: String) {
        sessionToProject.remove(sessionId)
    }

    override suspend fun publish(event: RuntimeEvent) {
        if (!collaborationEnabled) return
        when (event) {
            is RuntimeEvent.ObjectChanged -> {
                val sessions = sessionManager.sessionsForProject(event.projectId)
                for (session in sessions) {
                    if (session.sessionId == event.senderSessionId) continue
                    val webSocket = activeSessions[session.sessionId] ?: continue
                    val envelope = WsEnvelope(
                        type = WsMessageType.OBJECT_CHANGED.value,
                        payload = mapOf(
                            "entityType" to event.entityType.value,
                            "objectId" to event.objectId.value.toString(),
                            "value" to event.value
                        )
                    )
                    webSocket.send(Frame.Text(WsProtocol.encode(envelope)))
                }
            }
            is RuntimeEvent.ProjectEvent -> {
                val sessions = sessionManager.sessionsForProject(event.projectId)
                for (session in sessions) {
                    val webSocket = activeSessions[session.sessionId] ?: continue
                    val envelope = WsEnvelope(
                        type = WsMessageType.PROJECT_EVENT.value,
                        payload = event.payload + ("type" to event.type)
                    )
                    webSocket.send(Frame.Text(WsProtocol.encode(envelope)))
                }
            }
        }
    }

    suspend fun broadcastToProject(projectId: ProjectId, envelope: WsEnvelope) {
        val sessions = sessionManager.sessionsForProject(projectId)
        for (session in sessions) {
            val webSocket = activeSessions[session.sessionId] ?: continue
            webSocket.send(Frame.Text(WsProtocol.encode(envelope)))
        }
    }

    suspend fun sendToSession(sessionId: String, envelope: WsEnvelope) {
        val webSocket = activeSessions[sessionId] ?: return
        webSocket.send(Frame.Text(WsProtocol.encode(envelope)))
    }
}
