package runtime.infrastructure.query

import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.audit.AuditService
import runtime.application.command.CommandExecutor
import runtime.application.command.ProjectLocks
import runtime.application.project.ProjectFactory
import runtime.domain.command.AnalyticalCommand
import runtime.domain.command.CommandResult
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.storage.DefaultEntityStore
import kotlin.test.assertEquals

data class Task(val id: String, val title: String, val done: Boolean, val boardId: String)

class AnalyticalCommandRoutingTest {

    private fun projectOf(): Project {
        val taskType = EntityType("demo.task")
        val registry = InMemoryEntityRegistry()
        registry.register(object : EntityDefinition {
            override val type = taskType
            override val modelClass = Task::class.java
        })
        val project = ProjectFactory(registry, DefaultEntityStore()).create(ProjectId.generate())
        val tasks = project.objectList<Task>(taskType)!!
        tasks.create(ObjectId.generate(), Task("t1", "Alpha", true, "b1"))
        tasks.create(ObjectId.generate(), Task("t2", "beta", false, "b1"))
        tasks.create(ObjectId.generate(), Task("t3", "Gamma", true, "b2"))
        return project
    }

    @Test
    fun `executor routes analytical command through the SDK engine with projectData`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        commandRegistry.register(
            PluginId("report"),
            AnalyticalCommand(name = "open", sql = "SELECT title FROM demo.task WHERE done = TRUE ORDER BY title", description = "Open tasks")
        )
        val executor = CommandExecutor(
            commandRegistry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            Messages(emptyMap())
        )
        val result = executor.execute(projectOf(), "report.open", null, sessionId = null)
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val rows = result.value as List<*>
        assertEquals(2, rows.size)
    }
}
