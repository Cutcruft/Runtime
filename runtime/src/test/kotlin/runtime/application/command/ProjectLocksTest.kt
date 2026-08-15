package runtime.application.command

import kotlin.concurrent.thread
import kotlin.test.assertEquals
import org.junit.jupiter.api.Test
import runtime.domain.entity.EntityType
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectList
import runtime.infrastructure.obj.SynchronizedObjectList

class ProjectLocksTest {
    @Test
    fun `withProjectLock should serialize concurrent blocks`() {
        val project = Project(
            id = ProjectId.generate(),
            objectLists = mapOf(EntityType("test.item") to SynchronizedObjectList<Int>(EntityType("test.item")))
        )
        val locks = ProjectLocks()
        val list = project.objectList<Int>(EntityType("test.item"))!!

        val threads = (1..4).map { n ->
            thread {
                repeat(25) {
                    locks.withProjectLock(project.id) {
                        val next = list.size() + 1
                        list.create(next)
                    }
                }
            }
        }
        threads.forEach { it.join() }

        assertEquals(100, list.size())
        assertEquals((1..100).sum(), list.values().sum())
    }
}
