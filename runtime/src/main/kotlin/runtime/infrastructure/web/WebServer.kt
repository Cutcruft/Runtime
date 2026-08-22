package runtime.infrastructure.web

import io.quarkus.runtime.Quarkus
import runtime.application.workspace.WorkspaceRegistry
import runtime.domain.models.Messages
import runtime.domain.models.RuntimeConfig
import runtime.infrastructure.plugin.PluginAssetsService

/**
 * Static holder for shared state accessible from Quarkus CDI beans.
 */
object RuntimeState {
    lateinit var config: RuntimeConfig
    lateinit var registry: WorkspaceRegistry
    lateinit var messages: Messages
    lateinit var httpEndpoints: HttpEndpoints
    lateinit var pluginAssetsService: PluginAssetsService
}

class WebServer(
    private val config: RuntimeConfig,
    private val registry: WorkspaceRegistry,
    private val messages: Messages,
    private val pluginAssetsService: PluginAssetsService
) {
    val httpEndpoints: HttpEndpoints = HttpEndpoints(
        config.http,
        registry,
        pluginAssetsService,
        config.routing.mode,
        uidocsEnabled = config.dev.enabled,
        uiEnabled = config.ui.enabled
    )

    fun start() {
        RuntimeState.config = config
        RuntimeState.registry = registry
        RuntimeState.messages = messages
        RuntimeState.httpEndpoints = httpEndpoints
        RuntimeState.pluginAssetsService = pluginAssetsService
        Quarkus.run()
    }
}
