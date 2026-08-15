package runtime

import java.util.concurrent.Executors
import io.ktor.websocket.DefaultWebSocketSession
import kotlin.system.exitProcess
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asCoroutineDispatcher
import runtime.application.audit.AuditService
import runtime.application.command.CommandExecutor
import runtime.application.command.ProjectLocks
import runtime.application.plugin.DependencyResolver
import runtime.application.plugin.PluginManager
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
import runtime.domain.models.RegisteredUi
import runtime.domain.models.WorkspaceConfiguration
import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.SessionRepository
import runtime.infrastructure.configuration.ConfigLoader
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.inmem.InMemoryProjectRepository
import runtime.infrastructure.inmem.InMemorySessionRepository
import runtime.infrastructure.obj.SynchronizedObjectList
import runtime.infrastructure.plugin.PluginClassLoader
import runtime.infrastructure.plugin.PluginContextImpl
import runtime.infrastructure.plugin.PluginDescriptorLoader
import runtime.infrastructure.plugin.PluginLoader
import runtime.infrastructure.web.WebServer
import runtime.infrastructure.ws.WsEventPublisher

fun main(args: Array<String>) {
    try {
        val configPath = resolveConfigPath(args)
        val config = ConfigLoader().load(configPath)
        val messages = Messages(config.messages)

        val entityRegistry = InMemoryEntityRegistry()
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        val projectRepository = InMemoryProjectRepository()
        val sessionRepository: SessionRepository = InMemorySessionRepository()

        val projectFactory = ProjectFactory(entityRegistry) { SynchronizedObjectList<Any>(it) }
        val projectSerializer = ProjectSerializer(entityRegistry)
        val projectService = ProjectService(projectRepository, projectFactory, projectSerializer)

        val auditService = AuditService(
            enabled = config.audit.enabled,
            maxEventsPerProject = config.audit.maxEventsPerProject
        ) { InMemoryAuditLog() }

        val projectLocks = ProjectLocks()
        val dispatcher = config.command.executorThreads?.let { threads ->
            Executors.newFixedThreadPool(threads).asCoroutineDispatcher()
        } ?: Dispatchers.Default

        val activeSessions = mutableMapOf<String, DefaultWebSocketSession>()
        val sessionManager = SessionManager(sessionRepository, projectRepository)
        val eventPublisher = WsEventPublisher(sessionManager, activeSessions)
        val commandExecutor = CommandExecutor(
            commandRegistry, auditService, projectLocks, messages, eventPublisher, dispatcher
        )
        val dispatchService = CommandDispatchService(projectService, commandExecutor, sessionManager, messages, eventPublisher)

        registerBuiltInCommands(commandRegistry, projectService, messages)

        val uiDefinitions = mutableListOf<RegisteredUi>()
        val pluginLoader = PluginLoader(
            config.plugins.directories,
            PluginDescriptorLoader(config.plugins.configFileName, config.plugins.apiVersion)
        )
        val descriptors = pluginLoader.discover()
        val pluginManager = PluginManager(
            resolver = DependencyResolver(),
            instantiate = { descriptor ->
                val clazz = pluginLoader.loadClass(descriptor, PluginClassLoader::class.java.classLoader)
                clazz.getDeclaredConstructor().newInstance() as Plugin
            },
            createContext = { pluginId ->
                PluginContextImpl(pluginId, entityRegistry, commandRegistry) { ui ->
                    uiDefinitions += RegisteredUi(pluginId = pluginId, definition = ui)
                }
            },
            messages = messages
        )
        val loadedPluginIds = pluginManager.bootstrap(descriptors).toSet()

        val workspaceConfiguration: WorkspaceConfiguration =
            WorkspaceConfigurationBuilder(config.ui, config.ws.path)
                .build(uiDefinitions, commandRegistry, entityRegistry, loadedPluginIds)

        val webServer = WebServer(
            config = config,
            sessionRepository = sessionRepository,
            dispatchService = dispatchService,
            workspaceConfiguration = workspaceConfiguration,
            activeSessions = activeSessions,
            messages = messages
        )
        webServer.start()

        println("Runtime started on http://${config.server.host}:${config.server.port}")
        java.lang.Runtime.getRuntime().addShutdownHook(Thread {
            println("Shutting down Runtime...")
        })

        Thread.currentThread().join()
    } catch (e: Exception) {
        System.err.println("Failed to start Runtime: ${e.message}")
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
