package runtime.application.session

import java.util.UUID
import runtime.application.command.CommandExecutor
import runtime.application.event.EventPublisher
import runtime.application.project.ProjectService
import runtime.application.project.commands.ProjectCommandIds
import runtime.domain.command.CommandResult
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.models.RuntimeEvent

class CommandDispatchService(
    private val projectService: ProjectService,
    private val commandExecutor: CommandExecutor,
    private val sessionManager: SessionManager,
    private val messages: Messages,
    private val eventPublisher: EventPublisher? = null
) {
    sealed interface Outcome {
        data class CreateProject(val projectId: String?) : Outcome
        data class OpenProject(val projectId: String) : Outcome
        data class ExecuteCommand(val commandId: String, val params: Any?) : Outcome
        data class ProtocolError(val message: String) : Outcome
    }

    sealed interface DispatchResult {
        data class Result(val commandResult: CommandResult) : DispatchResult
        data class Protocol(val message: String) : DispatchResult
    }

    fun decide(commandId: String, projectBound: Boolean, params: Any?): Outcome {
        val projectId = (params as? Map<*, *>)?.get("projectId") as? String
        return when (commandId) {
            ProjectCommandIds.CREATE -> Outcome.CreateProject(projectId)
            ProjectCommandIds.OPEN ->
                if (projectId != null) Outcome.OpenProject(projectId)
                else Outcome.ProtocolError(messages[Messages.MISSING_PROJECT_ID])
            else ->
                if (projectBound) Outcome.ExecuteCommand(commandId, params)
                else Outcome.ProtocolError(messages[Messages.SESSION_NOT_BOUND])
        }
    }

    suspend fun dispatch(sessionId: String, commandId: String, params: Any?): DispatchResult {
        val session = sessionManager.getSession(sessionId)
            ?: return DispatchResult.Protocol(messages[Messages.SESSION_NOT_FOUND])

        return when (val outcome = decide(commandId, session.project != null, params)) {
            is Outcome.CreateProject -> {
                val project = createProject(outcome.projectId)
                    ?: return DispatchResult.Protocol(messages.format(Messages.INVALID_PROJECT_ID, "projectId" to outcome.projectId))
                sessionManager.bindProject(sessionId, project)
                publishProjectEvent(project, "created")
                DispatchResult.Result(CommandResult.success(mapOf("projectId" to project.id.value.toString())))
            }
            is Outcome.OpenProject -> {
                val projectId = parseProjectId(outcome.projectId)
                    ?: return DispatchResult.Protocol(messages.format(Messages.INVALID_PROJECT_ID, "projectId" to outcome.projectId))
                val project = projectService.getProject(projectId)
                    ?: return DispatchResult.Protocol(messages.format(Messages.PROJECT_NOT_FOUND, "projectId" to outcome.projectId))
                sessionManager.bindProject(sessionId, project)
                publishProjectEvent(project, "opened")
                DispatchResult.Result(CommandResult.success(mapOf("projectId" to project.id.value.toString())))
            }
            is Outcome.ExecuteCommand -> {
                val project = session.project
                    ?: return DispatchResult.Protocol(messages[Messages.SESSION_NOT_BOUND])
                val result = commandExecutor.execute(project, outcome.commandId, outcome.params, sessionId)
                sessionManager.rebindIfChanged(sessionId)
                DispatchResult.Result(result)
            }
            is Outcome.ProtocolError -> DispatchResult.Protocol(outcome.message)
        }
    }

    private fun createProject(projectId: String?): Project? {
        return if (projectId != null) {
            val parsed = parseProjectId(projectId) ?: return null
            projectService.createProject(parsed)
        } else {
            projectService.createProject(ProjectId.generate())
        }
    }

    private suspend fun publishProjectEvent(project: Project, type: String) {
        eventPublisher?.publish(
            RuntimeEvent.ProjectEvent(
                projectId = project.id,
                type = type,
                payload = mapOf("projectId" to project.id.value.toString())
            )
        )
    }

    private fun parseProjectId(value: String): ProjectId? = try {
        ProjectId(UUID.fromString(value))
    } catch (e: IllegalArgumentException) {
        null
    }
}
