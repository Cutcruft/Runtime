package runtime.application.project

import runtime.domain.entity.EntityRegistry
import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectList
import runtime.domain.obj.SynchronizedObjectList
import runtime.domain.project.Project
import runtime.domain.project.ProjectId

class ProjectFactory(private val entityRegistry: EntityRegistry) {
    fun create(id: ProjectId): Project {
        val objectLists = mutableMapOf<EntityType, ObjectList<*>>()
        entityRegistry.list().forEach { entityType ->
            objectLists[entityType] = SynchronizedObjectList<Any>(entityType)
        }
        return Project(id, objectLists)
    }
}
