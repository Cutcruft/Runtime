package runtime.domain.obj

import runtime.domain.entity.EntityType

data class ObjectRef(
    val entityType: EntityType,
    val objectId: ObjectId
)
