package runtime.application.command

import com.example.demo.CreateDocumentCommand
import com.example.demo.DocumentDefinition
import com.example.demo.ListDocumentsCommand
import com.example.demo.LoadDocumentCommand
import com.example.demo.SaveDocumentCommand
import java.util.UUID
import kotlin.test.assertEquals
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.audit.AuditService
import runtime.application.event.EventPublisher
import runtime.application.project.ProjectFactory
import runtime.domain.command.CommandResult
import runtime.domain.command.CommandResult.Status
import runtime.domain.entity.EntityType
import runtime.domain.models.Messages
import runtime.domain.models.ProjectId
import runtime.domain.models.RuntimeEvent
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.storage.DefaultEntityStore
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.obj.SynchronizedObjectList

class DocumentCommandsTest {

    private val documentType = EntityType("demo.document")

    private val commandRegistry: CommandRegistry = InMemoryCommandRegistry().apply {
        listOf(
            CreateDocumentCommand(),
            ListDocumentsCommand(),
            LoadDocumentCommand(),
            SaveDocumentCommand()
        ).forEach { register(PluginId("demo"), it) }
    }

    private fun newProject(): runtime.domain.models.Project {
        val entityRegistry = InMemoryEntityRegistry().apply { register(DocumentDefinition) }
        return ProjectFactory(entityRegistry, DefaultEntityStore()).create(ProjectId.generate())
    }

    private fun execute(project: runtime.domain.models.Project, commandId: String, params: Any?): CommandResult {
        val published = mutableListOf<RuntimeEvent>()
        val executor = CommandExecutor(
            commandRegistry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            Messages(emptyMap()),
            eventPublisher = object : EventPublisher {
                override suspend fun publish(event: RuntimeEvent) {
                    published += event
                }
            }
        )
        return runBlocking { executor.execute(project, commandId, params, sessionId = null) }
    }

    @Test
    fun `save creates a document and load returns its content`() = runBlocking {
        val project = newProject()
        val docId = UUID.randomUUID().toString()
        val saved = execute(project, "demo.savedocument", mapOf("id" to docId, "content" to "Hello, world!", "title" to "Notes"))

        assertEquals(Status.SUCCESS, saved.status)
        assertEquals(true, (saved.value as? Map<*, *>)?.get("saved"))

        val loaded = execute(project, "demo.loaddocument", mapOf("id" to docId))
        assertEquals(Status.SUCCESS, loaded.status)
        assertEquals("Hello, world!", loaded.value)
    }

    @Test
    fun `save updates existing document content`() = runBlocking {
        val project = newProject()
        val docId = UUID.randomUUID().toString()
        execute(project, "demo.savedocument", mapOf("id" to docId, "content" to "v1"))
        execute(project, "demo.savedocument", mapOf("id" to docId, "content" to "v2", "title" to "Renamed"))

        val loaded = execute(project, "demo.loaddocument", mapOf("id" to docId))
        assertEquals("v2", loaded.value)

        val listResult = execute(project, "demo.listdocuments", mapOf<String, Any>())
        val rows = listResult.value as List<*>
        assertEquals(1, rows.size)
        assertEquals("Renamed", (rows.single() as Map<*, *>)["title"])
    }

    @Test
    fun `save requires content and a valid id`() = runBlocking {
        val project = newProject()
        val missingContent = execute(project, "demo.savedocument", mapOf("id" to UUID.randomUUID().toString()))
        assertEquals(Status.ERROR, missingContent.status)

        val invalidId = execute(project, "demo.savedocument", mapOf("id" to "not-a-uuid", "content" to "x"))
        assertEquals(Status.ERROR, invalidId.status)
    }

    @Test
    fun `load of missing document returns error`() = runBlocking {
        val project = newProject()
        val result = execute(project, "demo.loaddocument", mapOf("id" to UUID.randomUUID().toString()))
        assertEquals(Status.ERROR, result.status)
    }

    @Test
    fun `load of demo document seeds a default and returns empty content`() = runBlocking {
        val project = newProject()
        val result = execute(project, "demo.loaddocument", mapOf("id" to "11111111-1111-4111-8111-111111111111"))
        assertEquals(Status.SUCCESS, result.status)
        assertEquals("", result.value)

        val listResult = execute(project, "demo.listdocuments", mapOf<String, Any>())
        val rows = listResult.value as List<*>
        assertEquals(1, rows.size)
        assertEquals("11111111-1111-4111-8111-111111111111", (rows.single() as Map<*, *>)["id"])
    }
}
