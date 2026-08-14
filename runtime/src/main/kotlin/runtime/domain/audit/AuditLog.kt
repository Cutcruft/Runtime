package runtime.domain.audit

import java.util.concurrent.CopyOnWriteArrayList

class AuditLog {
    private val events = CopyOnWriteArrayList<AuditEvent>()

    fun append(event: AuditEvent) {
        events.add(event)
    }

    fun all(): List<AuditEvent> = events.toList()

    fun clear() {
        events.clear()
    }
}
