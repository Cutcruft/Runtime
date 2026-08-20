package runtime.domain.command

import runtime.domain.obj.ObjectRef

/** A structured field-level validation error, surfaced to clients as `fieldErrors[]`. */
data class FieldError(
    val field: String,
    val code: String,
    val message: String
)

data class CommandResult(
    val status: Status,
    val value: Any? = null,
    val references: List<ObjectRef> = emptyList(),
    val error: String? = null,
    val fieldErrors: List<FieldError> = emptyList()
) {
    enum class Status { SUCCESS, ERROR }

    companion object {
        fun success(value: Any? = null, references: List<ObjectRef> = emptyList()): CommandResult {
            return CommandResult(Status.SUCCESS, value, references)
        }

        fun error(message: String): CommandResult {
            return CommandResult(Status.ERROR, error = message)
        }

        fun validationError(message: String, fieldErrors: List<FieldError>): CommandResult {
            return CommandResult(Status.ERROR, error = message, fieldErrors = fieldErrors)
        }
    }
}
