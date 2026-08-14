package runtime.domain.command

import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectList

interface CommandContext {
    fun <T> getObject(entityType: EntityType, objectId: ObjectId): T?

    fun <T> objectList(entityType: EntityType): ObjectList<T>

    fun <T> withProjectLock(block: () -> T): T
}
