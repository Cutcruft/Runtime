package runtime.application.command

import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import runtime.application.audit.AuditService
import runtime.application.event.EventPublisher
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.models.RuntimeEvent
import runtime.domain.repositories.CommandRegistry

class CommandExecutor(
    private val commandRegistry: CommandRegistry,
    private val auditService: AuditService,
    private val projectLocks: ProjectLocks,
    private val messages: Messages,
    private val eventPublisher: EventPublisher? = null,
    private val dispatcher: CoroutineDispatcher = Dispatchers.Default
) {
    suspend fun execute(
        project: Project,
        commandId: String,
        params: Any?,
        sessionId: String?
    ): CommandResult {
        val command = commandRegistry.get(commandId)
            ?: return CommandResult.error(messages.format(Messages.COMMAND_NOT_FOUND, "commandId" to commandId))

        val result = withContext(dispatcher) {
            val context: CommandContext = CommandContextImpl(project, projectLocks, messages)
            command.execute(context, params)
        }

        auditService.record(project.id, commandId, mapOf("params" to params), result, sessionId)
        publishChanges(project, result)
        return result
    }

    private suspend fun publishChanges(project: Project, result: CommandResult) {
        val publisher = eventPublisher ?: return
        if (result.references.isEmpty()) return
        val singleValue = if (result.references.size == 1) result.value else null
        result.references.forEach { ref ->
            publisher.publish(
                RuntimeEvent.ObjectChanged(
                    projectId = project.id,
                    entityType = ref.entityType,
                    objectId = ref.objectId,
                    value = singleValue
                )
            )
        }
    }
}
