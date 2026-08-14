package runtime.domain.entity

import java.util.concurrent.ConcurrentHashMap

class EntityRegistry {
    private val definitions = ConcurrentHashMap<EntityType, EntityDefinition>()

    fun register(definition: EntityDefinition) {
        val previous = definitions.putIfAbsent(definition.type, definition)
        require(previous == null) { "Entity ${definition.type} already registered" }
    }

    fun get(type: EntityType): EntityDefinition? = definitions[type]

    fun exists(type: EntityType): Boolean = definitions.containsKey(type)

    fun list(): Set<EntityType> = definitions.keys.toSet()
}
