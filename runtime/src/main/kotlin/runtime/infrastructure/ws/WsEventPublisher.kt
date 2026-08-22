package runtime.infrastructure.ws

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.util.concurrent.ConcurrentHashMap
import runtime.application.event.EventPublisher
import runtime.application.session.SessionManager
import runtime.domain.models.ProjectId
import runtime.domain.models.RuntimeEvent
import runtime.domain.models.Session

class WsEventPublisher(
    private val sessionManager: SessionManager,
    private val activeSessions: MutableMap<String, WsSession>,
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
        publishBlocking(event)
    }

    fun publishBlocking(event: RuntimeEvent) {
        if (!collaborationEnabled) return
        when (event) {
            is RuntimeEvent.ObjectChanged -> {
                val sessions = sessionManager.sessionsForProject(event.projectId)
                for (session in sessions) {
                    val webSocket = activeSessions[session.sessionId] ?: continue
                    if (!sessionAccepts(session, event)) continue
                    val envelope = WsEnvelope(
                        type = WsMessageType.OBJECT_CHANGED.value,
                        payload = mapOf(
                            "entityType" to event.entityType.value,
                            "objectId" to event.objectId.value.toString(),
                            "value" to event.value
                        )
                    )
                    webSocket.sendBlocking(WsProtocol.encode(envelope))
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
                    webSocket.sendBlocking(WsProtocol.encode(envelope))
                }
            }
        }
    }

    private fun sessionAccepts(session: Session, event: RuntimeEvent.ObjectChanged): Boolean {
        return acceptsSubscription(session, event.entityType.value, event.value)
    }

    companion object {
        private val mapper = ObjectMapper().registerModule(KotlinModule.Builder().build())

        private fun asMap(value: Any?): Map<*, *>? {
            return when (value) {
                is Map<*, *> -> value
                is List<*> -> null
                null -> null
                else -> runCatching { mapper.convertValue(value, Map::class.java) as Map<*, *> }.getOrNull()
            }
        }

        fun acceptsSubscription(session: Session, entityType: String, value: Any?): Boolean {
            val filters = session.subscriptions[entityType] ?: return false
            if (filters.isEmpty()) return true
            val map = asMap(value) ?: return filters.any { it.filter.isEmpty() }
            return filters.any { filter ->
                if (filter.filter.isEmpty()) return@any true
                filter.filter.all { (key, expected) ->
                    map[key]?.toString() == expected?.toString()
                }
            }
        }
    }

    fun broadcastToProject(projectId: ProjectId, envelope: WsEnvelope) {
        val sessions = sessionManager.sessionsForProject(projectId)
        for (session in sessions) {
            val webSocket = activeSessions[session.sessionId] ?: continue
            webSocket.sendBlocking(WsProtocol.encode(envelope))
        }
    }

    fun sendToSession(sessionId: String, envelope: WsEnvelope) {
        val webSocket = activeSessions[sessionId] ?: return
        webSocket.sendBlocking(WsProtocol.encode(envelope))
    }

    fun broadcastCommandsReloaded(commands: List<Map<String, Any?>>, entities: List<String>) {
        val envelope = WsEnvelope(
            type = WsMessageType.COMMANDS_RELOADED.value,
            payload = mapOf("commands" to commands, "entities" to entities)
        )
        for (webSocket in activeSessions.values) {
            webSocket.sendBlocking(WsProtocol.encode(envelope))
        }
    }
}
