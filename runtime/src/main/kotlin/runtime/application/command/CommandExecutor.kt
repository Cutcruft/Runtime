package runtime.application.command

import java.util.concurrent.Semaphore
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.TimeoutCancellationException
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeout
import runtime.application.audit.AuditService
import runtime.application.event.EventPublisher
import runtime.domain.command.AnalyticalCommand
import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.command.CommandType
import runtime.domain.command.PipelineCommand
import runtime.domain.command.PipelineStep
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.models.RuntimeEvent
import runtime.domain.obj.ObjectRef
import runtime.domain.repositories.CommandRegistry
import runtime.infrastructure.infrastructure.EmptyInfrastructureRegistry
import runtime.infrastructure.infrastructure.InfrastructureService
import runtime.infrastructure.infrastructure.NoopInfrastructureClient
import runtime.infrastructure.query.CalciteQueryEngine
import runtime.infrastructure.script.NoopScriptEngine
import runtime.infrastructure.script.ScriptEngine

/**
 * Executes commands with an automatic per-project read/write lock, a global
 * concurrency bound with back-pressure, and an optional per-command timeout.
 *
 *  - read-only commands run under the shared project read lock (parallel);
 *  - mutating commands run under the exclusive project write lock (serialized);
 *  - at most [maxConcurrency] commands execute concurrently across all sessions —
 *    if no permit frees up within [queueWaitMs], the command is rejected with a
 *    busy error instead of queueing without bound;
 *  - if [timeoutMs] is set, a command that exceeds it is cancelled and reported
 *    as a timeout error.
 *
 * The blocking command code always runs on [dispatcher] (a bounded thread pool),
 * never on the WebSocket/HTTP worker coroutines.
 */
