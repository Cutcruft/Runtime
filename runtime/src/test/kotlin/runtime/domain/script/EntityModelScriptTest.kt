package runtime.domain.script

import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.audit.AuditService
import runtime.application.command.CommandExecutor
import runtime.application.command.ProjectLocks
import runtime.application.event.EventPublisher
import runtime.application.project.ProjectFactory
import runtime.domain.command.CommandResult
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.models.RuntimeEvent
import runtime.domain.plugin.PluginId
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.storage.DefaultEntityStore
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.obj.SynchronizedObjectList

data class Note(val title: String, val status: String = "open")

object NoteDefinition : EntityDefinition {
    override val type = EntityType("demo.note")
    override val modelClass = Note::class.java
}

object NoteScript : EntityModelScript<Note>(NoteDefinition.type, namePrefix = "note") {
    override fun createModel(params: Any?): Note {
        val p = params as? Map<*, *> ?: error("Missing parameters")
        return Note(title = p["title"] as? String ?: error("Missing title"))
    }

    override fun updateModel(existing: Note, params: Any?): Note {
        val p = params as? Map<*, *> ?: error("Missing parameters")
        return existing.copy(title = p["title"] as? String ?: error("Missing title"))
    }

    override fun validate(model: Note): String? =
        if (model.title.isBlank()) "Title must not be blank" else null
}

class EntityModelScriptTest {

    private val messages = Messages(emptyMap())

    @Test
    fun `create returns a reference and publishes object changed`() = runBlocking {
        val published = mutableListOf<RuntimeEvent>()
        val executor = executor(published)

        val result = executor.execute(project(), "demo.notecreate", mapOf("title" to "Hello"), sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status)
        val ref = result.references.single()
        assertEquals(NoteDefinition.type, ref.entityType)
        assertEquals(1, published.size)
        assertEquals(ref.objectId, (published.single() as RuntimeEvent.ObjectChanged).objectId)
    }

    @Test
    fun `create failure is caught and returned as error`() = runBlocking {
        val executor = executor(mutableListOf())

        val result = executor.execute(project(), "demo.notecreate", mapOf<String, Any?>(), sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue("Missing title" in (result.error ?: ""), result.error ?: "")
    }

    @Test
    fun `update applies the model and keeps identity`() = runBlocking {
        val executor = executor(mutableListOf())
        val project = project()

        val created = executor.execute(project, "demo.notecreate", mapOf("title" to "First"), sessionId = null)
        val id = created.references.single().objectId

        val updated = executor.execute(
            project, "demo.noteupdate",
            mapOf("id" to id.value.toString(), "title" to "Second"),
            sessionId = null
        )

        assertEquals(CommandResult.Status.SUCCESS, updated.status)
        assertEquals(id, updated.references.single().objectId)
        val model = (updated.value as Note)
        assertEquals("Second", model.title)
        val stored = project.objectList<Note>(NoteDefinition.type)!!.get(id)
        assertEquals("Second", stored?.title)
    }

    @Test
    fun `update of missing entity returns error`() = runBlocking {
        val executor = executor(mutableListOf())

        val result = executor.execute(
            project(), "demo.noteupdate",
            mapOf("id" to "00000000-0000-0000-0000-000000000000", "title" to "Nope"),
            sessionId = null
        )

        assertEquals(CommandResult.Status.ERROR, result.status)
    }

    @Test
    fun `delete removes the entity and reports a reference`() = runBlocking {
        val executor = executor(mutableListOf())
        val project = project()

        val created = executor.execute(project, "demo.notecreate", mapOf("title" to "Gone"), sessionId = null)
        val id = created.references.single().objectId

        val deleted = executor.execute(project, "demo.notedelete", mapOf("id" to id.value.toString()), sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, deleted.status)
        assertEquals(id, deleted.references.single().objectId)
        assertEquals(null, project.objectList<Note>(NoteDefinition.type)!!.get(id))
    }

    @Test
    fun `validate checks the model without writing`() = runBlocking {
        val executor = executor(mutableListOf())

        val valid = executor.execute(project(), "demo.notevalidate", mapOf("title" to "Ok"), sessionId = null)
        val invalid = executor.execute(project(), "demo.notevalidate", mapOf("title" to "  "), sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, valid.status)
        assertEquals(true, (valid.value as Map<*, *>)["valid"])
        assertEquals(CommandResult.Status.ERROR, invalid.status)
        assertTrue("blank" in (invalid.error ?: ""), invalid.error ?: "")
    }

    @Test
    fun `validate command is read only`() {
        assertTrue(NoteScript.validateCommand().readOnly)
        assertTrue(!NoteScript.createCommand().readOnly)
    }

    @Test
    fun `generated commands are distinct`() {
        val names = listOf(
            NoteScript.createCommand(),
            NoteScript.updateCommand(),
            NoteScript.deleteCommand(),
            NoteScript.validateCommand()
        ).map { it.name }.toSet()
        assertEquals(4, names.size)
        assertNotEquals("", NoteScript.createCommand().description)
    }

    private fun executor(published: MutableList<RuntimeEvent>): CommandExecutor {
        val commandRegistry = InMemoryCommandRegistry()
        val pluginId = PluginId("demo")
        listOf(
            NoteScript.createCommand(),
            NoteScript.updateCommand(),
            NoteScript.deleteCommand(),
            NoteScript.validateCommand()
        ).forEach { commandRegistry.register(pluginId, it) }
        return CommandExecutor(
            commandRegistry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            messages,
            eventPublisher = object : EventPublisher {
                override suspend fun publish(event: RuntimeEvent) {
                    published += event
                }
            }
        )
    }

    private fun project(): Project {
        val entityRegistry = InMemoryEntityRegistry()
        entityRegistry.register(NoteDefinition)
        return ProjectFactory(entityRegistry, DefaultEntityStore())
            .create(ProjectId.generate())
    }
}
