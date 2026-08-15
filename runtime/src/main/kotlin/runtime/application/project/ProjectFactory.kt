package runtime.application.project

import runtime.domain.entity.EntityType
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectList
import runtime.domain.repositories.EntityRegistry

class ProjectFactory(
    private val entityRegistry: EntityRegistry,
    private val objectListFactory: (EntityType) -> ObjectList<Any>
) {
    fun create(id: ProjectId): Project {
        val objectLists = mutableMapOf<EntityType, ObjectList<*>>()
        entityRegistry.list().forEach { entityType ->
            objectLists[entityType] = objectListFactory(entityType)
        }
        return Project(id, objectLists)
    }
}
