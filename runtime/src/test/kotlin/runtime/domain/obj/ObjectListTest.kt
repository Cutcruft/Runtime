package runtime.domain.obj

import runtime.domain.entity.EntityType
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class ObjectListTest {
    @Test
    fun `should create and retrieve object`() {
        val objectList = SynchronizedObjectList<String>(EntityType("test.item"))
        val ref = objectList.create("hello")
        assertEquals("hello", objectList.get(ref.objectId))
        assertEquals(EntityType("test.item"), ref.entityType)
    }

    @Test
    fun `should update object`() {
        val objectList = SynchronizedObjectList<String>(EntityType("test.item"))
        val ref = objectList.create("hello")
        assertTrue(objectList.update(ref.objectId, "world"))
        assertEquals("world", objectList.get(ref.objectId))
    }

    @Test
    fun `should delete object`() {
        val objectList = SynchronizedObjectList<String>(EntityType("test.item"))
        val ref = objectList.create("hello")
        assertTrue(objectList.delete(ref.objectId))
        assertEquals(null, objectList.get(ref.objectId))
    }

    @Test
    fun `should list objects`() {
        val objectList = SynchronizedObjectList<String>(EntityType("test.item"))
        val ref1 = objectList.create("hello")
        val ref2 = objectList.create("world")
        val list = objectList.list()
        assertEquals(2, list.size)
        assertTrue(list.any { it.objectId == ref1.objectId })
        assertTrue(list.any { it.objectId == ref2.objectId })
    }

    @Test
    fun `should create object with fixed identity`() {
        val objectList = SynchronizedObjectList<String>(EntityType("test.item"))
        val id = ObjectId.generate()
        assertTrue(objectList.create(id, "hello"))
        assertFalse(objectList.create(id, "duplicate"))
        assertEquals("hello", objectList.get(id))
    }

    @Test
    fun `should support concurrent writes`() {
        val objectList = SynchronizedObjectList<Int>(EntityType("test.item"))
        val threads = (1..8).map { n ->
            Thread {
                repeat(100) { i -> objectList.create(n * 1000 + i) }
            }
        }
        threads.forEach { it.start() }
        threads.forEach { it.join() }
        assertEquals(800, objectList.size())
    }
}
