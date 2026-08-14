package runtime.application.command

import runtime.domain.command.CommandContext
import runtime.domain.command.ProjectBoundCommandContext
import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectList
import runtime.domain.project.Project

class CommandContextImpl(
    override val project: Project
) : ProjectBoundCommandContext {

    override fun <T> getObject(entityType: EntityType, objectId: ObjectId): T? {
        return project.objectList<T>(entityType)?.get(objectId)
    }

    override fun <T> objectList(entityType: EntityType): ObjectList<T> {
        return project.objectList<T>(entityType)
            ?: throw IllegalArgumentException("Unknown entity type: $entityType")
    }

    override fun <T> withProjectLock(block: () -> T): T = project.withLock(block)
}
