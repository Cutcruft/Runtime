package runtime.domain.command

import java.util.logging.Level
import java.util.logging.Logger

/** Declarative metadata for a single command parameter, surfaced in /docs and validators. */
data class CommandParameter @JvmOverloads constructor(
    val name: String,
    val type: String = "string",
    val required: Boolean = false,
    val description: String = "",
    /** Entity model type this parameter references, e.g. "demo.task" (for reference/objectId fields). */
    val entityType: String? = null,
    /** Allowed values for enum-typed parameters. */
    val enumValues: List<String> = emptyList(),
    /** Numeric min (number types) / string min length (string types). */
    val min: Double? = null,
    /** Numeric max (number types) / string max length (string types). */
    val max: Double? = null,
    /** Regex pattern for string types. */
    val pattern: String? = null
)

abstract class Command @JvmOverloads constructor(
    val name: String,
    val description: String = "",
    val group: String? = null,
    /**
     * Declares that this command only reads project state. The runtime then
     * runs it under a shared read lock (parallel with other read-only commands)
     * instead of an exclusive write lock. Set to `true` for analytics/read-only
     * commands (e.g. queries, reports). [ANALYTICAL] commands are always read.
     */
    val readOnly: Boolean = false,
    /** Functional classification; [CommandType.LOGICAL] by default. */
    val type: CommandType = CommandType.LOGICAL,
    /** [CommandVisibility.PUBLIC] by default; PRIVATE is core-internal only. */
    val visibility: CommandVisibility = CommandVisibility.PUBLIC,
    /** Documented parameters for introspection (/docs); empty means "free-form". */
    val parameters: List<CommandParameter> = emptyList()
) {
    init {
        require(name.isNotBlank()) { "Command name must not be blank" }
        require(name.matches(Regex("^[a-z][a-z0-9]*$"))) {
            "Command name must match pattern [a-z][a-z0-9]*"
        }
    }

    /**
     * Public execution entry point. Wraps [executeInternal] with exception handling:
     * a thrown exception is logged and surfaced as an ERROR [CommandResult], so command
     * logic never leaks raw exceptions to the caller. Subclasses must NOT override this
     * method — implement [executeInternal] instead.
     */
    final suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        return try {
            executeInternal(context, params)
        } catch (e: Exception) {
            logger.log(Level.SEVERE, "Command '$name' (${javaClass.name}) failed: ${e.message}", e)
            CommandResult.error("${e::class.simpleName}: ${e.message}")
        }
    }

    /**
     * Command logic. May throw exceptions; they are caught, logged and turned into an
     * ERROR [CommandResult] by [execute]. Not part of the public command API.
     */
    protected abstract suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult

    private val logger: Logger = Logger.getLogger(javaClass.name)
}
