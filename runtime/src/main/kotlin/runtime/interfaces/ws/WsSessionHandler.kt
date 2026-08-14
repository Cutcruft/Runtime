package runtime.interfaces.ws

import runtime.application.command.CommandExecutor
import runtime.application.project.ProjectService
import runtime.domain.command.CommandResult
import runtime.domain.project.ProjectId
import runtime.domain.session.Session
import runtime.domain.session.SessionRegistry
import io.ktor.websocket.DefaultWebSocketSession
import io.ktor.websocket.Frame
import io.ktor.websocket.readText
import kotlinx.coroutines.channels.ClosedReceiveChannelException
import kotlinx.coroutines.flow.consumeAsFlow
import kotlinx.coroutines.flow.collect
import java.util.UUID

class WsSessionHandler(
    private val projectService: ProjectService,
    private val commandExecutor: CommandExecutor,
    private val sessionRegistry: SessionRegistry
) {
    suspend fun handle(session: DefaultWebSocketSession) {
        val sessionId = UUID.randomUUID().toString()
        val sessionObj = Session(sessionId = sessionId, webSocket = session)
        sessionRegistry.register(sessionObj)

        try {
            session.incoming.consumeAsFlow().collect { frame ->
                if (frame is Frame.Text) {
                    val envelope = WsProtocol.decode(frame.readText())
                    handleMessage(session, sessionObj, envelope)
                }
            }
        } catch (e: ClosedReceiveChannelException) {
            // Session closed normally
        } catch (e: Exception) {
            sendError(session, null, e.message ?: "Unknown error")
        } finally {
            sessionRegistry.remove(sessionId)
        }
    }

    private suspend fun handleMessage(
        session: DefaultWebSocketSession,
        sessionObj: Session,
        envelope: WsEnvelope
    ) {
        when (envelope.type) {
            WsMessageType.COMMAND_EXECUTE.value -> handleCommandExecute(session, sessionObj, envelope)
            else -> sendError(session, envelope, "Unknown message type: ${envelope.type}")
        }
    }

    private suspend fun handleCommandExecute(
        session: DefaultWebSocketSession,
        sessionObj: Session,
        envelope: WsEnvelope
    ) {
        val commandId = envelope.payload["commandId"] as? String
            ?: return sendError(session, envelope, "Missing commandId")
        val params = envelope.payload["params"]

        when (val outcome = SessionRouting.decide(commandId, sessionObj.project != null, params)) {
            is SessionRouting.Outcome.CreateProject -> {
                val projectId = outcome.projectId?.let { ProjectId(UUID.fromString(it)) } ?: ProjectId.generate()
                val project = projectService.createProject(projectId)
                sessionRegistry.bindProject(sessionObj.sessionId, project)
                sendResult(session, envelope, CommandResult.success(mapOf("projectId" to project.id.value.toString())))
            }
            is SessionRouting.Outcome.OpenProject -> {
                val project = projectService.getProject(ProjectId(UUID.fromString(outcome.projectId)))
                    ?: return sendError(session, envelope, "Project not found: ${outcome.projectId}")
                sessionRegistry.bindProject(sessionObj.sessionId, project)
                sendResult(session, envelope, CommandResult.success(mapOf("projectId" to project.id.value.toString())))
            }
            is SessionRouting.Outcome.ExecuteCommand -> {
                val project = sessionObj.project
                    ?: return sendError(session, envelope, "Session not bound to a project. Send project.create or project.open first.")
                try {
                    val result = commandExecutor.execute(project, outcome.commandId, outcome.params, sessionObj.sessionId)
                    if (outcome.commandId == "project.load") {
                        sessionRegistry.bindProject(sessionObj.sessionId, projectService.getProject(project.id) ?: project)
                    }
                    sendResult(session, envelope, result)
                } catch (e: Exception) {
                    sendError(session, envelope, e.message ?: "Command execution failed")
                }
            }
            is SessionRouting.Outcome.ProtocolError -> sendError(session, envelope, outcome.message)
        }
    }

    private suspend fun sendResult(
        session: DefaultWebSocketSession,
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
        session.send(Frame.Text(WsProtocol.encode(response)))
    }

    private suspend fun sendError(
        session: DefaultWebSocketSession,
        envelope: WsEnvelope?,
        message: String
    ) {
        val response = WsEnvelope(
            type = WsMessageType.ERROR.value,
            requestId = envelope?.requestId,
            payload = mapOf("message" to message)
        )
        session.send(Frame.Text(WsProtocol.encode(response)))
    }
}
