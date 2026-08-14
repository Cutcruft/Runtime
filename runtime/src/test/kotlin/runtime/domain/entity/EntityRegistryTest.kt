package runtime.domain.entity

import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityRegistry
import runtime.domain.entity.EntityType
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class EntityRegistryTest {
    @Test
    fun `should register and retrieve entity`() {
        val registry = EntityRegistry()
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
        val registry = EntityRegistry()
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
