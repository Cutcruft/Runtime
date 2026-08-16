package runtime.domain.storage

import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId

/**
 * Per-entity object storage for projects. All project data flows through this
 * layer: commands reach it via [runtime.domain.models.Project.objectList] /
 * CommandContext, while backends (memory / files / hybrid) provide persistence,
 * load-on-miss and LRU eviction.
 *
 * Granularity is per-entity `(projectId, entityType, objectId)` (Q6). Reads are
 * snapshot reads and never block writers.
 */
interface EntityStore {

    /** Returns the model for [objectId], loading it from a cold backend on miss. */
    fun <T> get(projectId: ProjectId, entityType: EntityType, objectId: ObjectId): T?

    /** Create-only: returns false when [objectId] is already present. */
    fun <T> put(projectId: ProjectId, entityType: EntityType, objectId: ObjectId, model: T): Boolean

    /** Update semantics: returns true only when [objectId] already exists. */
    fun <T> update(projectId: ProjectId, entityType: EntityType, objectId: ObjectId, model: T): Boolean

    fun remove(projectId: ProjectId, entityType: EntityType, objectId: ObjectId): Boolean

    fun list(projectId: ProjectId, entityType: EntityType): List<ObjectId>

    fun <T> values(projectId: ProjectId, entityType: EntityType): List<T>

    fun size(projectId: ProjectId, entityType: EntityType): Int

    /** Entity types registered for the project (from its open/deserialize). */
    fun registeredEntityTypes(projectId: ProjectId): Set<EntityType>

    fun objectCount(projectId: ProjectId): Int

    fun totalObjectCount(): Int

    /** Registers [entityTypes] for a project; idempotent. */
    fun open(projectId: ProjectId, entityTypes: Set<EntityType>)

    /** Whether persisted data exists for the project on a cold backend. */
    fun exists(projectId: ProjectId): Boolean

    /** Types with persisted data for the project on a cold backend. */
    fun availableTypes(projectId: ProjectId): Set<EntityType>

    /** Flushes dirty state (write-behind backends) and releases project resources. */
    fun close(projectId: ProjectId)

    fun closeAll()
}
