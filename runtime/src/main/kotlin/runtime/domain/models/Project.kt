package runtime.domain.models

import java.util.UUID
import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectList

@JvmInline
value class ProjectId(val value: UUID) {
    companion object {
        fun generate(): ProjectId = ProjectId(UUID.randomUUID())
    }

    override fun toString(): String = value.toString()
}

class Project(
    val id: ProjectId,
    private val objectLists: Map<EntityType, ObjectList<*>>
) {
    fun <T> objectList(entityType: EntityType): ObjectList<T>? {
        @Suppress("UNCHECKED_CAST")
        return objectLists[entityType] as ObjectList<T>?
    }

    fun registeredEntityTypes(): Set<EntityType> = objectLists.keys
}
