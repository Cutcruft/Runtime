package runtime.domain.command

/**
 * A single step of a [PipelineCommand].
 *
 * @property command full id of the command to invoke (e.g. `"demo.create"`, `"app.report"`).
 *   Any registered command works: `LOGICAL`, `SYSTEM`, `ANALYTICAL`, `INFRASTRUCTURE`,
 *   and nested `PIPELINE` commands (the runtime guards against circular references and
 *   enforces a depth limit).
 * @property params static parameters passed to the step command. Values for keys listed
 *   in [input] are replaced with the current pipeline variable when it is available.
 * @property input maps a parameter key of [params] to a pipeline variable name. At run
 *   time the step receives `params` with the listed keys replaced by the variable's value
 *   (the static value is kept until the variable is produced).
 * @property output maps a key of the step's result value to a pipeline variable name.
 *   After a successful step, `result.value[key]` is stored as the variable; an empty key
 *   `""` stores the whole result value.
 * @property ignoreError when `true`, a failing step is recorded in the pipeline result but
 *   execution continues (its variables are not produced); otherwise the pipeline stops at
 *   the first error (fail-fast).
 */
class PipelineStep @JvmOverloads constructor(
    val command: String,
    val params: Any? = null,
    val input: Map<String, String> = emptyMap(),
    val output: Map<String, String> = emptyMap(),
    val ignoreError: Boolean = false
) {
    init {
        require(command.isNotBlank()) { "Step command must not be blank" }
    }
}

/**
 * Orchestrates other commands as sequential steps.
 *
 * Execution is performed by the runtime (it must resolve each step by full id and run it
 * under the pipeline's single project lock), not by [execute] — that method returns an
 * error if the command is ever invoked directly outside the executor.
 *
 * Pipeline invocation parameters are seeded as initial pipeline variables (top-level keys
 * of a map `params`), so steps can read them through [PipelineStep.input].
 */
open class PipelineCommand @JvmOverloads constructor(
    name: String,
    val steps: List<PipelineStep>,
    description: String = "",
    group: String? = null,
    readOnly: Boolean = false,
    visibility: CommandVisibility = CommandVisibility.PUBLIC
) : Command(name, description, group, readOnly, CommandType.PIPELINE, visibility) {

    init {
        require(steps.isNotEmpty()) { "Pipeline must contain at least one step" }
    }

    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        return CommandResult.error("Pipeline commands are executed by the runtime")
    }
}
