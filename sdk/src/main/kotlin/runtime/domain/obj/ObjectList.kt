package runtime.domain.obj

import runtime.domain.entity.EntityType

interface ObjectList<T> {
    val entityType: EntityType

    fun create(model: T): ObjectRef

    fun create(objectId: ObjectId, model: T): Boolean

    fun get(objectId: ObjectId): T?

    fun update(objectId: ObjectId, model: T): Boolean

    fun delete(objectId: ObjectId): Boolean

    fun list(): List<ObjectRef>

    fun values(): List<T>

    fun size(): Int
}
