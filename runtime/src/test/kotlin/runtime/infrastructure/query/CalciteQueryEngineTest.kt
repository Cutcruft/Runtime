package runtime.infrastructure.query

import kotlin.test.assertEquals
import kotlin.test.assertTrue
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
import runtime.infrastructure.storage.DefaultEntityStore
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.obj.SynchronizedObjectList

data class Task(val id: String, val title: String, val done: Boolean, val boardId: String)
data class Board(val id: String, val name: String)

class CalciteQueryEngineTest {

    private fun projectOf(): Project {
        val taskType = EntityType("demo.task")
        val boardType = EntityType("demo.board")
        val registry = InMemoryEntityRegistry()
        registry.register(object : EntityDefinition {
            override val type = taskType
            override val modelClass = Task::class.java
        })
        registry.register(object : EntityDefinition {
            override val type = boardType
            override val modelClass = Board::class.java
        })
        val project = ProjectFactory(registry, DefaultEntityStore()).create(ProjectId.generate())
        val tasks = project.objectList<Task>(taskType)!!
        tasks.create(ObjectId.generate(), Task("t1", "Alpha", true, "b1"))
        tasks.create(ObjectId.generate(), Task("t2", "beta", false, "b1"))
        tasks.create(ObjectId.generate(), Task("t3", "Gamma", true, "b2"))
        val boards = project.objectList<Board>(boardType)!!
        boards.create(ObjectId.generate(), Board("b1", "One"))
        boards.create(ObjectId.generate(), Board("b2", "Two"))
        return project
    }

    private fun engine(): CalciteQueryEngine = CalciteQueryEngine()

    @Test
    fun `select filters and orders rows`() {
        val result = engine().execute(projectOf(), "SELECT title FROM demo.task WHERE done = TRUE ORDER BY title", null)
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val rows = result.value as List<*>
        assertEquals(2, rows.size)
        assertEquals("Alpha", (rows[0] as Map<*, *>)["title"])
        assertEquals("Gamma", (rows[1] as Map<*, *>)["title"])
    }

    @Test
    fun `group by aggregates rows`() {
        val result = engine().execute(projectOf(), "SELECT done, COUNT(*) AS cnt FROM demo.task GROUP BY done ORDER BY done", null)
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val rows = result.value as List<*>
        assertEquals(2, rows.size)
        assertEquals(false, (rows[0] as Map<*, *>)["done"])
        assertEquals(1L, (rows[0] as Map<*, *>)["cnt"])
        assertEquals(true, (rows[1] as Map<*, *>)["done"])
        assertEquals(2L, (rows[1] as Map<*, *>)["cnt"])
    }

    @Test
    fun `join across entity tables`() {
        val result = engine().execute(
            projectOf(),
            "SELECT t.title, b.name FROM demo.task t JOIN demo.board b ON t.boardId = b.id ORDER BY t.title",
            null
        )
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val rows = result.value as List<*>
        assertEquals(3, rows.size)
        val first = rows[0] as Map<*, *>
        assertEquals("Alpha", first["title"])
        assertEquals("One", first["name"])
    }

    @Test
    fun `params are substituted into the query`() {
        val result = engine().execute(
            projectOf(),
            "SELECT title FROM demo.task WHERE boardId = {board} ORDER BY title",
            mapOf("board" to "b1")
        )
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val rows = result.value as List<*>
        assertEquals(2, rows.size)
        assertEquals("Alpha", (rows[0] as Map<*, *>)["title"])
        assertEquals("beta", (rows[1] as Map<*, *>)["title"])
    }

    @Test
    fun `non-select statements are rejected`() {
        val delete = engine().execute(projectOf(), "DELETE FROM demo.task", null)
        assertEquals(CommandResult.Status.ERROR, delete.status)
        assertTrue(delete.error!!.contains("Only SELECT"))

        val update = engine().execute(projectOf(), "UPDATE demo.task SET title = 'x'", null)
        assertEquals(CommandResult.Status.ERROR, update.status)
    }

    @Test
    fun `order by is accepted as select`() {
        val result = engine().execute(projectOf(), "SELECT title FROM demo.task ORDER BY title DESC", null)
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val rows = result.value as List<*>
        assertEquals("beta", (rows[0] as Map<*, *>)["title"])
    }

    @Test
    fun `unknown table returns error`() {
        val result = engine().execute(projectOf(), "SELECT * FROM demo.nope", null)
        assertEquals(CommandResult.Status.ERROR, result.status)
    }

    @Test
    fun `executor routes analytical command through the engine`() = runBlocking {
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
