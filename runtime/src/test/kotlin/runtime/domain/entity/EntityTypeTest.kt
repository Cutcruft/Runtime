package runtime.domain.entity

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class EntityTypeTest {
    @Test
    fun `should create valid entity type`() {
        val type = EntityType("server.server")
        assertEquals("server.server", type.value)
    }

    @Test
    fun `should throw on blank entity type`() {
        assertThrows<IllegalArgumentException> { EntityType("") }
    }

    @Test
    fun `should throw on invalid entity type format`() {
        assertThrows<IllegalArgumentException> { EntityType("invalid") }
    }
}
