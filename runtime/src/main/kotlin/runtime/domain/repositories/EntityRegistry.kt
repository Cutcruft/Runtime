package runtime.domain.repositories

import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType

interface EntityRegistry {
    fun register(definition: EntityDefinition)

    fun get(type: EntityType): EntityDefinition?

    fun exists(type: EntityType): Boolean

    fun list(): Set<EntityType>
}
