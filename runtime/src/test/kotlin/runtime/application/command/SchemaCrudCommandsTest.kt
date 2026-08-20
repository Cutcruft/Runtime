package runtime.application.command

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.audit.AuditService
import runtime.application.event.EventPublisher
import runtime.application.project.ProjectFactory
import runtime.domain.command.CommandResult
import runtime.domain.command.CommandResult.Status
import runtime.domain.entity.EntityField
import runtime.domain.entity.EntitySchema
import runtime.domain.entity.EntityType
import runtime.domain.entity.FieldType
import runtime.domain.entity.SchemaEntityDefinition
import runtime.domain.models.Messages
import runtime.domain.models.ProjectId
import runtime.domain.models.RuntimeEvent
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.domain.script.SchemaCrudCommands
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.storage.DefaultEntityStore

class SchemaCrudCommandsTest {

    private val taskSchema = EntitySchema(
        entityType = EntityType("demo.task"),
        titleField = "title",
        fields = listOf(
            EntityField("title", FieldType.STRING, required = true, min = 3.0),
            EntityField("status", FieldType.ENUM, enumValues = listOf("open", "done"), defaultValue = "open")
        )
    )

    private fun createEnvironment(): Triple<CommandRegistry, CommandExecutor, runtime.domain.models.Project> {
        val entityRegistry = InMemoryEntityRegistry().apply { register(SchemaEntityDefinition(taskSchema.entityType, taskSchema)) }
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        commandRegistry.register(PluginId("demo"), SchemaCrudCommands.create(taskSchema))
        commandRegistry.register(PluginId("demo"), SchemaCrudCommands.update(taskSchema))
        commandRegistry.register(PluginId("demo"), SchemaCrudCommands.delete(taskSchema))
        commandRegistry.register(PluginId("demo"), SchemaCrudCommands.list(taskSchema))
        commandRegistry.register(PluginId("demo"), SchemaCrudCommands.validate(taskSchema))

        val executor = CommandExecutor(
            commandRegistry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            Messages(emptyMap()),
            eventPublisher = object : EventPublisher {
                override suspend fun publish(event: RuntimeEvent) {}
            }
        )
        val project = ProjectFactory(entityRegistry, DefaultEntityStore()).create(ProjectId.generate())
        return Triple(commandRegistry, executor, project)
    }

    @Test
    fun `create stores model and list returns it`() = runBlocking {
        val (_, executor, project) = createEnvironment()
        val created = executor.execute(project, "demo.taskcreate", mapOf("title" to "Hello task"), null)
        assertEquals(Status.SUCCESS, created.status)
        assertEquals("Hello task", (created.value as Map<*, *>)["title"])

        val listed = executor.execute(project, "demo.tasklist", mapOf<String, Any>(), null)
        assertEquals(Status.SUCCESS, listed.status)
        val rows = listed.value as List<*>
        assertEquals(1, rows.size)
        assertEquals("Hello task", (rows.single() as Map<*, *>)["title"])
    }

    @Test
    fun `create applies default value for absent field`() = runBlocking {
        val (_, executor, project) = createEnvironment()
        val created = executor.execute(project, "demo.taskcreate", mapOf("title" to "Task with default"), null)
        assertEquals(Status.SUCCESS, created.status)
        assertEquals("open", (created.value as Map<*, *>)["status"])
    }

    @Test
    fun `create missing required field returns fieldErrors`() = runBlocking {
        val (_, executor, project) = createEnvironment()
        val result = executor.execute(project, "demo.taskcreate", mapOf<String, Any>(), null)
        assertEquals(Status.ERROR, result.status)
        assertTrue(result.fieldErrors.any { it.field == "title" && it.code == "required" })
    }

    @Test
    fun `create invalid enum returns fieldErrors`() = runBlocking {
        val (_, executor, project) = createEnvironment()
        val result = executor.execute(project, "demo.taskcreate", mapOf("title" to "ok", "status" to "archived"), null)
        assertEquals(Status.ERROR, result.status)
        assertTrue(result.fieldErrors.any { it.field == "status" && it.code == "enum" })
    }

    @Test
    fun `update merges existing and new fields`() = runBlocking {
        val (_, executor, project) = createEnvironment()
        executor.execute(project, "demo.taskcreate", mapOf("title" to "Version one"), null)
        val listed = executor.execute(project, "demo.tasklist", mapOf<String, Any>(), null)
        val id = ((listed.value as List<*>).single() as Map<*, *>)["id"]

        val updated = executor.execute(project, "demo.taskupdate", mapOf("id" to id, "status" to "done"), null)
        assertEquals(Status.SUCCESS, updated.status)
        val model = updated.value as Map<*, *>
        assertEquals("Version one", model["title"])
        assertEquals("done", model["status"])
    }

    @Test
    fun `delete removes the entity`() = runBlocking {
        val (_, executor, project) = createEnvironment()
        executor.execute(project, "demo.taskcreate", mapOf("title" to "to delete"), null)
        val listed = executor.execute(project, "demo.tasklist", mapOf<String, Any>(), null)
        val id = ((listed.value as List<*>).single() as Map<*, *>)["id"]

        val deleted = executor.execute(project, "demo.taskdelete", mapOf("id" to id), null)
        assertEquals(Status.SUCCESS, deleted.status)

        val after = executor.execute(project, "demo.tasklist", mapOf<String, Any>(), null)
        assertTrue((after.value as List<*>).isEmpty())
    }
}
