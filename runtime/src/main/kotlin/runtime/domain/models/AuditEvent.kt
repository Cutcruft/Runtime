package runtime.domain.models

import java.time.Instant
import java.util.UUID
import runtime.domain.command.CommandResult
import runtime.domain.obj.ObjectRef

@JvmInline
value class AuditEventId(val value: UUID) {
    companion object {
        fun generate(): AuditEventId = AuditEventId(UUID.randomUUID())
    }

    override fun toString(): String = value.toString()
}

data class AuditEvent(
    val eventId: AuditEventId,
    val timestamp: Instant,
    val commandId: String?,
    val arguments: Map<String, Any?>,
    val result: CommandResult?,
    val affectedObjects: List<ObjectRef>,
    val sessionId: String?
)
