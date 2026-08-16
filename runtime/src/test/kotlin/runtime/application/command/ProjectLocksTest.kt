package runtime.application.command

import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import kotlin.concurrent.thread
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
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

    @Test
    fun `read locks can be held concurrently`() = runBlocking {
        val project = projectOf()
        val locks = ProjectLocks()

        val firstIn = CountDownLatch(1)
        val secondIn = CountDownLatch(1)
        val release = CountDownLatch(1)

        val job1 = launch(Dispatchers.Default) {
            locks.withRead(project.id) {
                firstIn.countDown()
                release.await()
            }
        }
        val job2 = launch(Dispatchers.Default) {
            assertTrue(firstIn.await(2, TimeUnit.SECONDS))
            locks.withRead(project.id) { secondIn.countDown() }
        }

        assertTrue(firstIn.await(2, TimeUnit.SECONDS))
        assertTrue(secondIn.await(2, TimeUnit.SECONDS))
        release.countDown()
        job1.join()
        job2.join()
    }

    @Test
    fun `write lock excludes readers until released`() = runBlocking {
        val project = projectOf()
        val locks = ProjectLocks()

        val readerHolding = CountDownLatch(1)
        val readerReleased = CountDownLatch(1)
        val writerEntered = CountDownLatch(1)

        val job1 = launch(Dispatchers.Default) {
            locks.withRead(project.id) {
                readerHolding.countDown()
                readerReleased.await()
            }
        }
        assertTrue(readerHolding.await(2, TimeUnit.SECONDS))

        val job2 = launch(Dispatchers.Default) {
            locks.withWrite(project.id) { writerEntered.countDown() }
        }
        assertTrue(!writerEntered.await(400, TimeUnit.MILLISECONDS))
        readerReleased.countDown()
        assertTrue(writerEntered.await(2, TimeUnit.SECONDS))
        job1.join()
        job2.join()
    }

    @Test
    fun `write lock excludes other writers`() = runBlocking {
        val project = projectOf()
        val locks = ProjectLocks()

        val writer1Holding = CountDownLatch(1)
        val writer1Released = CountDownLatch(1)
        val writer2Entered = CountDownLatch(1)

        val job1 = launch(Dispatchers.Default) {
            locks.withWrite(project.id) {
                writer1Holding.countDown()
                writer1Released.await()
            }
        }
        assertTrue(writer1Holding.await(2, TimeUnit.SECONDS))

        val job2 = launch(Dispatchers.Default) {
            locks.withWrite(project.id) { writer2Entered.countDown() }
        }
        assertTrue(!writer2Entered.await(400, TimeUnit.MILLISECONDS))
        writer1Released.countDown()
        assertTrue(writer2Entered.await(2, TimeUnit.SECONDS))
        job1.join()
        job2.join()
    }

    @Test
    fun `write proceeds after all readers have left`() = runBlocking {
        val project = projectOf()
        val locks = ProjectLocks()

        val allReadersIn = CountDownLatch(2)
        val releaseReaders = CountDownLatch(1)
        val writerEntered = CountDownLatch(1)

        val readers = (1..2).map {
            launch(Dispatchers.Default) {
                locks.withRead(project.id) {
                    allReadersIn.countDown()
                    releaseReaders.await()
                }
            }
        }
        assertTrue(allReadersIn.await(2, TimeUnit.SECONDS))
        releaseReaders.countDown()
        readers.forEach { it.join() }

        // Gate must be released after the readers exit — a write must not hang.
        val writer = launch(Dispatchers.Default) {
            locks.withWrite(project.id) { writerEntered.countDown() }
        }
        assertTrue(writerEntered.await(2, TimeUnit.SECONDS))
        writer.join()
    }

    private fun projectOf(): Project = Project(
        id = ProjectId.generate(),
        objectLists = mapOf(EntityType("test.item") to SynchronizedObjectList<Int>(EntityType("test.item")))
    )
}
