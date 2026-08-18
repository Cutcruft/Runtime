package runtime

import java.util.concurrent.Executors
import java.util.logging.Logger
import io.ktor.websocket.DefaultWebSocketSession
import kotlin.system.exitProcess
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asCoroutineDispatcher
import runtime.application.audit.AuditService
import runtime.application.command.CommandExecutor
import runtime.application.command.ProjectLocks
import runtime.application.i18n.MessageRegistry
import runtime.application.layer.LayerCommandIds
import runtime.application.layer.LayerService
import runtime.application.layer.LayerShowCommand
import runtime.application.layer.LayerHideCommand
import runtime.application.layer.LayerToggleCommand
import runtime.application.plugin.PluginBootstrap
import runtime.application.project.ProjectFactory
import runtime.application.project.ProjectSerializer
import runtime.application.project.ProjectService
import runtime.application.project.commands.ProjectCommandIds
import runtime.application.project.commands.ProjectCreateCommand
import runtime.application.project.commands.ProjectListCommand
import runtime.application.project.commands.ProjectLoadCommand
import runtime.application.project.commands.ProjectOpenCommand
import runtime.application.project.commands.ProjectSaveCommand
import runtime.application.session.CommandDispatchService
import runtime.application.session.SessionManager
import runtime.application.workspace.WorkspaceConfigurationBuilder
import runtime.domain.entity.EntityType
import runtime.domain.models.Messages
import runtime.domain.models.WorkspaceConfiguration
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.SessionRepository
import runtime.infrastructure.configuration.ConfigLoader
import runtime.infrastructure.dev.PluginWatcher
import runtime.infrastructure.dev.RuntimeReloader
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.inmem.InMemoryInfrastructureRegistry
import runtime.infrastructure.inmem.InMemoryProjectRepository
import runtime.infrastructure.inmem.InMemorySessionRepository
import runtime.infrastructure.infrastructure.InfrastructureClientImpl
import runtime.infrastructure.infrastructure.InfrastructureService
import runtime.infrastructure.plugin.PluginAssetsService
import runtime.infrastructure.storage.StorageFactory
import runtime.infrastructure.web.WebServer
import runtime.infrastructure.ws.PresenceManager
import runtime.infrastructure.ws.WsEventPublisher

private val logger = Logger.getLogger("Runtime")

