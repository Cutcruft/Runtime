package runtime.application.command

import runtime.domain.command.CommandContext
import runtime.domain.entity.EntityType
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectList

class CommandContextImpl(
    val project: Project,
    private val projectLocks: ProjectLocks,
    private val messages: Messages
) : CommandContext {

    override fun <T> getObject(entityType: EntityType, objectId: ObjectId): T? {
        return project.objectList<T>(entityType)?.get(objectId)
    }

    override fun <T> objectList(entityType: EntityType): ObjectList<T> {
        return project.objectList<T>(entityType)
            ?: throw IllegalArgumentException(messages.format(Messages.UNKNOWN_ENTITY_TYPE, "entityType" to entityType.value))
    }

    override fun <T> withProjectLock(block: () -> T): T = projectLocks.withProjectLock(project.id, block)
}
