package runtime.domain.audit

import org.junit.jupiter.api.Test
import java.time.Instant
import kotlin.test.assertEquals

class AuditLogTest {
    @Test
    fun `should append and retrieve events`() {
        val log = AuditLog()
        val event = AuditEvent(
            eventId = AuditEventId.generate(),
            timestamp = Instant.now(),
            commandId = "demo.create",
            arguments = emptyMap(),
            result = null,
            affectedObjects = emptyList(),
            sessionId = null
        )
        log.append(event)
        assertEquals(1, log.all().size)
        assertEquals(event, log.all().first())
    }

    @Test
    fun `should clear events`() {
        val log = AuditLog()
        val event = AuditEvent(
            eventId = AuditEventId.generate(),
            timestamp = Instant.now(),
            commandId = null,
            arguments = emptyMap(),
            result = null,
            affectedObjects = emptyList(),
            sessionId = null
        )
        log.append(event)
        log.clear()
        assertEquals(0, log.all().size)
    }
}
