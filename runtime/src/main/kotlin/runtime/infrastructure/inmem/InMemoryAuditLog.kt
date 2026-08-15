package runtime.infrastructure.inmem

import java.util.concurrent.CopyOnWriteArrayList
import runtime.domain.models.AuditEvent
import runtime.domain.repositories.AuditLog

class InMemoryAuditLog : AuditLog {
    private val events = CopyOnWriteArrayList<AuditEvent>()

    override fun append(event: AuditEvent) {
        events.add(event)
    }

    override fun all(): List<AuditEvent> = events.toList()

    override fun clear() {
        events.clear()
    }

    override fun truncate(maxSize: Int) {
        while (events.size > maxSize) {
            events.removeAt(0)
        }
    }
}
