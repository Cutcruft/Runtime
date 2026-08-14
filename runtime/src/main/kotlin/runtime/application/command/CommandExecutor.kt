package runtime.application.command

import runtime.application.audit.AuditService
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandRegistry
import runtime.domain.command.CommandResult
import runtime.domain.project.Project
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CommandExecutor(
    private val commandRegistry: CommandRegistry,
    private val auditService: AuditService
) {
    suspend fun execute(
        project: Project,
        commandId: String,
        params: Any?,
        sessionId: String?
    ): CommandResult {
        val command = commandRegistry.get(commandId)
            ?: return CommandResult.error("Command not found: $commandId")

        val result = withContext(Dispatchers.Default) {
            val context: CommandContext = CommandContextImpl(project)
            command.execute(context, params)
        }

        auditService.record(project, commandId, mapOf("params" to params), result, sessionId)
        return result
    }
}
