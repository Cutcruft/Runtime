package runtime.infrastructure.inmem

import java.time.Instant
import kotlin.test.assertEquals
import org.junit.jupiter.api.Test
import runtime.domain.models.AuditEvent
import runtime.domain.models.AuditEventId

class InMemoryAuditLogTest {
    private fun event(seed: Int) = AuditEvent(
        eventId = AuditEventId.generate(),
        timestamp = Instant.now(),
        commandId = "demo.create",
        arguments = emptyMap(),
        result = null,
        affectedObjects = emptyList(),
        sessionId = null
    )

    @Test
    fun `should append and retrieve events`() {
        val log = InMemoryAuditLog()
        val event = event(1)
        log.append(event)
        assertEquals(1, log.all().size)
        assertEquals(event, log.all().first())
    }

    @Test
    fun `should clear events`() {
        val log = InMemoryAuditLog()
        log.append(event(1))
        log.clear()
        assertEquals(0, log.all().size)
    }

    @Test
    fun `should truncate to max size keeping the newest events`() {
        val log = InMemoryAuditLog()
        repeat(5) { log.append(event(it)) }
        log.truncate(3)
        assertEquals(3, log.all().size)
        log.append(event(99))
        log.truncate(3)
        assertEquals(3, log.all().size)
    }
}
