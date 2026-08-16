package runtime.application.project

import runtime.domain.entity.EntityType
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.repositories.EntityRegistry
import runtime.domain.storage.EntityStore
import runtime.infrastructure.obj.StoreObjectList

class ProjectFactory(
    private val entityRegistry: EntityRegistry,
    private val store: EntityStore
) {
    fun create(id: ProjectId): Project {
        val types = entityRegistry.list().toSet()
        store.open(id, types)
        val objectLists = types.associateWith { StoreObjectList<Any>(store, id, it) }
        return Project(id, objectLists)
    }
}
