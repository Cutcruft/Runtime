package runtime.infrastructure.script

import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult

/**
 * Evaluates logical scripts on behalf of [CommandContext.evaluateScript].
 *
 * The engine lives in the runtime (the SDK only declares the contract), so plugins never
 * depend on the Kotlin compiler. Implementations compile scripts on demand and cache by
 * the source hash; compilation happens off the command path.
 */
interface ScriptEngine {
    fun evaluate(code: String, params: Any?, context: CommandContext): CommandResult

    /** Trial-compiles [code]; returns an error message, or `null` when valid. */
    fun validate(code: String): String?
}

/** Default engine used when the runtime is built without a script engine (e.g. unit tests). */
object NoopScriptEngine : ScriptEngine {
    override fun evaluate(code: String, params: Any?, context: CommandContext): CommandResult =
        CommandResult.error("Script engine is not available in this runtime")

    override fun validate(code: String): String? =
        "Script engine is not available in this runtime"
}
