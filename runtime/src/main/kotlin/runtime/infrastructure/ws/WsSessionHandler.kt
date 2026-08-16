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
import runtime.domain.models.Session
import runtime.domain.repositories.SessionRepository

/**
 * Handles a WebSocket session.
 *
 * Messages are processed with bounded parallelism: up to [concurrencyLimit]
 * worker coroutines consume envelopes from a bounded channel (capacity =
 * [concurrencyLimit]). When the channel is full, the incoming flow suspends,
 * applying back-pressure instead of buffering unlimited work. Results are
 * matched by `requestId` on the client, so responses may arrive out of order.
 *
 * All frames written back are serialized through a per-session [Mutex].
 */
class WsSessionHandler(
    private val dispatchService: CommandDispatchService,
    private val sessionRepository: SessionRepository,
    private val activeSessions: MutableMap<String, DefaultWebSocketSession>,
    private val messages: Messages,
    private val concurrencyLimit: Int = 8
) {
    suspend fun handle(session: DefaultWebSocketSession) {
        val sessionId = UUID.randomUUID().toString()
        sessionRepository.register(Session(sessionId))
        activeSessions[sessionId] = session

        val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
        val sendMutex = Mutex()
        val channel = Channel<WsEnvelope>(capacity = concurrencyLimit)

        try {
            val workers = (1..concurrencyLimit).map {
                scope.launch {
                    for (envelope in channel) {
                        try {
                            handleEnvelope(session, sessionId, envelope, sendMutex)
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
            scope.cancel()
            activeSessions.remove(sessionId)
            sessionRepository.remove(sessionId)
        }
    }

    private suspend fun handleEnvelope(
        session: DefaultWebSocketSession,
        sessionId: String,
        envelope: WsEnvelope,
        sendMutex: Mutex
    ) {
        if (envelope.type != WsMessageType.COMMAND_EXECUTE.value) {
            return sendErrorLocked(session, sendMutex, envelope, messages.format(Messages.UNKNOWN_MESSAGE_TYPE, "type" to envelope.type))
        }
        val commandId = envelope.payload["commandId"] as? String
            ?: return sendErrorLocked(session, sendMutex, envelope, messages[Messages.MISSING_COMMAND_ID])
        val params = envelope.payload["params"]

        val result = dispatchService.dispatch(sessionId, commandId, params)

        when (result) {
            is CommandDispatchService.DispatchResult.Result ->
                sendCommandResult(session, sendMutex, envelope, result.commandResult)
            is CommandDispatchService.DispatchResult.Protocol ->
                sendErrorLocked(session, sendMutex, envelope, result.message)
        }
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