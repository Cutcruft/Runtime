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
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.inmem.InMemoryInfrastructureRegistry
import runtime.infrastructure.inmem.InMemoryProjectRepository
import runtime.infrastructure.inmem.InMemorySessionRepository
import runtime.infrastructure.infrastructure.InfrastructureClientImpl
import runtime.infrastructure.infrastructure.InfrastructureService
import runtime.infrastructure.plugin.PluginAssetsService
import runtime.domain.storage.EntityStore
import runtime.infrastructure.ws.PresenceManager
import runtime.infrastructure.ws.WsEventPublisher

/**
 * V5 — builds a fully isolated [WorkspaceServices] slice for one workspace id.
 *
 * Each workspace gets its own entity/command/infrastructure registries, session
 * repository, project repository, command executor and UI configuration. The heavy
 * infrastructure ([EntityStore], [ProjectLocks], executor dispatcher) is shared
 * across workspaces (projects are globally-addressed UUIDs).
 */
class WorkspaceBuilder(
    private val sharedStore: EntityStore,
    private val projectLocks: ProjectLocks,
    private val executorDispatcher: CoroutineDispatcher,
    private val configPath: String? = null,
    private val pluginAssetsService: runtime.infrastructure.plugin.PluginAssetsService? = null
) {

    fun build(workspaceId: String, config: RuntimeConfig): WorkspaceServices {
        val messages = Messages(config.messages)

        val entityRegistry: EntityRegistry = InMemoryEntityRegistry()
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        val infrastructureRegistry: InfrastructureRegistry = InMemoryInfrastructureRegistry()
        val projectRepository = InMemoryProjectRepository()
        val sessionRepository: SessionRepository = InMemorySessionRepository()

        val projectFactory = ProjectFactory(entityRegistry, sharedStore)
        val projectSerializer = ProjectSerializer(entityRegistry, sharedStore)
        val projectService = ProjectService(projectRepository, projectFactory, projectSerializer, sharedStore, null)

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
            commandRegistry, auditService, projectLocks, messages, eventPublisher, executorDispatcher,
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

        val runtime = WorkspaceRuntime(
            workspaceId = workspaceId,
            config = config,
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
            activeSessions = activeSessions
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
}
