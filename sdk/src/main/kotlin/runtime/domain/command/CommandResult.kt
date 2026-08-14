package runtime.domain.command

import runtime.domain.obj.ObjectRef

data class CommandResult(
    val status: Status,
    val value: Any? = null,
    val references: List<ObjectRef> = emptyList(),
    val error: String? = null
) {
    enum class Status { SUCCESS, ERROR }

    companion object {
        fun success(value: Any? = null, references: List<ObjectRef> = emptyList()): CommandResult {
            return CommandResult(Status.SUCCESS, value, references)
        }

        fun error(message: String): CommandResult {
            return CommandResult(Status.ERROR, error = message)
        }
    }
}
