package runtime.domain.repositories

import runtime.domain.models.AuditEvent

interface AuditLog {
    fun append(event: AuditEvent)

    fun all(): List<AuditEvent>

    fun clear()

    fun truncate(maxSize: Int)
}
