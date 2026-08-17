package runtime.infrastructure.storage

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.infrastructure.inmem.InMemoryEntityRegistry

data class TestNote(val title: String, val done: Boolean)

class DbColdStoreTest {

    private val registry = InMemoryEntityRegistry()
    private lateinit var store: DbColdStore

    @BeforeEach
    fun setUp() {
        registry.register(object : EntityDefinition {
            override val type = EntityType("demo.note")
            override val modelClass = TestNote::class.java
        })
        store = DbColdStore("jdbc:h2:mem:db_cold_store_test_${System.nanoTime()};DB_CLOSE_DELAY=-1", registry)
    }

    @AfterEach
    fun tearDown() {
        store.shutdown()
    }

    @Test
    fun `persist and load entities`() {
        val projectId = ProjectId.generate()
        val type = EntityType("demo.note")
        val id1 = ObjectId.generate()
        val id2 = ObjectId.generate()

        store.persist(projectId, type, listOf(id1 to TestNote("a", false), id2 to TestNote("b", true)))
        val loaded = store.load(projectId, type)

        assertEquals(2, loaded.size)
        assertEquals(TestNote("a", false), loaded.first { it.first == id1 }.second)
        assertEquals(TestNote("b", true), loaded.first { it.first == id2 }.second)
    }

    @Test
    fun `exists returns true after persist`() {
        val projectId = ProjectId.generate()
        val type = EntityType("demo.note")

        assertFalse(store.exists(projectId))
        store.persist(projectId, type, listOf(ObjectId.generate() to TestNote("x", false)))
        assertTrue(store.exists(projectId))
    }

    @Test
    fun `hasType returns true after persist`() {
        val projectId = ProjectId.generate()
        val type = EntityType("demo.note")

        assertFalse(store.hasType(projectId, type))
        store.persist(projectId, type, listOf(ObjectId.generate() to TestNote("x", false)))
        assertTrue(store.hasType(projectId, type))
    }

    @Test
    fun `availableTypes reflects persisted types`() {
        val projectId = ProjectId.generate()
        val type1 = EntityType("demo.note")
        val type2 = EntityType("demo.item")

        registry.register(object : EntityDefinition {
            override val type = EntityType("demo.item")
            override val modelClass = TestNote::class.java
        })

        store.persist(projectId, type1, listOf(ObjectId.generate() to TestNote("a", false)))
        store.persist(projectId, type2, listOf(ObjectId.generate() to TestNote("b", true)))

        val types = store.availableTypes(projectId)
        assertEquals(setOf(type1, type2), types)
    }

    @Test
    fun `persist empty list removes the type`() {
        val projectId = ProjectId.generate()
        val type = EntityType("demo.note")

        store.persist(projectId, type, listOf(ObjectId.generate() to TestNote("x", false)))
        assertTrue(store.hasType(projectId, type))

        store.persist(projectId, type, emptyList())
        assertFalse(store.hasType(projectId, type))
    }

    @Test
    fun `listPersistedProjects returns all projects`() {
        val p1 = ProjectId.generate()
        val p2 = ProjectId.generate()
        val type = EntityType("demo.note")

        store.persist(p1, type, listOf(ObjectId.generate() to TestNote("a", false)))
        store.persist(p2, type, listOf(ObjectId.generate() to TestNote("b", true)))

        val projects = store.listPersistedProjects()
        assertTrue(projects.contains(p1))
        assertTrue(projects.contains(p2))
        assertEquals(2, projects.size)
    }

    @Test
    fun `schema can be re-initialized idempotently`() {
        val store2 = DbColdStore("jdbc:h2:mem:db_cold_store_test_${System.nanoTime()};DB_CLOSE_DELAY=-1", registry)
        val projectId = ProjectId.generate()
        val type = EntityType("demo.note")

        store2.persist(projectId, type, listOf(ObjectId.generate() to TestNote("x", false)))
        val loaded = store2.load(projectId, type)
        assertEquals(1, loaded.size)
        store2.shutdown()
    }
}
