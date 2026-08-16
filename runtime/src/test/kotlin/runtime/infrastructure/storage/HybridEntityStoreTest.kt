package runtime.infrastructure.storage

import java.io.File
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.domain.repositories.EntityRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry

class HybridEntityStoreTest {

    @TempDir
    lateinit var tempDir: File

    private val type = EntityType("demo.note")

    private fun registry(): EntityRegistry {
        val registry = InMemoryEntityRegistry()
        registry.register(object : EntityDefinition {
            override val type = EntityType("demo.note")
            override val modelClass = NoteModel::class.java
        })
        return registry
    }

    @Test
    fun `evicted entities are flushed to cold and reloaded on access`() {
        val store = DefaultEntityStore(FileColdStore(File(tempDir, "data"), registry()), maxEntities = 3)
        val id = ProjectId.generate()
        store.open(id, setOf(type))
        val ids = (1..4).map { ObjectId.generate() }
        ids.forEachIndexed { i, objectId ->
            store.put(id, type, objectId, NoteModel("note${i + 1}", i % 2 == 0))
        }

        assertEquals(3, store.totalObjectCount(), "hot layer must stay within the cap")

        store.get<NoteModel>(id, type, ids[0])
        val hotTitles = store.values<NoteModel>(id, type).map { it.title }
        assertTrue(hotTitles.contains("note1"), "least recently used entity reloads from cold")
        assertTrue(hotTitles.contains("note3"))
        assertTrue(hotTitles.contains("note4"))
        assertFalse(hotTitles.contains("note2"), "next LRU entity was evicted to cold")

        assertEquals(NoteModel("note2", false), store.get(id, type, ids[1]), "evicted entity is reloadable")
        assertEquals(3, store.totalObjectCount(), "cap holds after reload")
    }

    @Test
    fun `closeAll persists the whole project and a fresh store reads it back`() {
        val store = DefaultEntityStore(FileColdStore(File(tempDir, "data"), registry()), maxEntities = 3)
        val id = ProjectId.generate()
        store.open(id, setOf(type))
        val ids = (1..4).map { ObjectId.generate() }
        ids.forEachIndexed { i, objectId ->
            store.put(id, type, objectId, NoteModel("note${i + 1}", i % 2 == 0))
        }
        store.closeAll()

        val reopened = DefaultEntityStore(FileColdStore(File(tempDir, "data"), registry()), maxEntities = 3)
        reopened.open(id, setOf(type))
        assertEquals(3, reopened.size(id, type), "capped hot layer after reopen")
        assertEquals(NoteModel("note1", true), reopened.get(id, type, ids[0]), "cold-spilled entity is readable")
        assertEquals(NoteModel("note2", false), reopened.get(id, type, ids[1]))
        assertEquals(NoteModel("note3", true), reopened.get(id, type, ids[2]))
        assertEquals(NoteModel("note4", false), reopened.get(id, type, ids[3]))
    }
}
