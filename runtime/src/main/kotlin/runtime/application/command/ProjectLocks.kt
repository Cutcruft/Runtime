package runtime.application.command

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import runtime.domain.models.ProjectId

/**
 * Per-project read/write locks for command execution.
 *
 * Every command is automatically run under the appropriate lock:
 *  - read-only commands ([runtime.domain.command.Command.readOnly]) take the shared read
 *    lock and run in parallel with other read-only commands on the same project;
 *  - mutating commands take the exclusive write lock, serializing against both other
 *    writers and readers.
 *
 * Built on [Mutex], which is reentrant per coroutine and cancellation-safe, and is NOT
 * thread-affine — a command may suspend (e.g. `delay`) and resume on a different thread
 * while still holding the lock. Reader preference applies (analytical reads dominate);
 * read -> write upgrade on the same coroutine is not supported and would deadlock.
 */
class ProjectLocks {
    private class ProjectLock {
        val readersGate = Mutex()
        val sharedGate = Mutex()
        var readerCount = 0
        val legacyLock = ReentrantLock()
    }

    private val locks = ConcurrentHashMap<ProjectId, ProjectLock>()

    suspend fun <T> withRead(projectId: ProjectId, block: suspend () -> T): T {
        val lock = lockFor(projectId)
        lock.readersGate.withLock {
            lock.readerCount++
            if (lock.readerCount == 1) {
                lock.sharedGate.lock()
            }
        }
        try {
            return block()
        } finally {
            // Invariant: the shared gate is held exactly while readerCount > 0.
            // The last reader to exit (whoever that is) releases it.
            lock.readersGate.withLock {
                lock.readerCount--
                if (lock.readerCount == 0) {
                    lock.sharedGate.unlock()
                }
            }
        }
    }

    suspend fun <T> withWrite(projectId: ProjectId, block: suspend () -> T): T {
        val lock = lockFor(projectId)
        return lock.sharedGate.withLock { block() }
    }

    /** Legacy blocking exclusive lock used by compound commands for manual coordination. */
    fun <T> withProjectLock(projectId: ProjectId, block: () -> T): T =
        lockFor(projectId).legacyLock.withLock(block)

    private fun lockFor(projectId: ProjectId): ProjectLock =
        locks.computeIfAbsent(projectId) { ProjectLock() }
}