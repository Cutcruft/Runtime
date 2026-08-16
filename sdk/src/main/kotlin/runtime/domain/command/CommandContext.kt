package runtime.domain.command

import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectList

interface CommandContext {
    fun <T> getObject(entityType: EntityType, objectId: ObjectId): T?

    fun <T> objectList(entityType: EntityType): ObjectList<T>

    fun <T> withProjectLock(block: () -> T): T

    /**
     * Invokes a registered external [runtime.domain.connector.DataSource] (REST or gRPC)
     * with [request] and returns the deserialized response (a Jackson value: map/list/primitive).
     */
    fun <T> invokeDataSource(sourceId: String, request: Any?): T?

    /** Writes [payload] to a registered external [runtime.domain.connector.DataSink]; returns the response. */
    fun writeDataSink(sinkId: String, payload: Any?): Any?

    /**
     * Compiles and runs the Kotlin script [code]. The script sees `context` and `params`
     * bindings and must define a top-level `fun run(context: CommandContext, params: Any?): Any?`
     * whose return value is wrapped into a [CommandResult] (a returned [CommandResult] is kept as-is).
     * The engine prepends the default imports from [LogicalScriptCommand.DEFAULT_SCRIPT_IMPORTS].
     */
    fun evaluateScript(code: String, params: Any?): CommandResult

    /** Trial-compiles [code]; returns an error message, or `null` when the script is valid. */
    fun validateScript(code: String): String?
}
