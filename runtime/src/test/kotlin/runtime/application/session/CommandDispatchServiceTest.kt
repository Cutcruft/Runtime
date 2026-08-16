package runtime.application.session

import kotlin.test.assertEquals
import kotlin.test.assertNotSame
import kotlin.test.assertTrue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.audit.AuditService
import runtime.application.command.CommandExecutor
import runtime.application.command.ProjectLocks
import runtime.application.project.ProjectFactory
import runtime.application.project.ProjectSerializer
import runtime.application.project.ProjectService
import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.application.command.CommandContextImpl
import runtime.domain.models.Session
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.inmem.InMemoryProjectRepository
import runtime.infrastructure.inmem.InMemorySessionRepository
import runtime.infrastructure.storage.DefaultEntityStore

class CommandDispatchServiceTest {

    private val messages = Messages(
        mapOf(
            Messages.SESSION_NOT_BOUND to "Session not bound to a project. Send project.create or project.open first.",
            Messages.SESSION_NOT_FOUND to "Session not found",
            Messages.MISSING_PROJECT_ID to "Missing projectId",
            Messages.INVALID_PROJECT_ID to "Invalid projectId",
            Messages.PROJECT_NOT_FOUND to "Project not found",
            Messages.COMMAND_NOT_FOUND to "Command not found",
            Messages.COMMAND_PRIVATE to "Command is private and cannot be invoked from the client",
            Messages.MISSING_PARAMETERS to "Missing parameters",
            Messages.MISSING_DATA to "Missing data"
        )
    )

    private val projectRepository = InMemoryProjectRepository()
    private val sessionRepository = InMemorySessionRepository()
    private val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
    private val projectService: ProjectService
    private val service: CommandDispatchService

    init {
        val entityRegistry = InMemoryEntityRegistry()
        val entityStore = DefaultEntityStore()
        val projectFactory = ProjectFactory(entityRegistry, entityStore)
        projectService = ProjectService(projectRepository, projectFactory, ProjectSerializer(entityRegistry, entityStore), entityStore)
        val auditService = AuditService(true, 10000) { InMemoryAuditLog() }
        val executor = CommandExecutor(commandRegistry, auditService, ProjectLocks(), messages)
        val sessionManager = SessionManager(sessionRepository, projectRepository)
        service = CommandDispatchService(projectService, executor, sessionManager, messages)
    }

    private fun registerSession(sessionId: String): Session {
        val session = Session(sessionId)
        sessionRepository.register(session)
        return session
    }

    @Test
    fun `project create should bind even when session already bound`() {
        val outcome = service.decide("project.create", projectBound = true, params = null)
        assertTrue(outcome is CommandDispatchService.Outcome.CreateProject)
        assertEquals(null, (outcome as CommandDispatchService.Outcome.CreateProject).projectId)
    }

    @Test
    fun `project open should rebind session to another project`() {
        val outcome = service.decide("project.open", projectBound = true, params = mapOf("projectId" to "pid"))
        assertEquals(CommandDispatchService.Outcome.OpenProject("pid"), outcome)
    }

    @Test
    fun `project open without projectId should fail`() {
        val outcome = service.decide("project.open", projectBound = false, params = emptyMap<String, Any>())
        assertTrue(outcome is CommandDispatchService.Outcome.ProtocolError)
    }

    @Test
    fun `command on unbound session should fail with guidance`() {
        val outcome = service.decide("demo.create", projectBound = false, params = mapOf("title" to "T1"))
        assertTrue(outcome is CommandDispatchService.Outcome.ProtocolError)
        assertTrue((outcome as CommandDispatchService.Outcome.ProtocolError).message.contains("project.create"))
    }

    @Test
    fun `command on bound session should execute`() {
        val params = mapOf("title" to "T1")
        val outcome = service.decide("demo.create", projectBound = true, params = params)
        assertEquals(CommandDispatchService.Outcome.ExecuteCommand("demo.create", params), outcome)
    }

    @Test
    fun `create binds the session and execute works after that`() = runBlocking {
        registerSession("s1")
        val createResult = service.dispatch("s1", "project.create", null)
        assertTrue(createResult is CommandDispatchService.DispatchResult.Result)
        val projectId = ((createResult as CommandDispatchService.DispatchResult.Result).commandResult.value as Map<*, *>)["projectId"] as String

        val executeResult = service.dispatch("s1", "demo.create", mapOf("title" to "T1"))
        assertTrue(executeResult is CommandDispatchService.DispatchResult.Result)
        assertEquals(projectId, sessionRepository.get("s1")?.project?.id?.value.toString())
    }

    @Test
    fun `open rebinds the session to another project`() = runBlocking {
        registerSession("s1")
        service.dispatch("s1", "project.create", mapOf("projectId" to generateId()))
        service.dispatch("s1", "project.create", mapOf("projectId" to generateId()))
        val openResult = service.dispatch("s1", "project.open", mapOf("projectId" to projectRepository.list().first().value.toString()))

        assertTrue(openResult is CommandDispatchService.DispatchResult.Result)
        assertEquals(
            projectRepository.list().first(),
            sessionRepository.get("s1")?.project?.id
        )
    }

    @Test
    fun `project load replaces the project instance and rebinds the session`() = runBlocking {
        registerSession("s1")
        commandRegistry.register(
            PluginId("project"),
            object : Command("load") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                    val projectId = (context as CommandContextImpl).project.id
                    projectService.loadProject(projectId, "{\"objects\":{}}")
                    return CommandResult.success()
                }
            }
        )

        service.dispatch("s1", "project.create", null)
        val original = sessionRepository.get("s1")?.project

        val result = service.dispatch("s1", "project.load", emptyMap<String, Any>())
        assertTrue(result is CommandDispatchService.DispatchResult.Result)

        val rebound = sessionRepository.get("s1")?.project
        assertNotSame(original, rebound)
        assertEquals(original?.id, rebound?.id)
    }

    @Test
    fun `command on unbound session returns protocol error`() = runBlocking {
        registerSession("s2")
        val result = service.dispatch("s2", "demo.create", mapOf("title" to "T1"))
        assertTrue(result is CommandDispatchService.DispatchResult.Protocol)
        assertTrue((result as CommandDispatchService.DispatchResult.Protocol).message.contains("project.create"))
    }

    @Test
    fun `private command is blocked from client dispatch`() = runBlocking {
        registerSession("s3")
        commandRegistry.register(
            PluginId("demo"),
            object : Command("internal", visibility = runtime.domain.command.CommandVisibility.PRIVATE) {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult =
                    CommandResult.success()
            }
        )
        service.dispatch("s3", "project.create", null)
        val result = service.dispatch("s3", "demo.internal", emptyMap<String, Any>())
        assertTrue(result is CommandDispatchService.DispatchResult.Protocol)
        assertTrue((result as CommandDispatchService.DispatchResult.Protocol).message.contains("private"))
    }

    @Test
    fun `public command is executed from client dispatch`() = runBlocking {
        registerSession("s4")
        commandRegistry.register(
            PluginId("demo"),
            object : Command("greet") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult =
                    CommandResult.success(mapOf("hello" to "world"))
            }
        )
        service.dispatch("s4", "project.create", null)
        val result = service.dispatch("s4", "demo.greet", emptyMap<String, Any>())
        assertTrue(result is CommandDispatchService.DispatchResult.Result)
        val value = (result as CommandDispatchService.DispatchResult.Result).commandResult.value as Map<*, *>
        assertEquals("world", value["hello"])
    }

    private fun generateId(): String = java.util.UUID.randomUUID().toString()
}
