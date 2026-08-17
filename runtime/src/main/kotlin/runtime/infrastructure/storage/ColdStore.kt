package runtime.infrastructure.storage

import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId

/**
 * Cold (persistent) storage layer used by the files/hybrid/redis/db backends.
 * Write-behind: the hot layer flushes whole (project, type) buckets here.
 */
interface ColdStore {
    fun load(projectId: ProjectId, entityType: EntityType): List<Pair<ObjectId, Any>>

    fun persist(projectId: ProjectId, entityType: EntityType, objects: List<Pair<ObjectId, Any>>)

    fun hasType(projectId: ProjectId, entityType: EntityType): Boolean

    fun exists(projectId: ProjectId): Boolean

    fun availableTypes(projectId: ProjectId): Set<EntityType>

    /** All project IDs that have persisted data. Default: empty (in-memory only). */
    fun listPersistedProjects(): Set<ProjectId> = emptySet()

    fun close(projectId: ProjectId)

    fun closeAll()
}
