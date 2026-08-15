package runtime.infrastructure.web

import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.routing.routing
import io.ktor.server.websocket.WebSockets
import io.ktor.server.websocket.webSocket
import io.ktor.websocket.DefaultWebSocketSession
import runtime.application.session.CommandDispatchService
import runtime.domain.models.Messages
import runtime.domain.models.RuntimeConfig
import runtime.domain.models.WorkspaceConfiguration
import runtime.domain.repositories.SessionRepository
import runtime.infrastructure.ws.WsSessionHandler

class WebServer(
    private val config: RuntimeConfig,
    private val sessionRepository: SessionRepository,
    private val dispatchService: CommandDispatchService,
    private val workspaceConfiguration: WorkspaceConfiguration,
    private val activeSessions: MutableMap<String, DefaultWebSocketSession>,
    private val messages: Messages
) {
    fun start() {
        embeddedServer(Netty, port = config.server.port, host = config.server.host, module = {
            module()
        }).start(wait = false)
    }

    fun Application.module() {
        install(WebSockets)
        HttpEndpoints(config.http, workspaceConfiguration).module()(this)
        routing {
            webSocket(config.ws.path) {
                WsSessionHandler(dispatchService, sessionRepository, activeSessions, messages).handle(this)
            }
        }
    }
}
