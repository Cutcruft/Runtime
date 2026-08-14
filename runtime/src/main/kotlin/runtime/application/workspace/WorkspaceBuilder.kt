package runtime.application.workspace

import runtime.application.audit.AuditService
import runtime.application.command.CommandExecutor
import runtime.application.project.ProjectFactory
import runtime.application.project.ProjectSerializer
import runtime.application.project.ProjectService
import runtime.application.project.commands.ProjectCreateCommand
import runtime.application.project.commands.ProjectListCommand
import runtime.application.project.commands.ProjectLoadCommand
import runtime.application.project.commands.ProjectOpenCommand
import runtime.application.project.commands.ProjectSaveCommand
import runtime.domain.command.CommandRegistry
import runtime.domain.entity.EntityRegistry
import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.UIDefinition
import runtime.domain.project.ProjectRegistry
import runtime.domain.session.SessionRegistry
import runtime.domain.workspace.ComponentDefinition
import runtime.domain.workspace.CommandEntry
import runtime.domain.workspace.EntityEntry
import runtime.domain.workspace.NavigationEntry
import runtime.domain.workspace.PageDefinition
import runtime.domain.workspace.Workspace
import runtime.domain.workspace.WorkspaceConfiguration
import runtime.infrastructure.plugin.DependencyResolver
import runtime.infrastructure.plugin.PluginClassLoader
import runtime.infrastructure.plugin.PluginContextImpl
import runtime.infrastructure.plugin.PluginLoader

class WorkspaceBuilder(
    private val pluginDirectories: List<String>
) {
    fun build(): Workspace {
        val pluginLoader = PluginLoader(pluginDirectories)
        val descriptors = pluginLoader.discover()

        val resolver = DependencyResolver()
        val result = resolver.resolve(descriptors)
        if (result.cycles.isNotEmpty()) {
            throw IllegalStateException(
                "Circular plugin dependencies detected: ${result.cycles.map { cycle -> cycle.map { it.id.value } }}"
            )
        }

        val entityRegistry = EntityRegistry()
        val commandRegistry = CommandRegistry()
        val projectRegistry = ProjectRegistry()
        val sessionRegistry = SessionRegistry()
        val uiDefinitions = mutableListOf<UIDefinition>()

        val projectService = ProjectService(
            projectRegistry = projectRegistry,
            projectFactory = ProjectFactory(entityRegistry),
            serializer = ProjectSerializer(entityRegistry)
        )
        val commandExecutor = CommandExecutor(
            commandRegistry = commandRegistry,
            auditService = AuditService()
        )

        val projectPluginId = PluginId("project")
        commandRegistry.register(projectPluginId, ProjectCreateCommand(projectService))
        commandRegistry.register(projectPluginId, ProjectOpenCommand(projectService))
        commandRegistry.register(projectPluginId, ProjectListCommand(projectService))
        commandRegistry.register(projectPluginId, ProjectSaveCommand(projectService))
        commandRegistry.register(projectPluginId, ProjectLoadCommand(projectService))

        for (descriptor in result.sorted) {
            try {
                val pluginClass = pluginLoader.loadClass(descriptor, PluginClassLoader::class.java.classLoader)
                val plugin = pluginClass.getDeclaredConstructor().newInstance() as Plugin
                val pluginContext = PluginContextImpl(descriptor.id, entityRegistry, commandRegistry, uiDefinitions)
                plugin.initialize(pluginContext)
                plugin.start()
            } catch (e: Exception) {
                throw IllegalStateException("Failed to load plugin ${descriptor.id}: ${e.message}", e)
            }
        }

        val configuration = WorkspaceConfiguration(
            navigation = uiDefinitions
                .filter { it.componentType.equals("Navigation", ignoreCase = true) }
                .map { def ->
                    NavigationEntry(
                        id = def.config["id"] as String,
                        label = def.config["label"] as String,
                        pageId = def.config["pageId"] as String?
                    )
                },
            pages = uiDefinitions
                .filter { it.componentType.equals("Page", ignoreCase = true) }
                .map { def ->
                    PageDefinition(
                        id = def.config["id"] as String,
                        title = def.config["title"] as String
                    )
                },
            components = uiDefinitions
                .filter {
                    !it.componentType.equals("Navigation", ignoreCase = true) &&
                        !it.componentType.equals("Page", ignoreCase = true)
                }
                .map { def -> ComponentDefinition(type = def.componentType, config = def.config) },
            commands = commandRegistry.all().entries.sortedBy { it.key }.map { (id, command) ->
                CommandEntry(id = id, description = command.description)
            },
            entities = entityRegistry.list().sortedBy { it.value }.map { EntityEntry(type = it.value) }
        )

        return Workspace(
            configuration = configuration,
            commandRegistry = commandRegistry,
            entityRegistry = entityRegistry,
            projectRegistry = projectRegistry,
            sessionRegistry = sessionRegistry,
            projectService = projectService,
            commandExecutor = commandExecutor
        )
    }
}
