package runtime.domain.project

import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectList
import runtime.domain.obj.SynchronizedObjectList
import org.junit.jupiter.api.Test
import kotlin.concurrent.thread
import kotlin.test.assertEquals

class ProjectTest {
    @Test
    fun `withLock should serialize concurrent blocks`() {
        val project = Project(
            id = ProjectId.generate(),
            objectLists = mapOf(EntityType("test.item") to SynchronizedObjectList<Int>(EntityType("test.item")))
        )
        val list = project.objectList<Int>(EntityType("test.item"))!!

        val threads = (1..4).map { n ->
            thread {
                repeat(25) {
                    project.withLock {
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
