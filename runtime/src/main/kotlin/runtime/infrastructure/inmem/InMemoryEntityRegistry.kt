package runtime.infrastructure.inmem

import java.util.concurrent.ConcurrentHashMap
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType
import runtime.domain.repositories.EntityRegistry

class InMemoryEntityRegistry : EntityRegistry {
    private val definitions = ConcurrentHashMap<EntityType, EntityDefinition>()

    override fun register(definition: EntityDefinition) {
        val previous = definitions.putIfAbsent(definition.type, definition)
        require(previous == null) { "Entity ${definition.type} already registered" }
    }

    override fun get(type: EntityType): EntityDefinition? = definitions[type]

    override fun exists(type: EntityType): Boolean = definitions.containsKey(type)

    override fun list(): Set<EntityType> = definitions.keys.toSet()
}
