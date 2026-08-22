package runtime.infrastructure.ws

import java.util.UUID
import java.util.concurrent.Executors
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicReference
import java.util.concurrent.locks.ReentrantLock
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.runBlocking
import runtime.application.session.CommandDispatchService
import runtime.domain.command.CommandResult
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.models.Session
import runtime.domain.models.SubscriptionFilter
import runtime.domain.repositories.SessionRepository

class WsSessionHandler(
    private val dispatchService: CommandDispatchService,
    private val sessionRepository: SessionRepository,
    private val activeSessions: MutableMap<String, WsSession>,
    private val messages: Messages,
    private val presenceManager: PresenceManager,
    private val eventPublisher: WsEventPublisher,
    private val collaborationEnabled: Boolean = false,
    private val cursorsEnabled: Boolean = false,
    private val concurrencyLimit: Int = 8,
    private val workspaceId: String? = null,
    private val projectId: String? = null,
    private val wsHandlers: Map<String, runtime.domain.module.WsMessageHandler> = emptyMap()
) {
    suspend fun handle(session: WsSession) {
        val sessionId = UUID.randomUUID().toString()
        sessionRepository.register(Session(sessionId, workspaceId = workspaceId))
        activeSessions[sessionId] = session

        val sendLock = ReentrantLock()
        val queue = LinkedBlockingQueue<WsEnvelope>(concurrencyLimit)
        val boundProjectId = AtomicReference<ProjectId?>(null)
        val executor = Executors.newFixedThreadPool(concurrencyLimit)

        try {
            if (projectId != null) {
                val parsed = runCatching { ProjectId(UUID.fromString(projectId)) }.getOrNull()
                if (parsed != null) {
                    val project = resolveProject(parsed)
                    if (project != null) {
                        sessionRepository.get(sessionId)?.project = project
                        boundProjectId.set(project.id)
                        eventPublisher.bindSession(sessionId, project.id)
                        sendLocked(
                            session, sendLock,
                            WsEnvelope(
                                type = WsMessageType.PROJECT_BOUND.value,
                                payload = mapOf(
                                    "projectId" to project.id.value.toString(),
                                    "workspaceId" to (workspaceId ?: "")
                                )
                            )
                        )
                        if (collaborationEnabled) {
                            try {
                                handlePresenceJoin(sessionId, project.id, null, sendLock)
                            } catch (e: Exception) {
                                e.printStackTrace()
                            }
                        }
                    } else {
                        sendErrorLocked(
                            session, sendLock, null,
                            messages.format(Messages.PROJECT_NOT_FOUND, "projectId" to projectId)
                        )
                    }
                } else {
                    sendErrorLocked(
                        session, sendLock, null,
                        messages.format(Messages.INVALID_PROJECT_ID, "projectId" to projectId)
                    )
                }
            }

            val workers = (1..concurrencyLimit).map {
                executor.submit { workerLoop(queue, session, sessionId, sendLock, boundProjectId) }
            }

            try {
                while (session.isActive) {
                    val text = session.receiveBlocking() ?: break
                    val envelope = WsProtocol.decode(text)
                    queue.offer(envelope)
                }
            } finally {
                repeat(concurrencyLimit) { queue.offer(POISON_PILL) }
                executor.shutdown()
                executor.awaitTermination(5, TimeUnit.SECONDS)
                executor.shutdownNow()
            }
        } catch (_: CancellationException) {
            throw CancellationException("cancelled")
        } catch (e: Exception) {
            sendErrorLocked(
                session, sendLock, null,
                messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to (e.message ?: ""))
            )
        } finally {
            try {
                if (collaborationEnabled && boundProjectId.get() != null) {
                    val identity = presenceManager.leave(boundProjectId.get()!!, sessionId)
                    eventPublisher.unbindSession(sessionId)
                    if (identity != null) {
                        broadcastPresence(boundProjectId.get()!!, WsMessageType.PRESENCE_LEAVE, sessionId, identity)
                    }
                } else {
                    eventPublisher.unbindSession(sessionId)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
            activeSessions.remove(sessionId)
            sessionRepository.remove(sessionId)
        }
    }

    private fun resolveProject(projectId: ProjectId): Project? {
        return dispatchService.getProject(projectId)
    }

    private fun sendLocked(
        session: WsSession,
        lock: ReentrantLock,
        envelope: WsEnvelope
    ) {
        lock.lock()
        try {
            session.sendBlocking(WsProtocol.encode(envelope))
        } finally {
            lock.unlock()
        }
    }

    private sealed interface HandleResult {
        data object Ok : HandleResult
        data class ProjectBound(val projectId: ProjectId) : HandleResult
    }

    internal fun workerLoop(
        queue: LinkedBlockingQueue<WsEnvelope>,
        session: WsSession,
        sessionId: String,
        sendLock: ReentrantLock,
        boundProjectId: AtomicReference<ProjectId?>
    ) {
        while (true) {
            val envelope = queue.take()
            if (envelope === POISON_PILL) break
            try {
                val result = handleEnvelope(session, sessionId, envelope, sendLock)
                if (result is HandleResult.ProjectBound) {
                    boundProjectId.set(result.projectId)
                }
            } catch (e: Exception) {
                sendErrorLocked(
                    session, sendLock, envelope,
                    messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to (e.message ?: ""))
                )
            }
        }
    }

    private fun handleEnvelope(
        session: WsSession,
        sessionId: String,
        envelope: WsEnvelope,
        sendLock: ReentrantLock
    ): HandleResult {
        when (envelope.type) {
            WsMessageType.COMMAND_EXECUTE.value -> {
                val commandId = envelope.payload["commandId"] as? String
                    ?: return HandleResult.Ok.also {
                        sendErrorLocked(session, sendLock, envelope, messages[Messages.MISSING_COMMAND_ID])
                    }
                val params = envelope.payload["params"]

                val result = runBlocking { dispatchService.dispatch(sessionId, commandId, params) }

                when (result) {
                    is CommandDispatchService.DispatchResult.Result ->
                        sendCommandResult(session, sendLock, envelope, result.commandResult)
                    is CommandDispatchService.DispatchResult.Protocol ->
                        sendErrorLocked(session, sendLock, envelope, result.message)
                }

                if (result is CommandDispatchService.DispatchResult.Result) {
                    @Suppress("UNCHECKED_CAST")
                    val value = result.commandResult.value as? Map<String, Any?>
                    val projectIdStr = value?.get("projectId") as? String
                    if (projectIdStr != null) {
                        val pid = try {
                            ProjectId(UUID.fromString(projectIdStr))
                        } catch (_: Exception) { null }
                        if (pid != null) {
                            eventPublisher.bindSession(sessionId, pid)
                            if (collaborationEnabled) {
                                handlePresenceJoin(sessionId, pid, null, sendLock)
                            }
                            return HandleResult.ProjectBound(pid)
                        }
                    }
                }
                return HandleResult.Ok
            }
            WsMessageType.SUBSCRIBE.value -> {
                val entityType = envelope.payload["entityType"] as? String
                if (entityType == null) {
                    sendErrorLocked(session, sendLock, envelope, "Missing entityType for subscribe")
                    return HandleResult.Ok
                }
                @Suppress("UNCHECKED_CAST")
                val filter = envelope.payload["filter"] as? Map<String, Any?> ?: emptyMap()
                sessionRepository.get(sessionId)?.addSubscription(
                    SubscriptionFilter(entityType = entityType, filter = filter)
                )
                return HandleResult.Ok
            }
            WsMessageType.UNSUBSCRIBE.value -> {
                val entityType = envelope.payload["entityType"] as? String
                if (entityType == null) {
                    sendErrorLocked(session, sendLock, envelope, "Missing entityType for unsubscribe")
                    return HandleResult.Ok
                }
                @Suppress("UNCHECKED_CAST")
                val filter = envelope.payload["filter"] as? Map<String, Any?> ?: emptyMap()
                sessionRepository.get(sessionId)?.removeSubscription(entityType, filter)
                return HandleResult.Ok
            }
            WsMessageType.CLIENT_IDENTITY.value -> {
                if (!collaborationEnabled) return HandleResult.Ok
                val name = envelope.payload["name"] as? String ?: "Anonymous"
                val color = envelope.payload["color"] as? String
                val pid = resolveSessionProject(sessionId)
                if (pid != null) {
                    handlePresenceJoin(sessionId, pid, envelope, sendLock, name, color)
                }
                return HandleResult.Ok
            }
            WsMessageType.CURSOR_UPDATE.value -> {
                if (!cursorsEnabled || !collaborationEnabled) return HandleResult.Ok
                val pid = resolveSessionProject(sessionId) ?: return HandleResult.Ok
                @Suppress("UNCHECKED_CAST")
                val enrichedPayload = LinkedHashMap(envelope.payload as? Map<String, Any?> ?: emptyMap())
                enrichedPayload["sessionId"] = sessionId
                val enriched = WsEnvelope(envelope.type, envelope.requestId, enrichedPayload)
                broadcastToProjectExcept(pid, sessionId, enriched)
                return HandleResult.Ok
            }
            else -> {
                val handler = wsHandlers[envelope.type]
                if (handler != null) {
                    @Suppress("UNCHECKED_CAST")
                    val payload = envelope.payload as? Map<String, Any?> ?: emptyMap()
                    val response = runBlocking { handler.handle(payload) }
                    if (response != null) {
                        sendLocked(session, sendLock, WsEnvelope(
                            type = envelope.type + ".response",
                            requestId = envelope.requestId,
                            payload = response
                        ))
                    }
                    return HandleResult.Ok
                }
                sendErrorLocked(session, sendLock, envelope, messages.format(Messages.UNKNOWN_MESSAGE_TYPE, "type" to envelope.type))
                return HandleResult.Ok
            }
        }
    }

    private fun handlePresenceJoin(
        sessionId: String,
        projectId: ProjectId,
        identityEnvelope: WsEnvelope?,
        sendLock: ReentrantLock,
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
        val self = activeSessions[sessionId]
        if (self != null) {
            sendLocked(self, sendLock, listEnvelope)
        }
        broadcastToProjectExcept(projectId, sessionId, listEnvelope)
    }

    private fun broadcastPresence(
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
        broadcastToProjectExcept(projectId, sessionId, envelope)
    }

    private fun broadcastToProject(projectId: ProjectId, envelope: WsEnvelope) {
        eventPublisher.broadcastToProject(projectId, envelope)
    }

    private fun broadcastToProjectExcept(projectId: ProjectId, exceptSessionId: String, envelope: WsEnvelope) {
        val sessions = dispatchService.getSessionsForProject(projectId)
        for (s in sessions) {
            if (s.sessionId == exceptSessionId) continue
            eventPublisher.sendToSession(s.sessionId, envelope)
        }
    }

    private fun resolveSessionProject(sessionId: String): ProjectId? {
        val session = sessionRepository.get(sessionId) ?: return null
        return session.project?.id
    }

    private fun sendCommandResult(
        session: WsSession,
        sendLock: ReentrantLock,
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
        if (result.fieldErrors.isNotEmpty()) {
            payload["fieldErrors"] = result.fieldErrors.map { fe ->
                mapOf(
                    "field" to fe.field,
                    "code" to fe.code,
                    "message" to fe.message
                )
            }
        }

        val response = WsEnvelope(
            type = WsMessageType.COMMAND_RESULT.value,
            requestId = envelope.requestId,
            payload = payload
        )
        sendLocked(session, sendLock, response)
    }

    private fun sendErrorLocked(
        session: WsSession,
        sendLock: ReentrantLock,
        envelope: WsEnvelope?,
        message: String
    ) {
        val response = WsEnvelope(
            type = WsMessageType.ERROR.value,
            requestId = envelope?.requestId,
            payload = mapOf("message" to message)
        )
        sendLocked(session, sendLock, response)
    }

    companion object {
        private val POISON_PILL = WsEnvelope(type = "__poison__", payload = emptyMap())
    }
}
