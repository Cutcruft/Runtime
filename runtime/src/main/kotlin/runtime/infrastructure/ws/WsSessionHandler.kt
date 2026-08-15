package runtime.infrastructure.ws

import io.ktor.websocket.DefaultWebSocketSession
import io.ktor.websocket.Frame
import io.ktor.websocket.readText
import java.util.UUID
import kotlinx.coroutines.channels.ClosedReceiveChannelException
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.consumeAsFlow
import runtime.application.session.CommandDispatchService
import runtime.domain.command.CommandResult
import runtime.domain.models.Messages
import runtime.domain.models.Session
import runtime.domain.repositories.SessionRepository

class WsSessionHandler(
    private val dispatchService: CommandDispatchService,
    private val sessionRepository: SessionRepository,
    private val activeSessions: MutableMap<String, DefaultWebSocketSession>,
    private val messages: Messages
) {
    suspend fun handle(session: DefaultWebSocketSession) {
        val sessionId = UUID.randomUUID().toString()
        sessionRepository.register(Session(sessionId))
        activeSessions[sessionId] = session

        try {
            session.incoming.consumeAsFlow().collect { frame ->
                if (frame is Frame.Text) {
                    val envelope = WsProtocol.decode(frame.readText())
                    handleEnvelope(session, sessionId, envelope)
                }
            }
        } catch (e: ClosedReceiveChannelException) {
            // Session closed normally
        } catch (e: Exception) {
            sendError(session, null, messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to (e.message ?: "")))
        } finally {
            activeSessions.remove(sessionId)
            sessionRepository.remove(sessionId)
        }
    }

    private suspend fun handleEnvelope(
        session: DefaultWebSocketSession,
        sessionId: String,
        envelope: WsEnvelope
    ) {
        if (envelope.type != WsMessageType.COMMAND_EXECUTE.value) {
            return sendError(session, envelope, messages.format(Messages.UNKNOWN_MESSAGE_TYPE, "type" to envelope.type))
        }
        val commandId = envelope.payload["commandId"] as? String
            ?: return sendError(session, envelope, messages[Messages.MISSING_COMMAND_ID])
        val params = envelope.payload["params"]

        val result = try {
            dispatchService.dispatch(sessionId, commandId, params)
        } catch (e: Exception) {
            return sendError(session, envelope, messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to (e.message ?: "")))
        }

        when (result) {
            is CommandDispatchService.DispatchResult.Result -> sendCommandResult(session, envelope, result.commandResult)
            is CommandDispatchService.DispatchResult.Protocol -> sendError(session, envelope, result.message)
        }
    }

    private suspend fun sendCommandResult(
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
