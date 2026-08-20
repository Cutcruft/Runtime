package runtime.application.workspace

import runtime.domain.models.RuntimeConfig
import runtime.domain.models.WorkspaceConfiguration
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry
import runtime.domain.repositories.InfrastructureRegistry
import runtime.domain.repositories.SessionRepository
import runtime.domain.models.Session

/**
 * V5 — an isolated runtime slice for one workspace: its own config, registries
 * (entities/commands/infrastructure), sessions and UI configuration. Two
 * workspaces can therefore expose different plugins, commands and pages while
 * sharing the process, storage and WS/HTTP transport.
 */
class WorkspaceRuntime(
    val workspaceId: String,
    val config: RuntimeConfig,
    val workspaceConfiguration: WorkspaceConfiguration,
    val entityRegistry: EntityRegistry,
    val commandRegistry: CommandRegistry,
    val infrastructureRegistry: InfrastructureRegistry,
    val sessionRepository: SessionRepository,
    val pluginDescriptors: List<runtime.domain.models.PluginDescriptor> = emptyList()
) {
    val sessions = mutableListOf<Session>()

    override fun toString(): String =
        "WorkspaceRuntime($workspaceId, ${workspaceConfiguration.commands.size} commands, ${workspaceConfiguration.pages.size} pages)"
}
