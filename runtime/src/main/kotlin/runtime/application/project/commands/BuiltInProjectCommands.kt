package runtime.application.project.commands

import java.util.UUID
import runtime.application.command.CommandContextImpl
import runtime.application.project.ProjectService
import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.models.ProjectId

private fun CommandContext.requireProject(): Project =
    (this as? CommandContextImpl)?.project
        ?: throw IllegalStateException("Command context is not bound to a project")

class ProjectCreateCommand(
    private val projectService: ProjectService,
    private val messages: Messages
) : Command("create", messages[Messages.DESC_CREATE]) {
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
    private val projectService: ProjectService,
    private val messages: Messages
) : Command("open", messages[Messages.DESC_OPEN]) {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val projectIdStr = (params as? Map<*, *>)?.get("projectId") as? String
            ?: return CommandResult.error(messages[Messages.MISSING_PROJECT_ID])
        val project = projectService.getProject(ProjectId(UUID.fromString(projectIdStr)))
            ?: return CommandResult.error(messages.format(Messages.PROJECT_NOT_FOUND, "projectId" to projectIdStr))
        return CommandResult.success(mapOf("projectId" to project.id.value.toString()))
    }
}

class ProjectListCommand(
    private val projectService: ProjectService,
    private val messages: Messages
) : Command("list", messages[Messages.DESC_LIST]) {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val projects = projectService.listProjects().map { it.value.toString() }
        return CommandResult.success(projects)
    }
}

class ProjectSaveCommand(
    private val projectService: ProjectService,
    private val messages: Messages
) : Command("save", messages[Messages.DESC_SAVE]) {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val project = context.requireProject()
        val data = projectService.saveProject(project)
        return CommandResult.success(
            mapOf("projectId" to project.id.value.toString(), "data" to data)
        )
    }
}

class ProjectLoadCommand(
    private val projectService: ProjectService,
    private val messages: Messages
) : Command("load", messages[Messages.DESC_LOAD]) {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val paramsMap = params as? Map<*, *>
            ?: return CommandResult.error(messages[Messages.MISSING_PARAMETERS])
        val data = paramsMap["data"] as? String
            ?: return CommandResult.error(messages[Messages.MISSING_DATA])
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
