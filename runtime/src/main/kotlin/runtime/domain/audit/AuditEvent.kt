package runtime.domain.audit

import runtime.domain.command.CommandResult
import runtime.domain.obj.ObjectRef
import java.time.Instant

data class AuditEvent(
    val eventId: AuditEventId,
    val timestamp: Instant,
    val commandId: String?,
    val arguments: Map<String, Any?>,
    val result: CommandResult?,
    val affectedObjects: List<ObjectRef>,
    val sessionId: String?
)
