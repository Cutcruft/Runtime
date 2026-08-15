package runtime.application.command

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock
import runtime.domain.models.ProjectId

class ProjectLocks {
    private val locks = ConcurrentHashMap<ProjectId, ReentrantLock>()

    fun lockFor(projectId: ProjectId): ReentrantLock =
        locks.computeIfAbsent(projectId) { ReentrantLock() }

    fun <T> withProjectLock(projectId: ProjectId, block: () -> T): T =
        lockFor(projectId).withLock(block)
}