class CommandExecutor(
    private val commandRegistry: CommandRegistry,
    private val auditService: AuditService,
    private val projectLocks: ProjectLocks,
    private val messages: Messages,
    private val eventPublisher: EventPublisher? = null,
    private val dispatcher: CoroutineDispatcher = Dispatchers.Default,
    private val maxConcurrency: Int = Runtime.getRuntime().availableProcessors(),
    private val queueWaitMs: Long = 5_000,
    private val timeoutMs: Long? = null,
    private val queryEngine: CalciteQueryEngine = CalciteQueryEngine(),
    private val infrastructure: InfrastructureService = InfrastructureService(
        registry = EmptyInfrastructureRegistry,
        client = NoopInfrastructureClient
    ),
    private val scriptEngine: ScriptEngine = NoopScriptEngine
) {
    private val concurrency = Semaphore(maxConcurrency)

    fun findCommand(commandId: String): Command? = commandRegistry.get(commandId)

    suspend fun execute(
        project: Project,
        commandId: String,
        params: Any?,
        sessionId: String?
    ): CommandResult {
        val command = commandRegistry.get(commandId)
            ?: return CommandResult.error(messages.format(Messages.COMMAND_NOT_FOUND, "commandId" to commandId))

        val result = withContext(dispatcher) {
            try {
                withTimeout(timeoutMs ?: Long.MAX_VALUE) {
                    if (!concurrency.tryAcquire(queueWaitMs, TimeUnit.MILLISECONDS)) {
                        CommandResult.error(
                            messages.format(Messages.COMMAND_BUSY, "commandId" to commandId)
                        )
                    } else {
                        try {
                            runWithinProjectLock(command, project, params)
                        } finally {
                            concurrency.release()
                        }
                    }
                }
            } catch (e: TimeoutCancellationException) {
                CommandResult.error(
                    messages.format(
                        Messages.COMMAND_TIMEOUT,
                        "commandId" to commandId,
                        "timeoutMs" to (timeoutMs ?: "")
                    )
                )
            }
        }

        auditService.record(project.id, commandId, mapOf("params" to params), result, sessionId)
        publishChanges(project, result, sessionId)
        return result
    }

    private suspend fun runWithinProjectLock(
        command: Command,
        project: Project,
        params: Any?
    ): CommandResult {
        if (command.type == CommandType.ANALYTICAL) {
            return projectLocks.withRead(project.id) {
                val analytical = command as? AnalyticalCommand
                    ?: return@withRead CommandResult.error(
                        messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to "Analytical command missing SQL")
                    )
                queryEngine.execute(project, analytical.sql, params)
            }
        }
        if (command.type == CommandType.PIPELINE) {
            val pipeline = command as? PipelineCommand
                ?: return CommandResult.error(
                    messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to "Pipeline command missing steps")
                )
            val visited = hashSetOf(pipeline.name)
            return if (command.readOnly) {
                projectLocks.withRead(project.id) { runPipeline(pipeline, project, params, visited, 0) }
            } else {
                projectLocks.withWrite(project.id) { runPipeline(pipeline, project, params, visited, 0) }
            }
        }
        val context: CommandContext = CommandContextImpl(project, projectLocks, messages, infrastructure, scriptEngine)
        // ANALYTICAL commands are always read-only regardless of the flag.
        return if (command.readOnly || command.type == CommandType.ANALYTICAL) {
            projectLocks.withRead(project.id) { command.execute(context, params) }
        } else {
            projectLocks.withWrite(project.id) { command.execute(context, params) }
        }
    }

    private suspend fun runPipeline(
        pipeline: PipelineCommand,
        project: Project,
        params: Any?,
        visited: MutableSet<String>,
        depth: Int
    ): CommandResult {
        val variables = LinkedHashMap<String, Any?>()
        (params as? Map<*, *>)?.forEach { (k, v) -> variables[k.toString()] = v }
        val stepResults = mutableListOf<Map<String, Any?>>()
        val allReferences = mutableListOf<ObjectRef>()

        pipeline.steps.forEachIndexed { index, step ->
            val stepId = index + 1
            val resolved = commandRegistry.get(step.command)
            if (resolved == null) {
                return failStep(step, stepId, "unknown command '${step.command}'", stepResults, allReferences)
            }
            if (resolved.type == CommandType.PIPELINE && step.command in visited) {
                return failStep(step, stepId, "circular pipeline reference '${step.command}'", stepResults, allReferences)
            }
            if (depth >= MAX_PIPELINE_DEPTH) {
                return failStep(step, stepId, "pipeline depth limit exceeded", stepResults, allReferences)
            }
            val stepParams = substitute(step.params, step.input, variables)
            val stepResult = try {
                when {
                resolved.type == CommandType.PIPELINE -> {
                    val nested = resolved as? PipelineCommand
                    if (nested == null) {
                        CommandResult.error(
                            messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to "Pipeline command missing steps")
                        )
                    } else {
                        runPipeline(
                            nested,
                            project,
                            stepParams,
                            visited.also { it.add(step.command) },
                            depth + 1
                        )
                    }
                }
                resolved.type == CommandType.ANALYTICAL -> {
                    val analytical = resolved as? AnalyticalCommand
                    if (analytical == null) {
                        CommandResult.error(
                            messages.format(Messages.COMMAND_EXECUTION_FAILED, "message" to "Analytical command missing SQL")
                        )
                    } else {
                        queryEngine.execute(project, analytical.sql, stepParams)
                    }
                }
                else -> {
                    val context: CommandContext = CommandContextImpl(project, projectLocks, messages, infrastructure, scriptEngine)
                    resolved.execute(context, stepParams)
                }
                }
            } catch (e: Exception) {
                CommandResult.error("${e::class.simpleName}: ${e.message}")
            }
            allReferences += stepResult.references
            stepResults += mapOf(
                "command" to step.command,
                "status" to if (stepResult.status == CommandResult.Status.SUCCESS) "ok" else "error",
                "value" to stepResult.value,
                "error" to stepResult.error
            ).filterValues { it != null }

            if (stepResult.status == CommandResult.Status.ERROR) {
                if (step.ignoreError) {
                    return@forEachIndexed
                }
                return CommandResult(
                    status = CommandResult.Status.ERROR,
                    value = mapOf("failedStep" to stepId, "steps" to stepResults),
                    references = allReferences,
                    error = "Step $stepId (${step.command}) failed: ${stepResult.error}"
                )
            }
            step.output.forEach { (key, varName) ->
                val extracted = if (key.isEmpty()) stepResult.value else extractField(stepResult.value, key)
                variables[varName] = extracted
            }
        }
        return CommandResult.success(
            value = mapOf("variables" to variables, "steps" to stepResults),
            references = allReferences
        )
    }

    private fun extractField(value: Any?, key: String): Any? {
        if (value == null) return null
        if (value is Map<*, *>) {
            if (value.containsKey(key)) return value[key]
            return null
        }
        val capitalized = key.replaceFirstChar { it.titlecase() }
        val getter = runCatching { value.javaClass.getMethod("get$capitalized") }.getOrNull()
            ?: runCatching { value.javaClass.getMethod("is$capitalized") }.getOrNull()
        return getter?.invoke(value)
    }

    private fun failStep(
        step: PipelineStep,
        stepId: Int,
        reason: String,
        stepResults: MutableList<Map<String, Any?>>,
        allReferences: MutableList<ObjectRef>
    ): CommandResult {
        stepResults += mapOf("command" to step.command, "status" to "error", "error" to reason)
        if (step.ignoreError) {
            return CommandResult.success(
                value = mapOf("variables" to emptyMap<String, Any?>(), "steps" to stepResults),
                references = allReferences
            )
        }
        return CommandResult(
            status = CommandResult.Status.ERROR,
            value = mapOf("failedStep" to stepId, "steps" to stepResults),
            references = allReferences,
            error = "Step $stepId (${step.command}) failed: $reason"
        )
    }

    private fun substitute(params: Any?, input: Map<String, String>, variables: Map<String, Any?>): Any? {
        if (input.isEmpty() || params !is Map<*, *>) return params
        val out = LinkedHashMap<Any?, Any?>()
        params.forEach { (key, value) ->
            val varName = input[key.toString()]
            val available = if (varName != null) variables[varName] else null
            out[key] = available ?: value
        }
        return out
    }

    private companion object {
        const val MAX_PIPELINE_DEPTH = 8
    }

    private suspend fun publishChanges(project: Project, result: CommandResult, sessionId: String? = null) {
        val publisher = eventPublisher ?: return
        if (result.references.isEmpty()) return
        val singleValue = if (result.references.size == 1) result.value else null
        result.references.forEach { ref ->
            publisher.publish(
                RuntimeEvent.ObjectChanged(
                    projectId = project.id,
                    entityType = ref.entityType,
                    objectId = ref.objectId,
                    value = singleValue,
                    senderSessionId = sessionId
                )
            )
        }
    }
}