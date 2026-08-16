package runtime.domain.command

import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectId

/**
 * A command that resolves a Kotlin script stored as a project entity and evaluates it.
 *
 * Scripts live in the project under [scriptType]; the entity model exposes the source code
 * through [scriptField]. The command resolves the entity by id (parameter [scriptIdParam],
 * `id`, or a bare string argument) and hands the code to [CommandContext.evaluateScript].
 *
 * The engine is provided by the runtime, so plugins only declare commands — they never
 * depend on the Kotlin compiler.
 *
 * Script contract (see [DEFAULT_SCRIPT_IMPORTS]):
 * ```
 * fun run(context: CommandContext, params: Any?): Any? {
 *     ...
 * }
 * ```
 * The script sees `context` and `params` and its return value is wrapped in a
 * [CommandResult] (a returned [CommandResult] is kept as-is).
 */
abstract class LogicalScriptCommand @JvmOverloads constructor(
    name: String,
    description: String,
    val scriptType: EntityType,
    val scriptIdParam: String = "scriptId",
    val scriptField: String = "code",
    group: String = "Logical",
    readOnly: Boolean = false,
    visibility: CommandVisibility = CommandVisibility.PUBLIC,
    parameters: List<CommandParameter> = emptyList()
) : Command(
    name = name,
    description = description,
    group = group,
    readOnly = readOnly,
    type = CommandType.LOGICAL,
    visibility = visibility,
    parameters = parameters
) {

    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val scriptId = readScriptId(params)
            ?: return CommandResult.error("Missing $scriptIdParam parameter")
        val scriptIdObj = ObjectId.fromString(scriptId)
            ?: return CommandResult.error("Invalid script id '$scriptId'")
        val entity: Any = context.getObject<Any>(scriptType, scriptIdObj)
            ?: return CommandResult.error("Script '$scriptId' not found (type ${scriptType.value})")
        val code: Any? = extractField(entity, scriptField)
            ?: return CommandResult.error("Script '$scriptId' has no '$scriptField'")
        if (code !is String) {
            return CommandResult.error("Script '$scriptId' field '$scriptField' must be a string")
        }
        return context.evaluateScript(code, params)
    }

    private fun readScriptId(params: Any?): String? = when (params) {
        is String -> params.takeIf { it.isNotBlank() }
        is Map<*, *> -> (params[scriptIdParam] ?: params["id"])?.toString()?.takeIf { it.isNotBlank() }
        else -> null
    }

    private fun extractField(target: Any, field: String): Any? {
        if (target is Map<*, *>) {
            return target[field] ?: target[field.replaceFirstChar { it.lowercaseChar() }]
        }
        val suffix = field.replaceFirstChar { it.uppercaseChar() }
        val clazz = target.javaClass
        listOf("get$suffix", "is$suffix").forEach { method ->
            val accessor = runCatching { clazz.getMethod(method) }.getOrNull()
                ?: runCatching { clazz.getDeclaredMethod(method) }.getOrNull()
            accessor?.let { m ->
                if (!m.isAccessible) m.trySetAccessible()
                runCatching { m.invoke(target) }.getOrNull()?.let { return it }
            }
        }
        return runCatching { clazz.getField(field).get(target) }.getOrNull()
    }

    companion object {
        /** Default imports prepended to every logical script by the runtime engine. */
        val DEFAULT_SCRIPT_IMPORTS: String = "import runtime.domain.command.CommandContext\n" +
            "import runtime.domain.command.CommandResult\n" +
            "import runtime.domain.entity.EntityType\n" +
            "import runtime.domain.obj.ObjectId\n" +
            "import runtime.domain.obj.ObjectRef"
    }
}
