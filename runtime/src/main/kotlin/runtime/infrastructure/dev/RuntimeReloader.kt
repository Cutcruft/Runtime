package runtime.infrastructure.dev

import java.util.concurrent.atomic.AtomicReference
import java.util.logging.Logger
import runtime.application.plugin.PluginBootstrap
import runtime.application.workspace.WorkspaceConfigurationBuilder
import runtime.domain.models.Messages
import runtime.domain.models.WorkspaceConfiguration
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry
import runtime.domain.repositories.InfrastructureRegistry
import runtime.domain.repositories.SessionRepository
import runtime.infrastructure.plugin.PluginAssetsService
import runtime.infrastructure.web.HttpEndpoints
import runtime.infrastructure.ws.WsEventPublisher

/**
 * Orchestrates a full plugin + config reload cycle:
 * 1. Re-read config from disk
 * 2. Clear registries (commands, entities, infrastructure)
 * 3. Re-discover and re-bootstrap plugins
 * 4. Rebuild WorkspaceConfiguration
 * 5. Swap config reference in HttpEndpoints
 * 6. Update PluginAssetsService
 *
 * All operations are synchronous and expected to be called from the PluginWatcher thread.
 */
class RuntimeReloader(
    private val configPath: String?,
    private val entityRegistry: EntityRegistry,
    private val commandRegistry: CommandRegistry,
    private val infrastructureRegistry: InfrastructureRegistry,
    private val httpEndpoints: HttpEndpoints,
    private val pluginAssetsService: PluginAssetsService,
    private val activeSessions: MutableMap<String, io.ktor.websocket.DefaultWebSocketSession>,
    private val sessionRepository: SessionRepository,
    private val messages: Messages,
    private val eventPublisher: WsEventPublisher? = null
) {
    private val logger = Logger.getLogger(RuntimeReloader::class.java.name)
    private val reloadCount = AtomicReference(0)

    fun reload() {
        val attempt = reloadCount.updateAndGet { it + 1 }
        logger.info("=== Reload cycle #$attempt starting ===")
        try {
            // 1. Re-read config
            val config = runtime.infrastructure.configuration.ConfigLoader().load(configPath)
            logger.info("Config reloaded: dev.enabled=${config.dev.enabled}")

            // 2. Clear registries
            commandRegistry.clear()
            entityRegistry.clear()
            infrastructureRegistry.clear()
            logger.info("Registries cleared")

            // 3. Bootstrap plugins (shared logic)
            val bootstrap = PluginBootstrap(config, entityRegistry, commandRegistry, infrastructureRegistry, messages)
            val result = bootstrap.bootstrap()
            logger.info("Bootstrapped plugins: ${result.loadedPluginIds}")

            // 4. Rebuild WorkspaceConfiguration
            val newConfig = WorkspaceConfigurationBuilder(
                config.ui, config.ws.path, result.messageRegistry, config.routing,
                devEnabled = config.dev.enabled,
                devPollIntervalMs = if (config.dev.enabled) config.dev.watchIntervalMs else 0,
                collaborationEnabled = config.collaboration.enabled,
                collaborationCursorsEnabled = config.collaboration.cursorsEnabled
            )
                .build(result.uiDefinitions, commandRegistry, entityRegistry, result.loadedPluginIds, result.frontendComponents)

            // 5. Swap config in HttpEndpoints
            httpEndpoints.updateConfig(newConfig)
            logger.info("WorkspaceConfiguration updated (${newConfig.commands.size} commands, ${newConfig.navigation.size} nav entries)")

            // 6. Update PluginAssetsService
            pluginAssetsService.update(result.descriptors)
            logger.info("PluginAssetsService updated")

            // 7. Broadcast commands.reloaded to connected sessions
            val publisher = eventPublisher
            if (publisher != null) {
                kotlinx.coroutines.runBlocking {
                    val commands = commandRegistry.all().entries.sortedBy { it.key }.map { (id, command) ->
                        mapOf(
                            "id" to id,
                            "description" to command.description,
                            "parameters" to command.parameters.map { p ->
                                mapOf(
                                    "name" to p.name,
                                    "type" to p.type,
                                    "required" to p.required,
                                    "entityType" to p.entityType,
                                    "enumValues" to p.enumValues,
                                    "min" to p.min,
                                    "max" to p.max,
                                    "pattern" to p.pattern
                                ).filterValues { it != null }
                            }
                        )
                    }
                    val entities = entityRegistry.list().map { it.value }
                    publisher.broadcastCommandsReloaded(commands, entities)
                }
            }
            logger.info("Broadcast commands.reloaded")

            logger.info("=== Reload cycle #$attempt complete ===")
        } catch (e: Exception) {
            logger.severe("Reload cycle #$attempt failed: ${e.message}")
            logger.severe(e.stackTraceToString())
        }
    }
}
