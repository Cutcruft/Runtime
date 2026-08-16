package runtime.infrastructure.storage

import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.infrastructure.obj.StoreObjectList

data class NoteModel(val title: String, val done: Boolean)

class InMemoryEntityStoreTest {

    private val type = EntityType("demo.note")

    @Test
    fun `put get update remove round trip through store interface`() {
        val store = DefaultEntityStore()
        val projectId = ProjectId.generate()
        store.open(projectId, setOf(type))

        val id = ObjectId.generate()
        assertTrue(store.put(projectId, type, id, NoteModel("a", false)))
        assertFalse(store.put(projectId, type, id, NoteModel("b", false)), "create-only semantics")

        assertEquals(NoteModel("a", false), store.get(projectId, type, id))
        assertTrue(store.update(projectId, type, id, NoteModel("a", true)))
        assertEquals(NoteModel("a", true), store.get(projectId, type, id))
        assertFalse(store.update(projectId, type, ObjectId.generate(), NoteModel("x", false)))

        assertEquals(1, store.size(projectId, type))
        assertEquals(1, store.objectCount(projectId))
        assertEquals(1, store.totalObjectCount())
        assertTrue(store.list(projectId, type).contains(id))

        assertTrue(store.remove(projectId, type, id))
        assertNull(store.get(projectId, type, id))
        assertEquals(0, store.size(projectId, type))
    }

    @Test
    fun `object list facade routes through the store`() {
        val store = DefaultEntityStore()
        val projectId = ProjectId.generate()
        store.open(projectId, setOf(type))
        val list = StoreObjectList<NoteModel>(store, projectId, type)

        val ref1 = list.create(NoteModel("a", false))
        val ref2 = list.create(NoteModel("b", true))

        assertEquals(2, list.size())
        assertEquals(NoteModel("a", false), list.get(ref1.objectId))
        assertTrue(list.values().contains(NoteModel("b", true)))
        assertEquals(setOf(ref1.objectId, ref2.objectId), list.list().map { it.objectId }.toSet())

        assertTrue(list.delete(ref1.objectId))
        assertEquals(1, list.size())
    }

    @Test
    fun `lru eviction drops least recently used entities above the cap`() {
        val store = DefaultEntityStore(maxEntities = 2)
        val projectId = ProjectId.generate()
        store.open(projectId, setOf(type))

        val a = ObjectId.generate()
        val b = ObjectId.generate()
        val c = ObjectId.generate()
        store.put(projectId, type, a, NoteModel("a", false))
        store.put(projectId, type, b, NoteModel("b", false))
        store.put(projectId, type, c, NoteModel("c", false))

        assertEquals(2, store.totalObjectCount(), "hot layer must stay within the cap")
        assertNull(store.get<NoteModel>(projectId, type, a), "least recently used entity is evicted first")
        assertTrue(store.get<NoteModel>(projectId, type, b) is NoteModel)
        assertTrue(store.get<NoteModel>(projectId, type, c) is NoteModel)
    }

    @Test
    fun `unlimited store keeps all entities`() {
        val store = DefaultEntityStore()
        val projectId = ProjectId.generate()
        store.open(projectId, setOf(type))
        repeat(10) { i ->
            store.put(projectId, type, ObjectId.generate(), NoteModel("t$i", false))
        }
        assertEquals(10, store.totalObjectCount())
    }
}
