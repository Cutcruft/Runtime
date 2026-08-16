package runtime.application.command

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.audit.AuditService
import runtime.application.project.ProjectFactory
import runtime.domain.command.AnalyticalCommand
import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.command.PipelineCommand
import runtime.domain.command.PipelineStep
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

private data class PipelineTask(val id: String, val title: String, val done: Boolean, val boardId: String)

class PipelineCommandTest {

    private val messages = Messages(emptyMap())

    private fun executorWith(vararg commands: Pair<String, Command>): Pair<CommandRegistry, CommandExecutor> {
        val registry: CommandRegistry = InMemoryCommandRegistry()
        commands.forEach { (name, command) ->
            registry.register(PluginId("demo"), command)
        }
        val executor = CommandExecutor(
            registry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            messages
        )
        return registry to executor
    }

    private fun echoCommand(name: String): Command = object : Command(name) {
        override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
            val title = (params as? Map<*, *>)?.get("title")
            return CommandResult.success(mapOf("title" to title, "touched" to true))
        }
    }

    private fun registerPipeline(registry: CommandRegistry, pipeline: PipelineCommand) {
        registry.register(PluginId("demo"), pipeline)
    }

    private fun projectOf(): Project =
        ProjectFactory(InMemoryEntityRegistry(), DefaultEntityStore()).create(ProjectId.generate())

    private fun projectWithTasks(): Project {
        val taskType = EntityType("demo.task")
        val registry = InMemoryEntityRegistry()
        registry.register(object : EntityDefinition {
            override val type = taskType
            override val modelClass = PipelineTask::class.java
        })
        val project = ProjectFactory(registry, DefaultEntityStore()).create(ProjectId.generate())
        val tasks = project.objectList<PipelineTask>(taskType)!!
        tasks.create(ObjectId.generate(), PipelineTask("t1", "Alpha", true, "b1"))
        tasks.create(ObjectId.generate(), PipelineTask("t2", "beta", false, "b1"))
        return project
    }

    @Test
    fun `pipeline executes steps sequentially and captures outputs into variables`() = runBlocking {
        val (registry, executor) = executorWith(
            "create" to object : Command("create") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                    val title = (params as? Map<*, *>)?.get("title")
                    return CommandResult.success(mapOf("id" to "t1", "title" to title))
                }
            },
            "touch" to echoCommand("touch")
        )
        registerPipeline(
            registry,
            PipelineCommand(
                name = "flow",
                steps = listOf(
                    PipelineStep("demo.create", mapOf("title" to "Alpha"), output = mapOf("id" to "createdId", "title" to "t")),
                    PipelineStep("demo.touch", mapOf("title" to "fallback"), input = mapOf("title" to "t"), output = mapOf("title" to "echoed"))
                )
            )
        )
        val result = executor.execute(projectOf(), "demo.flow", null, sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val variables = (result.value as Map<*, *>)["variables"] as Map<*, *>
        assertEquals("t1", variables["createdId"])
        assertEquals("Alpha", variables["t"])
        assertEquals("Alpha", variables["echoed"])
        val steps = (result.value as Map<*, *>)["steps"] as List<*>
        assertEquals(2, steps.size)
        assertEquals("demo.create", (steps[0] as Map<*, *>)["command"])
        assertEquals("ok", (steps[0] as Map<*, *>)["status"])
        assertEquals("demo.touch", (steps[1] as Map<*, *>)["command"])
    }

    @Test
    fun `pipeline invocation params are seeded as variables`() = runBlocking {
        val (registry, executor) = executorWith("touch" to echoCommand("touch"))
        registerPipeline(
            registry,
            PipelineCommand(
                name = "greet",
                steps = listOf(
                    PipelineStep("demo.touch", mapOf("title" to "nobody"), input = mapOf("title" to "who"), output = mapOf("title" to "echoed"))
                )
            )
        )
        val result = executor.execute(projectOf(), "demo.greet", mapOf("who" to "World"), sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val variables = (result.value as Map<*, *>)["variables"] as Map<*, *>
        assertEquals("World", variables["who"])
        assertEquals("World", variables["echoed"])
    }

    @Test
    fun `failing step stops the pipeline with the step index`() = runBlocking {
        val (registry, executor) = executorWith(
            "ok" to object : Command("ok") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult = CommandResult.success("fine")
            },
            "bad" to object : Command("bad") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult = CommandResult.error("boom")
            },
            "late" to object : Command("late") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                    throw AssertionError("step 3 must not run after a fail-fast failure")
                }
            }
        )
        registerPipeline(
            registry,
            PipelineCommand(
                name = "failstop",
                steps = listOf(
                    PipelineStep("demo.ok"),
                    PipelineStep("demo.bad"),
                    PipelineStep("demo.late")
                )
            )
        )
        val result = executor.execute(projectOf(), "demo.failstop", null, sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("Step 2"))
        assertTrue(result.error!!.contains("demo.bad"))
        assertEquals(2, (result.value as Map<*, *>)["failedStep"])
        val steps = (result.value as Map<*, *>)["steps"] as List<*>
        assertEquals(2, steps.size)
        assertEquals("demo.bad", (steps[1] as Map<*, *>)["command"])
    }

    @Test
    fun `ignoreError continues past a failing step`() = runBlocking {
        val (registry, executor) = executorWith(
            "bad" to object : Command("bad") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult = CommandResult.error("boom")
            },
            "ok" to object : Command("ok") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult = CommandResult.success("fine")
            }
        )
        registerPipeline(
            registry,
            PipelineCommand(
                name = "ignore",
                steps = listOf(
                    PipelineStep("demo.bad", ignoreError = true),
                    PipelineStep("demo.ok")
                )
            )
        )
        val result = executor.execute(projectOf(), "demo.ignore", null, sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val steps = (result.value as Map<*, *>)["steps"] as List<*>
        assertEquals("error", (steps[0] as Map<*, *>)["status"])
        assertEquals("ok", (steps[1] as Map<*, *>)["status"])
        assertEquals("boom", (steps[0] as Map<*, *>)["error"])
    }

    @Test
    fun `unknown step command fails the pipeline`() = runBlocking {
        val (registry, executor) = executorWith()
        registerPipeline(
            registry,
            PipelineCommand(
                name = "missing",
                steps = listOf(PipelineStep("demo.nope"))
            )
        )
        val result = executor.execute(projectOf(), "demo.missing", null, sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("unknown command 'demo.nope'"))
    }

    @Test
    fun `analytical step runs through the query engine`() = runBlocking {
        val (registry, executor) = executorWith(
            "report" to AnalyticalCommand(name = "report", sql = "SELECT title FROM demo.task WHERE done = TRUE ORDER BY title", description = "Done tasks")
        )
        registerPipeline(
            registry,
            PipelineCommand(
                name = "analyt",
                steps = listOf(PipelineStep("demo.report", output = mapOf("" to "rows")))
            )
        )
        val result = executor.execute(projectWithTasks(), "demo.analyt", null, sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val variables = (result.value as Map<*, *>)["variables"] as Map<*, *>
        val rows = variables["rows"] as List<*>
        assertEquals(1, rows.size)
        assertEquals("Alpha", (rows[0] as Map<*, *>)["title"])
    }

    @Test
    fun `nested pipeline runs steps of the inner pipeline`() = runBlocking {
        val (registry, executor) = executorWith(
            "leaf" to object : Command("leaf") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult = CommandResult.success(mapOf("leaf" to true))
            }
        )
        registerPipeline(registry, PipelineCommand(name = "inner", steps = listOf(PipelineStep("demo.leaf"))))
        registerPipeline(registry, PipelineCommand(name = "outer", steps = listOf(PipelineStep("demo.inner", output = mapOf("" to "inner")))))
        val result = executor.execute(projectOf(), "demo.outer", null, sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val variables = (result.value as Map<*, *>)["variables"] as Map<*, *>
        val inner = variables["inner"] as Map<*, *>
        assertEquals("demo.leaf", ((inner["steps"] as List<*>)[0] as Map<*, *>)["command"])
    }

    @Test
    fun `circular pipeline reference is rejected`() = runBlocking {
        val (registry, executor) = executorWith()
        registerPipeline(registry, PipelineCommand(name = "loop", steps = listOf(PipelineStep("demo.loop"))))
        val result = executor.execute(projectOf(), "demo.loop", null, sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("circular"))
    }

    @Test
    fun `pipeline depth limit is enforced`() = runBlocking {
        val (registry, executor) = executorWith(
            "leaf" to object : Command("leaf") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult = CommandResult.success("ok")
            }
        )
        (9 downTo 0).forEach { i ->
            val next = if (i == 9) "demo.leaf" else "demo.chain${i + 1}"
            registerPipeline(registry, PipelineCommand(name = "chain$i", steps = listOf(PipelineStep(next))))
        }
        val result = executor.execute(projectOf(), "demo.chain0", null, sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("depth limit"), result.error)
    }

    @Test
    fun `output captures fields from a model object value`() = runBlocking {
        data class Item(val title: String, val order: Int)
        val (registry, executor) = executorWith(
            "make" to object : Command("make") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult =
                    CommandResult.success(Item(title = "Model", order = 7))
            }
        )
        registerPipeline(
            registry,
            PipelineCommand(
                name = "model",
                steps = listOf(
                    PipelineStep("demo.make", output = mapOf("title" to "t", "order" to "o"))
                )
            )
        )
        val result = executor.execute(projectOf(), "demo.model", null, sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val variables = (result.value as Map<*, *>)["variables"] as Map<*, *>
        assertEquals("Model", variables["t"])
        assertEquals(7, variables["o"])
    }

    @Test
    fun `null variable falls back to the static param value`() = runBlocking {
        data class Empty(val title: String?)
        val (registry, executor) = executorWith(
            "make" to object : Command("make") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult =
                    CommandResult.success(Empty(title = null))
            },
            "touch" to echoCommand("touch")
        )
        registerPipeline(
            registry,
            PipelineCommand(
                name = "nullvar",
                steps = listOf(
                    PipelineStep("demo.make", output = mapOf("title" to "t")),
                    PipelineStep("demo.touch", mapOf("title" to "static-fallback"), input = mapOf("title" to "t"))
                )
            )
        )
        val result = executor.execute(projectOf(), "demo.nullvar", null, sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        val variables = (result.value as Map<*, *>)["variables"] as Map<*, *>
        assertEquals(null, variables["t"])
    }
}
