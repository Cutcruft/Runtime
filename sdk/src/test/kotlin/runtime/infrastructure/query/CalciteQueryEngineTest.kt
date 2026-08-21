package runtime.infrastructure.query

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.domain.command.AnalyticalCommand
import runtime.domain.command.CommandResult

class CalciteQueryEngineTest {

    private fun projectData(): Map<String, List<Map<String, Any?>>> = mapOf(
        "demo.task" to listOf(
            mapOf("id" to "t1", "title" to "Alpha", "done" to true, "boardId" to "b1"),
            mapOf("id" to "t2", "title" to "beta", "done" to false, "boardId" to "b1"),
            mapOf("id" to "t3", "title" to "Gamma", "done" to true, "boardId" to "b2")
        ),
        "demo.board" to listOf(
            mapOf("id" to "b1", "name" to "One"),
            mapOf("id" to "b2", "name" to "Two")
        )
    )

    private fun engine(): CalciteQueryEngine = CalciteQueryEngine()

    @Test
    fun `select filters and orders rows`() {
        val result = engine().execute(projectData(), "SELECT title FROM demo.task WHERE done = TRUE ORDER BY title", null)
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val rows = result.value as List<*>
        assertEquals(2, rows.size)
        assertEquals("Alpha", (rows[0] as Map<*, *>)["title"])
        assertEquals("Gamma", (rows[1] as Map<*, *>)["title"])
    }

    @Test
    fun `group by aggregates rows`() {
        val result = engine().execute(projectData(), "SELECT done, COUNT(*) AS cnt FROM demo.task GROUP BY done ORDER BY done", null)
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
            projectData(),
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
            projectData(),
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
        val delete = engine().execute(projectData(), "DELETE FROM demo.task", null)
        assertEquals(CommandResult.Status.ERROR, delete.status)
        assertTrue(delete.error!!.contains("Only SELECT"))

        val update = engine().execute(projectData(), "UPDATE demo.task SET title = 'x'", null)
        assertEquals(CommandResult.Status.ERROR, update.status)
    }

    @Test
    fun `order by is accepted as select`() {
        val result = engine().execute(projectData(), "SELECT title FROM demo.task ORDER BY title DESC", null)
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val rows = result.value as List<*>
        assertEquals("beta", (rows[0] as Map<*, *>)["title"])
    }

    @Test
    fun `unknown table returns error`() {
        val result = engine().execute(projectData(), "SELECT * FROM demo.nope", null)
        assertEquals(CommandResult.Status.ERROR, result.status)
    }
}
