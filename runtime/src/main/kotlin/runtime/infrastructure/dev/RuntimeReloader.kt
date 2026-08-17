package runtime.infrastructure.dev

import java.util.concurrent.atomic.AtomicReference
import java.util.logging.Logger
import runtime.application.audit.AuditService
import runtime.application.command.CommandExecutor
import runtime.application.command.ProjectLocks
import runtime.application.i18n.MessageRegistry
import runtime.application.plugin.DependencyResolver
import runtime.application.plugin.PluginManager
import runtime.application.workspace.WorkspaceConfigurationBuilder
import runtime.domain.models.Messages
import runtime.domain.models.RegisteredUi
import runtime.domain.models.RuntimeConfig
import runtime.domain.models.WorkspaceConfiguration
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry
import runtime.domain.repositories.InfrastructureRegistry
import runtime.domain.repositories.SessionRepository
import runtime.infrastructure.configuration.ConfigLoader
import runtime.infrastructure.i18n.MessageCatalogLoader
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.plugin.PluginAssetsService
import runtime.infrastructure.plugin.PluginClassLoader
import runtime.infrastructure.plugin.PluginContextImpl
import runtime.infrastructure.plugin.PluginDescriptorLoader
import runtime.infrastructure.plugin.PluginLoader
import runtime.infrastructure.script.KotlinScriptEngine
import runtime.infrastructure.web.HttpEndpoints

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
    private val messages: Messages
) {
    private val logger = Logger.getLogger(RuntimeReloader::class.java.name)
    private val reloadCount = AtomicReference(0)

    fun reload() {
        val attempt = reloadCount.updateAndGet { it + 1 }
        logger.info("=== Reload cycle #$attempt starting ===")
        try {
            // 1. Re-read config
            val config = ConfigLoader().load(configPath)
            logger.info("Config reloaded: dev.enabled=${config.dev.enabled}")

            // 2. Clear registries
            commandRegistry.clear()
            entityRegistry.clear()
            infrastructureRegistry.clear()
            logger.info("Registries cleared")

            // 3. Re-discover plugins
            val pluginLoader = PluginLoader(
                config.plugins.directories,
                PluginDescriptorLoader(config.plugins.configFileName, config.plugins.apiVersion)
            )
            val descriptors = pluginLoader.discover()
            logger.info("Discovered ${descriptors.size} plugins")

            // 4. Re-bootstrap plugins
            val uiDefinitions = mutableListOf<RegisteredUi>()
            val pluginManager = PluginManager(
                resolver = DependencyResolver(),
                instantiate = { descriptor ->
                    val clazz = pluginLoader.loadClass(descriptor, PluginClassLoader::class.java.classLoader)
                    clazz.getDeclaredConstructor().newInstance() as runtime.domain.plugin.Plugin
                },
                createContext = { pluginId ->
                    PluginContextImpl(pluginId, entityRegistry, commandRegistry, infrastructureRegistry) { ui ->
                        uiDefinitions += RegisteredUi(pluginId = pluginId, definition = ui)
                    }
                },
                messages = messages
            )
            val loadedPluginIds = pluginManager.bootstrap(descriptors).toSet()
            logger.info("Bootstrapped plugins: $loadedPluginIds")

            // 5. Rebuild WorkspaceConfiguration
            val messageRegistry = MessageRegistry(config.i18n.defaultLocale)
            val messageCatalogLoader = MessageCatalogLoader()
            val coreCatalogs = messageCatalogLoader.loadFromClasspathAll("core")
            val allowedLocales = config.i18n.locales.ifEmpty { coreCatalogs.keys.sorted() }
            allowedLocales.forEach { locale ->
                val entries = coreCatalogs[locale] ?: return@forEach
                messageRegistry.register(locale, entries)
            }
            descriptors.forEach { descriptor ->
                messageCatalogLoader
                    .loadFromJar(descriptor.id.value, descriptor.jarPath)
                    .forEach { (locale, entries) -> messageRegistry.register(locale, entries) }
            }

            val newConfig = WorkspaceConfigurationBuilder(
                config.ui, config.ws.path, messageRegistry, config.routing,
                devEnabled = config.dev.enabled,
                devPollIntervalMs = if (config.dev.enabled) config.dev.watchIntervalMs else 0,
                collaborationEnabled = config.collaboration.enabled,
                collaborationCursorsEnabled = config.collaboration.cursorsEnabled
            )
                .build(uiDefinitions, commandRegistry, entityRegistry, loadedPluginIds)

            // 6. Swap config in HttpEndpoints
            httpEndpoints.updateConfig(newConfig)
            logger.info("WorkspaceConfiguration updated (${newConfig.commands.size} commands, ${newConfig.navigation.size} nav entries)")

            // 7. Update PluginAssetsService
            pluginAssetsService.update(descriptors)
            logger.info("PluginAssetsService updated")

            logger.info("=== Reload cycle #$attempt complete ===")
        } catch (e: Exception) {
            logger.severe("Reload cycle #$attempt failed: ${e.message}")
            e.printStackTrace()
        }
    }
}
