package runtime.application.audit

import runtime.domain.audit.AuditEvent
import runtime.domain.audit.AuditEventId
import runtime.domain.command.CommandResult
import runtime.domain.project.Project
import java.time.Instant

class AuditService {
    fun record(
        project: Project,
        commandId: String?,
        arguments: Map<String, Any?>,
        result: CommandResult,
        sessionId: String?
    ) {
        val event = AuditEvent(
            eventId = AuditEventId.generate(),
            timestamp = Instant.now(),
            commandId = commandId,
            arguments = arguments,
            result = result,
            affectedObjects = result.references,
            sessionId = sessionId
        )
        project.auditLog.append(event)
    }
}
