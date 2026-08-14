package runtime.domain.workspace

import runtime.application.command.CommandExecutor
import runtime.application.project.ProjectService
import runtime.domain.command.CommandRegistry
import runtime.domain.entity.EntityRegistry
import runtime.domain.project.ProjectRegistry
import runtime.domain.session.SessionRegistry

class Workspace(
    val configuration: WorkspaceConfiguration,
    val commandRegistry: CommandRegistry,
    val entityRegistry: EntityRegistry,
    val projectRegistry: ProjectRegistry,
    val sessionRegistry: SessionRegistry,
    val projectService: ProjectService,
    val commandExecutor: CommandExecutor
)
