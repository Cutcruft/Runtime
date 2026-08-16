package runtime.infrastructure.script

import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import runtime.application.command.CommandContextImpl
import runtime.application.command.ProjectLocks
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.infrastructure.infrastructure.EmptyInfrastructureRegistry
import runtime.infrastructure.storage.DefaultEntityStore
import runtime.infrastructure.infrastructure.InfrastructureService
import runtime.infrastructure.infrastructure.NoopInfrastructureClient
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.obj.SynchronizedObjectList
import runtime.application.project.ProjectFactory
import java.io.File

class KotlinScriptEngineTest {

    private data class TestTask(val title: String, val done: Boolean)

    private val taskType = EntityType("demo.task")

    @TempDir
    lateinit var tempDir: File

    private fun engine(): KotlinScriptEngine = KotlinScriptEngine(workDir = File(tempDir, "out"))

    private fun context(project: Project, engine: ScriptEngine = engine()): CommandContext {
        return CommandContextImpl(
            project,
            ProjectLocks(),
            Messages(emptyMap()),
            InfrastructureService(EmptyInfrastructureRegistry, NoopInfrastructureClient),
            engine
        )
    }

    private fun projectWithTasks(): Project {
        val registry = InMemoryEntityRegistry()
        registry.register(object : EntityDefinition {
            override val type = taskType
            override val modelClass = TestTask::class.java
        })
        val project = ProjectFactory(registry, DefaultEntityStore()).create(ProjectId.generate())
        val tasks = project.objectList<TestTask>(taskType)!!
        tasks.create(ObjectId.generate(), TestTask("alpha", done = false))
        return project
    }

    @Test
    fun `returns a CommandResult as-is`() {
        val code = """
            fun run(context: CommandContext, params: Any?): Any? {
                return CommandResult.success(mapOf("value" to 42))
            }
        """.trimIndent()
        val result = engine().evaluate(code, null, context(projectWithTasks()))
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        assertEquals(42, (result.value as Map<*, *>)["value"])
    }

    @Test
    fun `wraps a plain return value into a success result`() {
        val code = """
            fun run(context: CommandContext, params: Any?): Any? = params
        """.trimIndent()
        val params = mapOf("x" to 1)
        val result = engine().evaluate(code, params, context(projectWithTasks()))
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        assertEquals(params, result.value)
    }

    @Test
    fun `script sees params`() {
        val code = """
            fun run(context: CommandContext, params: Any?): Any? = (params as Map<*, *>).size
        """.trimIndent()
        val result = engine().evaluate(code, mapOf("a" to 1, "b" to 2), context(projectWithTasks()))
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        assertEquals(2, result.value)
    }

    @Test
    fun `script reads entities through the context`() {
        val code = """
            fun run(context: CommandContext, params: Any?): Any? {
                val tasks = context.objectList<com.example.demo.Task>(EntityType("demo.task"))
                return tasks.list().size
            }
        """.trimIndent()
        val project = projectWithDemoTasks()
        val result = engine().evaluate(code, null, context(project))
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        assertEquals(2, result.value)
    }

    @Test
    fun `script can hold the project lock`() {
        val code = """
            fun run(context: CommandContext, params: Any?): Any? {
                return context.withProjectLock<Int> { 7 }
            }
        """.trimIndent()
        val result = engine().evaluate(code, null, context(projectWithTasks()))
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        assertEquals(7, result.value)
    }

    @Test
    fun `compile error is reported as an error result`() {
        val code = """
            fun run(context: CommandContext, params: Any?): Any? {
                val x: Int = "boom"
                return x
            }
        """.trimIndent()
        val result = engine().evaluate(code, null, context(projectWithTasks()))
        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.startsWith("Script compile error:"), result.error)
    }

    @Test
    fun `runtime exception is reported as an error result`() {
        val code = """
            fun run(context: CommandContext, params: Any?): Any? {
                error("kaboom")
            }
        """.trimIndent()
        val result = engine().evaluate(code, null, context(projectWithTasks()))
        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("kaboom"), result.error)
    }

    @Test
    fun `missing run function is reported`() {
        val code = "val x = 1"
        val result = engine().evaluate(code, null, context(projectWithTasks()))
        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("missing top-level fun run"), result.error)
    }

    @Test
    fun `same code is cached and reusable`() {
        val engine = engine()
        val code = """
            fun run(context: CommandContext, params: Any?): Any? = CommandResult.success("ok")
        """.trimIndent()
        val ctx = context(projectWithTasks())
        assertEquals(CommandResult.Status.SUCCESS, engine.evaluate(code, null, ctx).status)
        assertEquals(CommandResult.Status.SUCCESS, engine.evaluate(code, null, ctx).status)
        assertEquals("ok", engine.evaluate(code, null, ctx).value)
    }

    @Test
    fun `validate returns null for valid code and a message for invalid`() {
        val engine = engine()
        assertNull(engine.validate("fun run(context: CommandContext, params: Any?): Any? = 1"))
        val error = engine.validate("fun run(context: CommandContext, params: Any?): Any? { val x: Int = \"nope\" }")
        assertNotNull(error)
        assertTrue(error!!.contains("Script compile error:"), error)
    }

    @Test
    fun `script uses user-defined imports`() {
        val code = """
            import java.util.UUID
            fun run(context: CommandContext, params: Any?): Any? = UUID.randomUUID().toString().length > 0
        """.trimIndent()
        val result = engine().evaluate(code, null, context(projectWithTasks()))
        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        assertEquals(true, result.value)
    }

    private fun projectWithDemoTasks(): Project {
        val registry = InMemoryEntityRegistry()
        registry.register(object : EntityDefinition {
            override val type = EntityType("demo.task")
            override val modelClass = com.example.demo.Task::class.java
        })
        val project = ProjectFactory(registry, DefaultEntityStore()).create(ProjectId.generate())
        val tasks = project.objectList<com.example.demo.Task>(EntityType("demo.task"))!!
        tasks.create(ObjectId.generate(), com.example.demo.Task("one", "open"))
        tasks.create(ObjectId.generate(), com.example.demo.Task("two", "done"))
        return project
    }
}