fun main(args: Array<String>) {
    try {
        val configPath = resolveConfigPath(args)
        val config = ConfigLoader().load(configPath)
        val messages = Messages(config.messages)

        val entityRegistry = InMemoryEntityRegistry()
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        val infrastructureRegistry = InMemoryInfrastructureRegistry()
        val projectRepository = InMemoryProjectRepository()
        val sessionRepository: SessionRepository = InMemorySessionRepository()

        val storageResult = StorageFactory().create(config.storage, entityRegistry)
        val entityStore = storageResult.store
        val projectFactory = ProjectFactory(entityRegistry, entityStore)
        val projectSerializer = ProjectSerializer(entityRegistry, entityStore)
        val projectService = ProjectService(projectRepository, projectFactory, projectSerializer, entityStore, storageResult.coldStore)

        val auditService = AuditService(
            enabled = config.audit.enabled,
            maxEventsPerProject = config.audit.maxEventsPerProject
        ) { InMemoryAuditLog() }

        val projectLocks = ProjectLocks()
        val dispatcher = config.command.executorThreads?.let { threads ->
            Executors.newFixedThreadPool(threads).asCoroutineDispatcher()
        } ?: Dispatchers.Default
        val poolSize = config.command.executorThreads ?: Runtime.getRuntime().availableProcessors()
        val maxConcurrency = (config.command.maxConcurrency ?: poolSize).coerceAtMost(poolSize)

        val activeSessions = mutableMapOf<String, DefaultWebSocketSession>()
        val sessionManager = SessionManager(sessionRepository, projectRepository)
        val presenceManager = PresenceManager()
        val eventPublisher = WsEventPublisher(sessionManager, activeSessions, presenceManager, config.collaboration.enabled)
        val infrastructureService = InfrastructureService(infrastructureRegistry, InfrastructureClientImpl())

        // Plugin bootstrap (shared with RuntimeReloader)
        val bootstrap = PluginBootstrap(config, entityRegistry, commandRegistry, infrastructureRegistry, messages)
        val bootstrapResult = bootstrap.bootstrap()

        val commandExecutor = CommandExecutor(
            commandRegistry, auditService, projectLocks, messages, eventPublisher, dispatcher,
            maxConcurrency = maxConcurrency,
            queueWaitMs = config.command.queueWaitMs ?: 5_000,
            timeoutMs = config.command.timeoutMs,
            infrastructure = infrastructureService,
            scriptEngine = bootstrapResult.scriptEngine
        )
        val dispatchService = CommandDispatchService(projectService, commandExecutor, sessionManager, messages, eventPublisher)

        registerBuiltInCommands(commandRegistry, projectService, messages)
        val layerService = LayerService()
        registerLayerCommands(commandRegistry, layerService)

        val workspaceConfiguration: WorkspaceConfiguration =
            WorkspaceConfigurationBuilder(
                config.ui, config.ws.path, bootstrapResult.messageRegistry, config.routing,
                devEnabled = config.dev.enabled,
                devPollIntervalMs = if (config.dev.enabled) config.dev.watchIntervalMs else 0,
                collaborationEnabled = config.collaboration.enabled,
                collaborationCursorsEnabled = config.collaboration.cursorsEnabled
            )
                .build(bootstrapResult.uiDefinitions, commandRegistry, entityRegistry, bootstrapResult.loadedPluginIds, bootstrapResult.frontendComponents)

        val webServer = WebServer(
            config = config,
            sessionRepository = sessionRepository,
            dispatchService = dispatchService,
            workspaceConfiguration = workspaceConfiguration,
            activeSessions = activeSessions,
            messages = messages,
            pluginAssetsService = PluginAssetsService(bootstrapResult.descriptors),
            presenceManager = presenceManager,
            eventPublisher = eventPublisher
        )
        webServer.start()

        logger.info("Runtime started on http://${config.server.host}:${config.server.port}")

        // Dev-mode: start plugin watcher for hot-reload
        if (config.dev.enabled) {
            val watchPaths = config.dev.watchPaths.ifEmpty { config.plugins.directories }
            val reloader = RuntimeReloader(
                configPath = configPath,
                entityRegistry = entityRegistry,
                commandRegistry = commandRegistry,
                infrastructureRegistry = infrastructureRegistry,
                httpEndpoints = webServer.httpEndpoints,
                pluginAssetsService = PluginAssetsService(bootstrapResult.descriptors),
                activeSessions = activeSessions,
                sessionRepository = sessionRepository,
                messages = messages
            )
            val watcher = PluginWatcher(
                watchDirs = watchPaths,
                configFileName = config.plugins.configFileName,
                pollIntervalMs = config.dev.watchIntervalMs,
                onChange = { reloader.reload() }
            )
            watcher.start()
            logger.info("Dev-mode: watching plugins in $watchPaths for changes")

            java.lang.Runtime.getRuntime().addShutdownHook(Thread {
                watcher.stop()
                entityStore.closeAll()
                logger.info("Shutting down Runtime...")
            })
        } else {
            java.lang.Runtime.getRuntime().addShutdownHook(Thread {
                entityStore.closeAll()
                logger.info("Shutting down Runtime...")
            })
        }

        Thread.currentThread().join()
    } catch (e: Exception) {
        logger.severe("Failed to start Runtime: ${e.message}")
        e.printStackTrace()
        exitProcess(1)
    }
}

private fun resolveConfigPath(args: Array<String>): String? {
    val cliIndex = args.indexOf("--config")
    val cliValue = if (cliIndex >= 0 && cliIndex + 1 < args.size) args[cliIndex + 1] else null
    return cliValue ?: System.getenv("RUNTIME_CONFIG") ?: "config/application.yaml"
}

private fun registerBuiltInCommands(
    commandRegistry: CommandRegistry,
    projectService: ProjectService,
    messages: Messages
) {
    val pluginId = PluginId(ProjectCommandIds.PLUGIN)
    commandRegistry.register(pluginId, ProjectCreateCommand(projectService, messages))
    commandRegistry.register(pluginId, ProjectOpenCommand(projectService, messages))
    commandRegistry.register(pluginId, ProjectListCommand(projectService, messages))
    commandRegistry.register(pluginId, ProjectSaveCommand(projectService, messages))
    commandRegistry.register(pluginId, ProjectLoadCommand(projectService, messages))
}

private fun registerLayerCommands(
    commandRegistry: CommandRegistry,
    layerService: LayerService
) {
    val pluginId = PluginId(LayerCommandIds.PLUGIN)
    commandRegistry.register(pluginId, LayerShowCommand(layerService))
    commandRegistry.register(pluginId, LayerHideCommand(layerService))
    commandRegistry.register(pluginId, LayerToggleCommand(layerService))
}
