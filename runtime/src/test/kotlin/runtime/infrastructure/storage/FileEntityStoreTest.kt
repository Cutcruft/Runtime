package runtime.infrastructure.storage

import java.io.File
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import runtime.application.project.ProjectFactory
import runtime.application.project.ProjectSerializer
import runtime.application.project.ProjectService
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.domain.repositories.EntityRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.inmem.InMemoryProjectRepository

class FileEntityStoreTest {

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

    private fun dataDir() = File(tempDir, "data")

    @Test
    fun `flush and reopen round trips objects through json files`() {
        val id = ProjectId.generate()
        val a = ObjectId.generate()
        val b = ObjectId.generate()

        val first = DefaultEntityStore(FileColdStore(dataDir(), registry()))
        first.open(id, setOf(type))
        first.put(id, type, a, NoteModel("one", false))
        first.put(id, type, b, NoteModel("two", true))
        first.close(id)

        val projectDir = File(dataDir(), id.value.toString())
        assertTrue(File(projectDir, "${type.value}.json").exists())
        assertEquals(
            0,
            projectDir.listFiles { f -> f.name.endsWith(".tmp") }.size,
            "no leftover tmp files after atomic flush"
        )

        val second = DefaultEntityStore(FileColdStore(dataDir(), registry()))
        second.open(id, setOf(type))
        assertEquals(NoteModel("one", false), second.get(id, type, a))
        assertEquals(NoteModel("two", true), second.get(id, type, b))
        assertEquals(2, second.size(id, type))
    }

    @Test
    fun `removals are persisted across reopen`() {
        val id = ProjectId.generate()
        val a = ObjectId.generate()
        val b = ObjectId.generate()

        val first = DefaultEntityStore(FileColdStore(dataDir(), registry()))
        first.open(id, setOf(type))
        first.put(id, type, a, NoteModel("one", false))
        first.put(id, type, b, NoteModel("two", true))
        first.remove(id, type, a)
        first.close(id)

        val second = DefaultEntityStore(FileColdStore(dataDir(), registry()))
        second.open(id, setOf(type))
        assertNull(second.get(id, type, a))
        assertEquals(NoteModel("two", true), second.get(id, type, b))
        assertEquals(1, second.size(id, type))
    }

    @Test
    fun `project service rehydrates a closed project from files after restart`() {
        val projectId = ProjectId.generate()

        val firstStore = DefaultEntityStore(FileColdStore(dataDir(), registry()))
        val service = ProjectService(
            InMemoryProjectRepository(),
            ProjectFactory(registry(), firstStore),
            ProjectSerializer(registry(), firstStore),
            firstStore
        )
        val project = service.createProject(projectId)
        val ref = project.objectList<NoteModel>(type)!!.create(NoteModel("persisted", true))
        service.removeProject(projectId)

        val secondStore = DefaultEntityStore(FileColdStore(dataDir(), registry()))
        val secondService = ProjectService(
            InMemoryProjectRepository(),
            ProjectFactory(registry(), secondStore),
            ProjectSerializer(registry(), secondStore),
            secondStore
        )
        val restored = secondService.getProject(projectId)
        assertNotNull(restored)
        assertEquals(NoteModel("persisted", true), restored!!.objectList<NoteModel>(type)!!.get(ref.objectId))
    }

    @Test
    fun `empty store reports no persisted project`() {
        val store = DefaultEntityStore(FileColdStore(dataDir(), registry()))
        assertTrue(!store.exists(ProjectId.generate()))
    }
}
