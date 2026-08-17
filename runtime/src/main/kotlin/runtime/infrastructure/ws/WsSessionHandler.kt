package runtime.infrastructure.ws

import io.ktor.websocket.DefaultWebSocketSession
import io.ktor.websocket.Frame
import io.ktor.websocket.readText
import java.util.UUID
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.channels.ClosedReceiveChannelException
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.consumeAsFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import runtime.application.session.CommandDispatchService
import runtime.domain.command.CommandResult
import runtime.domain.models.Messages
import runtime.domain.models.ProjectId
import runtime.domain.models.Session
import runtime.domain.repositories.SessionRepository

class WsSessionHandler(
    private val dispatchService: CommandDispatchService,
    private val sessionRepository: SessionRepository,
    private val activeSessions: MutableMap<String, DefaultWebSocketSession>,
    private val messages: Messages,
    private val presenceManager: PresenceManager,
    private val eventPublisher: WsEventPublisher,
    private val collaborationEnabled: Boolean = false,
    private val cursorsEnabled: Boolean = false,
    private val concurrencyLimit: Int = 8
) {
    suspend fun handle(session: DefaultWebSocketSession) {
        val sessionId = UUID.randomUUID().toString()
        sessionRepository.register(Session(sessionId))
        activeSessions[sessionId] = session

        val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
        val sendMutex = Mutex()
        val channel = Channel<WsEnvelope>(capacity = concurrencyLimit)
        var boundProjectId: ProjectId? = null

        try {
            val workers = (1..concurrencyLimit).map {
                scope.launch {
                    for (envelope in channel) {
                        try {
                            val result = handleEnvelope(session, sessionId, envelope, sendMutex)
                            if (result is HandleResult.ProjectBound) {
                                boundProjectId = result.projectId
                            }
                        } catch (e: Exception) {
                            sendErrorLocked(
                                session, sendMutex, envelope,
                                messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to (e.message ?: ""))
                            )
                        }
                    }
                }
            }

            try {
                session.incoming.consumeAsFlow().collect { frame ->
                    if (frame is Frame.Text) {
                        val envelope = WsProtocol.decode(frame.readText())
                        channel.send(envelope)
                    }
                }
            } finally {
                channel.close()
                workers.forEach { it.cancel() }
            }
        } catch (e: ClosedReceiveChannelException) {
            // Session closed normally
        } catch (e: Exception) {
            sendErrorLocked(
                session, sendMutex, null,
                messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to (e.message ?: ""))
            )
        } finally {
            if (collaborationEnabled && boundProjectId != null) {
                val identity = presenceManager.leave(boundProjectId!!, sessionId)
                eventPublisher.unbindSession(sessionId)
                if (identity != null) {
                    broadcastPresence(boundProjectId!!, WsMessageType.PRESENCE_LEAVE, sessionId, identity)
                }
            } else {
                eventPublisher.unbindSession(sessionId)
            }
            scope.cancel()
            activeSessions.remove(sessionId)
            sessionRepository.remove(sessionId)
        }
    }

    private sealed interface HandleResult {
        data object Ok : HandleResult
        data class ProjectBound(val projectId: ProjectId) : HandleResult
    }

    private suspend fun handleEnvelope(
        session: DefaultWebSocketSession,
        sessionId: String,
        envelope: WsEnvelope,
        sendMutex: Mutex
    ): HandleResult {
        when (envelope.type) {
            WsMessageType.COMMAND_EXECUTE.value -> {
                val commandId = envelope.payload["commandId"] as? String
                    ?: return HandleResult.Ok.also {
                        sendErrorLocked(session, sendMutex, envelope, messages[Messages.MISSING_COMMAND_ID])
                    }
                val params = envelope.payload["params"]

                val result = dispatchService.dispatch(sessionId, commandId, params)

                when (result) {
                    is CommandDispatchService.DispatchResult.Result ->
                        sendCommandResult(session, sendMutex, envelope, result.commandResult)
                    is CommandDispatchService.DispatchResult.Protocol ->
                        sendErrorLocked(session, sendMutex, envelope, result.message)
                }

                if (result is CommandDispatchService.DispatchResult.Result) {
                    @Suppress("UNCHECKED_CAST")
                    val value = result.commandResult.value as? Map<String, Any?>
                    val projectIdStr = value?.get("projectId") as? String
                    if (projectIdStr != null) {
                        val projectId = try {
                            ProjectId(UUID.fromString(projectIdStr))
                        } catch (_: Exception) { null }
                        if (projectId != null) {
                            eventPublisher.bindSession(sessionId, projectId)
                            if (collaborationEnabled) {
                                handlePresenceJoin(sessionId, projectId, null, sendMutex)
                            }
                            return HandleResult.ProjectBound(projectId)
                        }
                    }
                }
                return HandleResult.Ok
            }
            WsMessageType.CLIENT_IDENTITY.value -> {
                if (!collaborationEnabled) return HandleResult.Ok
                val name = envelope.payload["name"] as? String ?: "Anonymous"
                val color = envelope.payload["color"] as? String
                val projectId = resolveSessionProject(sessionId)
                if (projectId != null) {
                    handlePresenceJoin(sessionId, projectId, envelope, sendMutex, name, color)
                }
                return HandleResult.Ok
            }
            WsMessageType.CURSOR_UPDATE.value -> {
                if (!cursorsEnabled || !collaborationEnabled) return HandleResult.Ok
                val projectId = resolveSessionProject(sessionId) ?: return HandleResult.Ok
                val enrichedPayload = LinkedHashMap(envelope.payload as? Map<String, Any?> ?: emptyMap())
                enrichedPayload["sessionId"] = sessionId
                val enriched = WsEnvelope(envelope.type, envelope.requestId, enrichedPayload)
                broadcastToProjectExcept(projectId, sessionId, enriched)
                return HandleResult.Ok
            }
            else -> {
                sendErrorLocked(session, sendMutex, envelope, messages.format(Messages.UNKNOWN_MESSAGE_TYPE, "type" to envelope.type))
                return HandleResult.Ok
            }
        }
    }

    private suspend fun handlePresenceJoin(
        sessionId: String,
        projectId: ProjectId,
        identityEnvelope: WsEnvelope?,
        sendMutex: Mutex,
        name: String? = null,
        color: String? = null
    ) {
        val identityName = name ?: (identityEnvelope?.payload?.get("name") as? String) ?: "Anonymous"
        val identityColor = color ?: identityEnvelope?.payload?.get("color") as? String
        val identity = ParticipantIdentity(name = identityName, color = identityColor)
        presenceManager.join(projectId, sessionId, identity)

        val participants = presenceManager.participants(projectId)
        val listEnvelope = WsEnvelope(
            type = WsMessageType.PRESENCE_LIST.value,
            payload = mapOf(
                "participants" to participants.map { p ->
                    mapOf(
                        "sessionId" to p.sessionId,
                        "name" to p.identity.name,
                        "color" to p.identity.color
                    )
                }
            )
        )
        broadcastToProject(projectId, listEnvelope)
    }

    private suspend fun broadcastPresence(
        projectId: ProjectId,
        type: WsMessageType,
        sessionId: String,
        identity: ParticipantIdentity
    ) {
        val envelope = WsEnvelope(
            type = type.value,
            payload = mapOf(
                "sessionId" to sessionId,
                "name" to identity.name,
                "color" to identity.color
            )
        )
        broadcastToProject(projectId, envelope)
    }

    private suspend fun broadcastToProject(projectId: ProjectId, envelope: WsEnvelope) {
        eventPublisher.broadcastToProject(projectId, envelope)
    }

    private suspend fun broadcastToProjectExcept(projectId: ProjectId, exceptSessionId: String, envelope: WsEnvelope) {
        val sessions = dispatchService.getSessionsForProject(projectId)
        for (session in sessions) {
            if (session.sessionId == exceptSessionId) continue
            eventPublisher.sendToSession(session.sessionId, envelope)
        }
    }

    private fun resolveSessionProject(sessionId: String): ProjectId? {
        val session = sessionRepository.get(sessionId) ?: return null
        return session.project?.id
    }

    private suspend fun sendCommandResult(
        session: DefaultWebSocketSession,
        sendMutex: Mutex,
        envelope: WsEnvelope,
        result: CommandResult
    ) {
        val payload = LinkedHashMap<String, Any?>()
        payload["status"] = result.status.name
        result.value?.let { payload["value"] = it }
        payload["references"] = result.references.map { ref ->
            mapOf(
                "entityType" to ref.entityType.value,
                "objectId" to ref.objectId.value.toString()
            )
        }
        result.error?.let { payload["error"] = it }

        val response = WsEnvelope(
            type = WsMessageType.COMMAND_RESULT.value,
            requestId = envelope.requestId,
            payload = payload
        )
        sendMutex.withLock { session.send(Frame.Text(WsProtocol.encode(response))) }
    }

    private suspend fun sendErrorLocked(
        session: DefaultWebSocketSession,
        sendMutex: Mutex,
        envelope: WsEnvelope?,
        message: String
    ) {
        val response = WsEnvelope(
            type = WsMessageType.ERROR.value,
            requestId = envelope?.requestId,
            payload = mapOf("message" to message)
        )
        sendMutex.withLock { session.send(Frame.Text(WsProtocol.encode(response))) }
    }
}
