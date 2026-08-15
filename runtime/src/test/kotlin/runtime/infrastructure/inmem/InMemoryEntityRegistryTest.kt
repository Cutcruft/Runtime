package runtime.infrastructure.inmem

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType

class InMemoryEntityRegistryTest {
    @Test
    fun `should register and retrieve entity`() {
        val registry = InMemoryEntityRegistry()
        val definition = object : EntityDefinition {
            override val type = EntityType("test.entity")
            override val modelClass = String::class.java
        }
        registry.register(definition)
        assertEquals(definition, registry.get(EntityType("test.entity")))
        assertTrue(registry.exists(EntityType("test.entity")))
    }

    @Test
    fun `should throw on duplicate entity type`() {
        val registry = InMemoryEntityRegistry()
        val definition = object : EntityDefinition {
            override val type = EntityType("test.entity")
            override val modelClass = String::class.java
        }
        registry.register(definition)
        assertThrows<IllegalArgumentException> {
            registry.register(definition)
        }
    }
}
