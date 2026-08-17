package runtime.infrastructure.storage

import java.io.File
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.models.StorageConfig
import runtime.domain.obj.ObjectId
import runtime.domain.repositories.EntityRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry

class StorageFactoryTest {

    @TempDir
    lateinit var tempDir: File

    private val registry: EntityRegistry = InMemoryEntityRegistry()

    private fun config(
        backend: String = "memory",
        enabled: Boolean = false,
        maxEntities: Int = -1,
        eviction: String = "lru",
        directory: String? = null,
        redisUrl: String? = null,
        dbUrl: String? = null
    ) = StorageConfig(backend, enabled, maxEntities, eviction, directory ?: File(tempDir, "data").path, redisUrl, dbUrl)

    @Test
    fun `unknown backend is rejected`() {
        val e = assertFailsWith<IllegalArgumentException> { StorageFactory().create(config(backend = "s3"), registry) }
        assertTrue(e.message!!.contains("s3"))
    }

    @Test
    fun `redis backend requires url`() {
        val e = assertFailsWith<IllegalArgumentException> {
            StorageFactory().create(config(backend = "redis"), registry)
        }
        assertTrue(e.message!!.contains("redis.url"))
    }

    @Test
    fun `db backend requires url`() {
        val e = assertFailsWith<IllegalArgumentException> {
            StorageFactory().create(config(backend = "db"), registry)
        }
        assertTrue(e.message!!.contains("db.url"))
    }

    @Test
    fun `zero maxEntities is rejected`() {
        val e = assertFailsWith<IllegalArgumentException> { StorageFactory().create(config(maxEntities = 0), registry) }
        assertTrue(e.message!!.contains("maxEntities"))
    }

    @Test
    fun `unsupported eviction policy is rejected`() {
        val e = assertFailsWith<IllegalArgumentException> { StorageFactory().create(config(eviction = "fifo"), registry) }
        assertTrue(e.message!!.contains("lru"))
    }

    @Test
    fun `disabled backend forces pure memory store`() {
        val result = StorageFactory().create(config(backend = "hybrid", enabled = false, maxEntities = 5), registry)
        val store = result.store
        val id = ProjectId.generate()
        store.open(id, setOf())
        assertFalse(store.exists(id), "no cold layer when storage is disabled")
        assertFalse(File(tempDir, "data").exists(), "no storage directory is created when disabled")
    }

    @Test
    fun `files backend keeps directory absent until flush`() {
        val result = StorageFactory().create(config(backend = "files", enabled = true), registry)
        val store = result.store
        val dir = File(tempDir, "data")
        assertFalse(dir.exists(), "directory is created lazily on first flush")
        val id = ProjectId.generate()
        store.open(id, setOf())
        assertTrue(store.exists(id).not() || dir.exists(), "exists follows the cold backend")
    }

    @Test
    fun `hybrid backend caps the hot layer`() {
        val result = StorageFactory().create(config(backend = "hybrid", enabled = true, maxEntities = 2), registry)
        val store = result.store
        val id = ProjectId.generate()
        val type = EntityType("demo.x")
        store.open(id, setOf(type))
        (1..3).forEach { store.put(id, type, ObjectId.generate(), "v$it") }
        assertEquals(2, store.totalObjectCount(), "factory must wire the configured cap")
    }
}
