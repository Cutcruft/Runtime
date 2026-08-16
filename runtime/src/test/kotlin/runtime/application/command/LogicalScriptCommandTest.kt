package runtime.application.command

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.audit.AuditService
import runtime.application.project.ProjectFactory
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.command.LogicalScriptCommand
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
import runtime.infrastructure.script.ScriptEngine

class LogicalScriptCommandTest {

    private val scriptType = EntityType("demo.script")
    private val messages = Messages(emptyMap())

    private data class ScriptEntity(val name: String, val code: String)

    /** ScriptEngine that captures invocations and returns a fixed result. */
    private class StubEngine(private val onEvaluate: (String, Any?) -> CommandResult) : ScriptEngine {
        val evaluations = mutableListOf<Pair<String, Any?>>()
        override fun evaluate(code: String, params: Any?, context: CommandContext): CommandResult {
            evaluations += code to params
            return onEvaluate(code, params)
        }

        override fun validate(code: String): String? = null
    }

    private fun projectWithScript(id: ObjectId, code: String): Project {
        val registry = InMemoryEntityRegistry()
        registry.register(object : EntityDefinition {
            override val type = scriptType
            override val modelClass = ScriptEntity::class.java
        })
        val project = ProjectFactory(registry, DefaultEntityStore()).create(ProjectId.generate())
        project.objectList<ScriptEntity>(scriptType)!!.create(id, ScriptEntity("my-script", code))
        return project
    }

    private fun executorWith(engine: ScriptEngine): Pair<CommandRegistry, CommandExecutor> {
        val registry: CommandRegistry = InMemoryCommandRegistry()
        registry.register(
            PluginId("demo"),
            object : LogicalScriptCommand(
                name = "runscript",
                description = "runs a script",
                scriptType = scriptType
            ) {}
        )
        val executor = CommandExecutor(
            registry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            messages,
            scriptEngine = engine
        )
        return registry to executor
    }

    @Test
    fun `resolves the script entity and evaluates its code`() = runBlocking {
        val id = ObjectId.generate()
        val code = "fun run(context: CommandContext, params: Any?): Any? = 1"
        val stub = StubEngine { _, _ -> CommandResult.success(mapOf("ran" to true)) }
        val (_, executor) = executorWith(stub)
        val project = projectWithScript(id, code)

        val result = executor.execute(project, "demo.runscript", mapOf("scriptId" to id.toString()), sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        assertEquals(true, (result.value as Map<*, *>)["ran"])
        assertEquals(1, stub.evaluations.size)
        assertEquals(code, stub.evaluations[0].first)
        assertEquals(mapOf("scriptId" to id.toString()), stub.evaluations[0].second)
    }

    @Test
    fun `accepts a bare script id string as params`() = runBlocking {
        val id = ObjectId.generate()
        val stub = StubEngine { _, _ -> CommandResult.success("ok") }
        val (_, executor) = executorWith(stub)

        val result = executor.execute(projectWithScript(id, "code"), "demo.runscript", id.toString(), sessionId = null)

        assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
        assertEquals("ok", result.value)
    }

    @Test
    fun `missing scriptId parameter is an error`() = runBlocking {
        val stub = StubEngine { _, _ -> CommandResult.success("ok") }
        val (_, executor) = executorWith(stub)

        val result = executor.execute(projectWithScript(ObjectId.generate(), "code"), "demo.runscript", mapOf("other" to 1), sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("scriptId"), result.error)
        assertEquals(0, stub.evaluations.size)
    }

    @Test
    fun `unknown script id is an error`() = runBlocking {
        val stub = StubEngine { _, _ -> CommandResult.success("ok") }
        val (_, executor) = executorWith(stub)

        val result = executor.execute(projectWithScript(ObjectId.generate(), "code"), "demo.runscript", mapOf("scriptId" to ObjectId.generate().toString()), sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("not found"), result.error)
    }

    @Test
    fun `invalid script id is an error`() = runBlocking {
        val stub = StubEngine { _, _ -> CommandResult.success("ok") }
        val (_, executor) = executorWith(stub)

        val result = executor.execute(projectWithScript(ObjectId.generate(), "code"), "demo.runscript", mapOf("scriptId" to "not-a-uuid"), sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("Invalid script id"), result.error)
    }
}
