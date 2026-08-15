package runtime.application.command

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.audit.AuditService
import runtime.application.event.EventPublisher
import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.entity.EntityType
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.models.RuntimeEvent
import runtime.domain.obj.ObjectRef
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.obj.SynchronizedObjectList

class CommandExecutorTest {

    private val messages = Messages(emptyMap())
    private val entityType = EntityType("demo.task")

    @Test
    fun `successful command with references publishes object changed for each reference`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        val ref = ObjectRef(entityType, runtime.domain.obj.ObjectId.generate())
        commandRegistry.register(
            PluginId("demo"),
            object : Command("touch") {
                override suspend fun execute(context: CommandContext, params: Any?): CommandResult =
                    CommandResult.success(value = mapOf("value" to 1), references = listOf(ref))
            }
        )

        val published = mutableListOf<RuntimeEvent>()
        val executor = CommandExecutor(
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

        val project = projectOf(ProjectId.generate())
        executor.execute(project, "demo.touch", null, sessionId = null)

        assertEquals(1, published.size)
        val event = published.single() as RuntimeEvent.ObjectChanged
        assertEquals(project.id, event.projectId)
        assertEquals(entityType, event.entityType)
        assertEquals(ref.objectId, event.objectId)
        assertEquals(mapOf("value" to 1), event.value)
    }

    @Test
    fun `successful command with multiple references publishes without single value`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        val refs = listOf(
            ObjectRef(entityType, runtime.domain.obj.ObjectId.generate()),
            ObjectRef(EntityType("demo.board"), runtime.domain.obj.ObjectId.generate())
        )
        commandRegistry.register(
            PluginId("demo"),
            object : Command("touch") {
                override suspend fun execute(context: CommandContext, params: Any?): CommandResult =
                    CommandResult.success(value = "whole", references = refs)
            }
        )

        val published = mutableListOf<RuntimeEvent>()
        val executor = CommandExecutor(
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

        executor.execute(projectOf(ProjectId.generate()), "demo.touch", null, sessionId = null)

        assertEquals(2, published.size)
        published.forEach { event ->
            assertTrue((event as RuntimeEvent.ObjectChanged).value == null)
        }
    }

    @Test
    fun `error result does not publish events`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        commandRegistry.register(
            PluginId("demo"),
            object : Command("fail") {
                override suspend fun execute(context: CommandContext, params: Any?): CommandResult =
                    CommandResult.error("nope")
            }
        )

        val published = mutableListOf<RuntimeEvent>()
        val executor = CommandExecutor(
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

        executor.execute(projectOf(ProjectId.generate()), "demo.fail", null, sessionId = null)

        assertTrue(published.isEmpty())
    }

    private fun projectOf(projectId: ProjectId): Project {
        val entityRegistry = InMemoryEntityRegistry()
        return runtime.application.project.ProjectFactory(entityRegistry) { SynchronizedObjectList<Any>(it) }
            .create(projectId)
    }
}
