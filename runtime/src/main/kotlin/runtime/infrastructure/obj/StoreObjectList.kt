package runtime.infrastructure.obj

import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectList
import runtime.domain.obj.ObjectRef
import runtime.domain.storage.EntityStore

/**
 * An [ObjectList] view over an [EntityStore] for a single project/type pair.
 * All commands and scripts access project data through this facade, so every
 * object operation is per-entity and reaches the active backend.
 */
class StoreObjectList<T>(
    private val store: EntityStore,
    private val projectId: ProjectId,
    override val entityType: EntityType
) : ObjectList<T> {

    override fun create(model: T): ObjectRef {
        val objectId = ObjectId.generate()
        store.put(projectId, entityType, objectId, model as Any)
        return ObjectRef(entityType, objectId)
    }

    override fun create(objectId: ObjectId, model: T): Boolean =
        store.put(projectId, entityType, objectId, model as Any)

    @Suppress("UNCHECKED_CAST")
    override fun get(objectId: ObjectId): T? = store.get(projectId, entityType, objectId)

    override fun update(objectId: ObjectId, model: T): Boolean =
        store.update(projectId, entityType, objectId, model as Any)

    override fun delete(objectId: ObjectId): Boolean =
        store.remove(projectId, entityType, objectId)

    override fun list(): List<ObjectRef> =
        store.list(projectId, entityType).map { ObjectRef(entityType, it) }

    @Suppress("UNCHECKED_CAST")
    override fun values(): List<T> = store.values<Any>(projectId, entityType) as List<T>

    override fun size(): Int = store.size(projectId, entityType)
}
