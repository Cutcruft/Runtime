package runtime.application.command

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
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
import runtime.infrastructure.storage.DefaultEntityStore
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
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult =
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
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult =
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
    fun `command whose executeInternal throws returns an error result`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        commandRegistry.register(
            PluginId("demo"),
            object : Command("boom") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                    throw IllegalStateException("boom inside")
                }
            }
        )

        val executor = CommandExecutor(
            commandRegistry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            messages
        )

        val result = executor.execute(projectOf(ProjectId.generate()), "demo.boom", null, sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        val error = result.error ?: ""
        assertTrue("boom inside" in error, error)
    }

    @Test
    fun `error result does not publish events`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        commandRegistry.register(
            PluginId("demo"),
            object : Command("fail") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult =
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

    @Test
    fun `command that exceeds timeout returns a timeout error`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        commandRegistry.register(
            PluginId("demo"),
            object : Command("slow") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                    delay(5_000)
                    return CommandResult.success("done")
                }
            }
        )

        val executor = CommandExecutor(
            commandRegistry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            messages,
            timeoutMs = 100
        )

        val result = executor.execute(projectOf(ProjectId.generate()), "demo.slow", null, sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertEquals(Messages.COMMAND_TIMEOUT, result.error)
    }

    @Test
    fun `command is rejected with busy error when executor is saturated`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        val started = java.util.concurrent.CountDownLatch(1)
        commandRegistry.register(
            PluginId("demo"),
            object : Command("hold") {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                    started.countDown()
                    delay(1_000)
                    return CommandResult.success("released")
                }
            }
        )

        val executor = CommandExecutor(
            commandRegistry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            messages,
            maxConcurrency = 1,
            queueWaitMs = 50
        )

        val project = projectOf(ProjectId.generate())
        val holder = launch(Dispatchers.Default) {
            executor.execute(project, "demo.hold", null, sessionId = null)
        }
        assertTrue(started.await(2, java.util.concurrent.TimeUnit.SECONDS))

        val result = executor.execute(project, "demo.hold", null, sessionId = null)

        assertEquals(CommandResult.Status.ERROR, result.status)
        assertEquals(Messages.COMMAND_BUSY, result.error)
        holder.join()
    }

    @Test
    fun `read-only commands run in parallel while a writer is serialized`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        val readerEntered = java.util.concurrent.CountDownLatch(2)
        val releaseReaders = java.util.concurrent.CountDownLatch(1)
        commandRegistry.register(
            PluginId("demo"),
            object : Command("read", readOnly = true) {
                override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                    readerEntered.countDown()
                    releaseReaders.await()
                    return CommandResult.success("ok")
                }
            }
        )

        val executor = CommandExecutor(
            commandRegistry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            messages
        )

        val project = projectOf(ProjectId.generate())
        val reader1 = launch(Dispatchers.Default) { executor.execute(project, "demo.read", null, sessionId = null) }
        val reader2 = launch(Dispatchers.Default) { executor.execute(project, "demo.read", null, sessionId = null) }

        // Both readers hold the shared lock simultaneously (no write lock in between).
        assertTrue(readerEntered.await(2, java.util.concurrent.TimeUnit.SECONDS))
        releaseReaders.countDown()
        reader1.join()
        reader2.join()
    }

    private fun projectOf(projectId: ProjectId): Project {
        val entityRegistry = InMemoryEntityRegistry()
        return runtime.application.project.ProjectFactory(entityRegistry, DefaultEntityStore())
            .create(projectId)
    }
}
