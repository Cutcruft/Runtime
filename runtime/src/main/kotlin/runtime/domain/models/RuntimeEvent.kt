package runtime.domain.models

import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectId

sealed interface RuntimeEvent {
    val projectId: ProjectId

    data class ObjectChanged(
        override val projectId: ProjectId,
        val entityType: EntityType,
        val objectId: ObjectId,
        val value: Any?,
        val senderSessionId: String? = null
    ) : RuntimeEvent

    data class ProjectEvent(
        override val projectId: ProjectId,
        val type: String,
        val payload: Map<String, Any?> = emptyMap()
    ) : RuntimeEvent
}
