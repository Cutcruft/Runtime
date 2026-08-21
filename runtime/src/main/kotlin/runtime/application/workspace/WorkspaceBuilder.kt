package runtime.application.workspace

import java.util.concurrent.Executors
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asCoroutineDispatcher
import runtime.application.audit.AuditService
import runtime.application.command.CommandExecutor
import runtime.application.command.ProjectLocks
import runtime.application.layer.LayerCommandIds
import runtime.application.layer.LayerService
import runtime.application.layer.LayerShowCommand
import runtime.application.layer.LayerHideCommand
import runtime.application.layer.LayerToggleCommand
import runtime.application.plugin.PluginBootstrap
import runtime.application.project.commands.ProjectCommandIds
import runtime.application.project.commands.ProjectCreateCommand
import runtime.application.project.commands.ProjectListCommand
import runtime.application.project.commands.ProjectLoadCommand
import runtime.application.project.commands.ProjectOpenCommand
import runtime.application.project.commands.ProjectSaveCommand
import runtime.application.project.ProjectFactory
import runtime.application.project.ProjectSerializer
import runtime.application.project.ProjectService
import runtime.application.session.CommandDispatchService
import runtime.application.session.SessionManager
import runtime.domain.models.Messages
import runtime.domain.models.RuntimeConfig
import runtime.domain.models.WorkspaceConfiguration
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry
import runtime.domain.repositories.InfrastructureRegistry
import runtime.domain.repositories.SessionRepository
import runtime.infrastructure.configuration.ConfigLoader
import runtime.infrastructure.configuration.UiYamlLoader
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.inmem.InMemoryInfrastructureRegistry
import runtime.infrastructure.inmem.InMemoryProjectRepository
import runtime.infrastructure.inmem.InMemorySessionRepository
import runtime.infrastructure.storage.StorageFactory
import runtime.infrastructure.infrastructure.InfrastructureClientImpl
import runtime.infrastructure.infrastructure.InfrastructureService
import runtime.infrastructure.plugin.PluginAssetsService
import runtime.domain.storage.EntityStore
import runtime.infrastructure.ws.PresenceManager
import runtime.infrastructure.ws.WsEventPublisher

/**
 * V5 — builds a fully isolated [WorkspaceServices] slice for one workspace id.
 *
 * V11.3 — each workspace gets its own EntityStore, ProjectLocks, and executor
 * dispatcher, providing complete data isolation between workspaces.
 */
class WorkspaceBuilder(
    private val configPath: String? = null,
    private val pluginAssetsService: runtime.infrastructure.plugin.PluginAssetsService? = null
) {

    fun build(workspaceId: String, config: RuntimeConfig): WorkspaceServices {
        val messages = Messages(config.messages)

        // V11.3 — each workspace gets fully isolated infrastructure
        val locks = ProjectLocks()
        val dispatcher = config.command.executorThreads?.let { threads ->
            kotlinx.coroutines.Dispatchers.IO.limitedParallelism(threads)
        } ?: kotlinx.coroutines.Dispatchers.IO

        val entityRegistry: EntityRegistry = InMemoryEntityRegistry()
        val store = StorageFactory().create(config.storage, entityRegistry).store
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        val infrastructureRegistry: InfrastructureRegistry = InMemoryInfrastructureRegistry()
        val projectRepository = InMemoryProjectRepository()
        val sessionRepository: SessionRepository = InMemorySessionRepository()

        val projectFactory = ProjectFactory(entityRegistry, store)
        val projectSerializer = ProjectSerializer(entityRegistry, store)
        val projectService = ProjectService(projectRepository, projectFactory, projectSerializer, store, null)

        val auditService = AuditService(
            enabled = config.audit.enabled,
            maxEventsPerProject = config.audit.maxEventsPerProject
        ) { InMemoryAuditLog() }

        val activeSessions = mutableMapOf<String, io.ktor.websocket.DefaultWebSocketSession>()
        val sessionManager = SessionManager(sessionRepository, projectRepository)
        val presenceManager = PresenceManager()
        val eventPublisher = WsEventPublisher(sessionManager, activeSessions, presenceManager, config.collaboration.enabled)
        val infrastructureService = InfrastructureService(infrastructureRegistry, InfrastructureClientImpl())

        val bootstrap = PluginBootstrap(config, entityRegistry, commandRegistry, infrastructureRegistry, messages)
        val bootstrapResult = bootstrap.bootstrap()

        val maxConcurrency = (config.command.maxConcurrency ?: Runtime.getRuntime().availableProcessors()).coerceAtMost(Runtime.getRuntime().availableProcessors())
        val commandExecutor = CommandExecutor(
            commandRegistry, auditService, locks, messages, eventPublisher, dispatcher,
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

        // V11: load the external UI configuration (<configDir>/ui.yaml). It is the
        // single source of truth for the interface structure and theme; plugin UI
        // (registerUi) is no longer used.
        val uiYaml = resolveUiYamlPath(configPath)
        val uiResult = UiYamlLoader().load(uiYaml)
        val effectiveConfig = uiResult.theme?.let { theme ->
            config.copy(ui = config.ui.copy(theme = theme))
        } ?: config

        val workspaceConfiguration: WorkspaceConfiguration =
            WorkspaceConfigurationBuilder(
                effectiveConfig.ui, config.ws.path, bootstrapResult.messageRegistry, config.routing,
                devEnabled = config.dev.enabled,
                devPollIntervalMs = if (config.dev.enabled) config.dev.watchIntervalMs else 0,
                collaborationEnabled = config.collaboration.enabled,
                collaborationCursorsEnabled = config.collaboration.cursorsEnabled
            )
                .build(
                    uiResult.uiDefinitions.ifEmpty { bootstrapResult.uiDefinitions },
                    commandRegistry, entityRegistry, bootstrapResult.loadedPluginIds, bootstrapResult.frontendComponents
                )

        val runtime = WorkspaceRuntime(
            workspaceId = workspaceId,
            config = effectiveConfig,
            workspaceConfiguration = workspaceConfiguration,
            entityRegistry = entityRegistry,
            commandRegistry = commandRegistry,
            infrastructureRegistry = infrastructureRegistry,
            sessionRepository = sessionRepository,
            pluginDescriptors = bootstrapResult.descriptors
        )

        return WorkspaceServices(
            runtime = runtime,
            dispatchService = dispatchService,
            sessionManager = sessionManager,
            projectService = projectService,
            eventPublisher = eventPublisher,
            presenceManager = presenceManager,
            activeSessions = activeSessions,
            wsHandlers = bootstrapResult.wsHandlers,
            entityStore = store
        )
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

    /** V11 — resolves `<configDir>/ui.yaml` next to the workspace application.yaml. */
    private fun resolveUiYamlPath(configPath: String?): String {
        val configFile = java.io.File(configPath ?: "config/application.yaml").absoluteFile
        val configDir = configFile.parentFile ?: java.io.File(".")
        return java.io.File(configDir, "ui.yaml").absolutePath
    }
}
