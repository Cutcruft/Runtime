package runtime.domain.project

import runtime.domain.audit.AuditLog
import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectList
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

class Project(
    val id: ProjectId,
    private val objectLists: Map<EntityType, ObjectList<*>>
) {
    val auditLog: AuditLog = AuditLog()

    private val lock = ReentrantLock()

    fun <T> objectList(entityType: EntityType): ObjectList<T>? {
        @Suppress("UNCHECKED_CAST")
        return objectLists[entityType] as ObjectList<T>?
    }

    fun registeredEntityTypes(): Set<EntityType> = objectLists.keys

    fun <T> withLock(block: () -> T): T = lock.withLock(block)
}
