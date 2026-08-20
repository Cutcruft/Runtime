package runtime.infrastructure.web

import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.routing.routing
import io.ktor.server.websocket.WebSockets
import io.ktor.server.websocket.webSocket
import io.ktor.websocket.DefaultWebSocketSession
import runtime.application.workspace.WorkspaceRegistry
import runtime.domain.models.Messages
import runtime.domain.models.RuntimeConfig
import runtime.infrastructure.plugin.PluginAssetsService
import runtime.infrastructure.ws.WsSessionHandler

class WebServer(
    private val config: RuntimeConfig,
    private val registry: WorkspaceRegistry,
    private val messages: Messages,
    pluginAssetsService: PluginAssetsService
) {
    val httpEndpoints: HttpEndpoints = HttpEndpoints(
        config.http,
        registry,
        pluginAssetsService,
        config.routing.mode,
        uidocsEnabled = config.dev.enabled
    )

    fun start() {
        embeddedServer(Netty, port = config.server.port, host = config.server.host, module = {
            module()
        }).start(wait = false)
    }

    fun Application.module() {
        install(WebSockets)
        httpEndpoints.module()(this)
        routing {
            // WS v2: /ws/{workspace} (workspace session) and /ws/{workspace}/{projectId} (project session).
            // Legacy /ws (single-workspace, project bound via project.create/open) still works.
            webSocket("/ws/{workspace}/{projectId}") {
                val workspaceId = call.parameters["workspace"]
                val projectId = call.parameters["projectId"]
                val ws = registry.get(workspaceId) ?: registry.default()
                WsSessionHandler(
                    ws.dispatchService,
                    ws.runtime.sessionRepository,
                    ws.activeSessions,
                    messages,
                    ws.presenceManager,
                    ws.eventPublisher,
                    collaborationEnabled = ws.runtime.config.collaboration.enabled,
                    cursorsEnabled = ws.runtime.config.collaboration.cursorsEnabled,
                    concurrencyLimit = ws.runtime.config.command.wsConcurrency ?: 8,
                    workspaceId = workspaceId,
                    projectId = projectId
                ).handle(this)
            }
            webSocket("/ws/{workspace}") {
                val workspaceId = call.parameters["workspace"]
                val ws = registry.get(workspaceId) ?: registry.default()
                WsSessionHandler(
                    ws.dispatchService,
                    ws.runtime.sessionRepository,
                    ws.activeSessions,
                    messages,
                    ws.presenceManager,
                    ws.eventPublisher,
                    collaborationEnabled = ws.runtime.config.collaboration.enabled,
                    cursorsEnabled = ws.runtime.config.collaboration.cursorsEnabled,
                    concurrencyLimit = ws.runtime.config.command.wsConcurrency ?: 8,
                    workspaceId = workspaceId
                ).handle(this)
            }
            webSocket(config.ws.path) {
                val ws = registry.default()
                WsSessionHandler(
                    ws.dispatchService,
                    ws.runtime.sessionRepository,
                    ws.activeSessions,
                    messages,
                    ws.presenceManager,
                    ws.eventPublisher,
                    collaborationEnabled = ws.runtime.config.collaboration.enabled,
                    cursorsEnabled = ws.runtime.config.collaboration.cursorsEnabled,
                    concurrencyLimit = ws.runtime.config.command.wsConcurrency ?: 8
                ).handle(this)
            }
        }
        httpEndpoints.spa()(this)
    }
}
