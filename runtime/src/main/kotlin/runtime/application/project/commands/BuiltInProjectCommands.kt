package runtime.application.project.commands

import runtime.application.project.ProjectService
import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.command.ProjectBoundCommandContext
import runtime.domain.project.Project
import runtime.domain.project.ProjectId
import java.util.UUID

private fun CommandContext.requireProject(): Project =
    (this as? ProjectBoundCommandContext)?.project
        ?: throw IllegalStateException("Command context is not bound to a project")

class ProjectCreateCommand(
    private val projectService: ProjectService
) : Command("create", "Create a new project") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val projectIdStr = (params as? Map<*, *>)?.get("projectId") as? String
        val projectId = if (projectIdStr != null) {
            ProjectId(UUID.fromString(projectIdStr))
        } else {
            ProjectId.generate()
        }
        val project = projectService.createProject(projectId)
        return CommandResult.success(mapOf("projectId" to project.id.value.toString()))
    }
}

class ProjectOpenCommand(
    private val projectService: ProjectService
) : Command("open", "Open an existing project") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val projectIdStr = (params as? Map<*, *>)?.get("projectId") as? String
            ?: return CommandResult.error("Missing projectId")
        val project = projectService.getProject(ProjectId(UUID.fromString(projectIdStr)))
            ?: return CommandResult.error("Project not found: $projectIdStr")
        return CommandResult.success(mapOf("projectId" to project.id.value.toString()))
    }
}

class ProjectListCommand(
    private val projectService: ProjectService
) : Command("list", "List all projects") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val projects = projectService.listProjects().map { it.value.toString() }
        return CommandResult.success(projects)
    }
}

class ProjectSaveCommand(
    private val projectService: ProjectService
) : Command("save", "Serialize project state to JSON") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val data = projectService.saveProject(context.requireProject())
        return CommandResult.success(
            mapOf("projectId" to context.requireProject().id.value.toString(), "data" to data)
        )
    }
}

class ProjectLoadCommand(
    private val projectService: ProjectService
) : Command("load", "Restore project from serialized JSON data") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val paramsMap = params as? Map<*, *>
            ?: return CommandResult.error("Missing parameters")
        val data = paramsMap["data"] as? String
            ?: return CommandResult.error("Missing data")
        val projectIdStr = paramsMap["projectId"] as? String
        val projectId = if (projectIdStr != null) {
            ProjectId(UUID.fromString(projectIdStr))
        } else {
            context.requireProject().id
        }
        val project = projectService.loadProject(projectId, data)
        return CommandResult.success(mapOf("projectId" to project.id.value.toString()))
    }
}
