package runtime.infrastructure.storage

import java.util.UUID
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId

/** Identity of a single entity object inside the store. */
data class EntityKey(val projectId: UUID, val type: String, val objectId: UUID) {
    companion object {
        fun of(projectId: ProjectId, entityType: EntityType, objectId: ObjectId): EntityKey =
            EntityKey(projectId.value, entityType.value, objectId.value)
    }
}

/** Identity of a (project, entity type) bucket — used for the write-behind dirty set. */
data class ProjectTypeKey(val projectId: UUID, val type: String)
