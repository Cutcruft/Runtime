package runtime.infrastructure.web

import runtime.domain.workspace.Workspace
import runtime.interfaces.http.HttpEndpoints
import runtime.interfaces.ws.WsSessionHandler
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.routing.routing
import io.ktor.server.websocket.WebSockets
import io.ktor.server.websocket.webSocket

class WebServer(
    private val workspace: Workspace,
    private val host: String = "0.0.0.0",
    private val port: Int = 8080
) {
    private val wsHandler = WsSessionHandler(
        projectService = workspace.projectService,
        commandExecutor = workspace.commandExecutor,
        sessionRegistry = workspace.sessionRegistry
    )
    private val httpEndpoints = HttpEndpoints(workspace.configuration)

    fun start() {
        embeddedServer(Netty, port = port, host = host, module = {
            module()
        }).start(wait = false)
    }

    fun Application.module() {
        install(WebSockets)
        httpEndpoints.module()(this)
        routing {
            webSocket("/ws") {
                wsHandler.handle(this)
            }
        }
    }
}
