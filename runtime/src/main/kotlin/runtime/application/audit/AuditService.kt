package runtime.application.audit

import java.time.Instant
import java.util.concurrent.ConcurrentHashMap
import runtime.domain.command.CommandResult
import runtime.domain.models.AuditEvent
import runtime.domain.models.AuditEventId
import runtime.domain.models.ProjectId
import runtime.domain.repositories.AuditLog

class AuditService(
    private val enabled: Boolean,
    private val maxEventsPerProject: Int,
    private val auditLogFactory: (ProjectId) -> AuditLog
) {
    private val logs = ConcurrentHashMap<ProjectId, AuditLog>()

    fun record(
        projectId: ProjectId,
        commandId: String?,
        arguments: Map<String, Any?>,
        result: CommandResult,
        sessionId: String?
    ) {
        if (!enabled) return
        val log = logs.computeIfAbsent(projectId, auditLogFactory)
        log.append(
            AuditEvent(
                eventId = AuditEventId.generate(),
                timestamp = Instant.now(),
                commandId = commandId,
                arguments = arguments,
                result = result,
                affectedObjects = result.references,
                sessionId = sessionId
            )
        )
        if (maxEventsPerProject > 0) {
            log.truncate(maxEventsPerProject)
        }
    }

    fun logFor(projectId: ProjectId): AuditLog? = logs[projectId]
}
