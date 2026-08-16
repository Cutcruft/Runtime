package runtime.application.command

import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.entity.EntityType
import runtime.domain.models.Messages
import runtime.domain.models.Project
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectList
import runtime.infrastructure.infrastructure.InfrastructureService
import runtime.infrastructure.script.NoopScriptEngine
import runtime.infrastructure.script.ScriptEngine

class CommandContextImpl(
    val project: Project,
    private val projectLocks: ProjectLocks,
    private val messages: Messages,
    private val infrastructure: InfrastructureService,
    private val scriptEngine: ScriptEngine = NoopScriptEngine
) : CommandContext {

    override fun <T> getObject(entityType: EntityType, objectId: ObjectId): T? {
        return project.objectList<T>(entityType)?.get(objectId)
    }

    override fun <T> objectList(entityType: EntityType): ObjectList<T> {
        return project.objectList<T>(entityType)
            ?: throw IllegalArgumentException(messages.format(Messages.UNKNOWN_ENTITY_TYPE, "entityType" to entityType.value))
    }

    override fun <T> withProjectLock(block: () -> T): T = projectLocks.withProjectLock(project.id, block)

    override fun <T> invokeDataSource(sourceId: String, request: Any?): T? {
        return infrastructure.invokeDataSource(sourceId, request)
    }

    override fun writeDataSink(sinkId: String, payload: Any?): Any? {
        return infrastructure.writeDataSink(sinkId, payload)
    }

    override fun evaluateScript(code: String, params: Any?): CommandResult {
        return scriptEngine.evaluate(code, params, this)
    }

    override fun validateScript(code: String): String? {
        return scriptEngine.validate(code)
    }
}
