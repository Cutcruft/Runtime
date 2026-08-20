package runtime.domain.models

class Messages(private val entries: Map<String, String>) {

    operator fun get(key: String): String = entries[key] ?: key

    fun format(key: String, vararg params: Pair<String, Any?>): String {
        var text = entries[key] ?: key
        params.forEach { (name, value) ->
            text = text.replace("{$name}", value?.toString() ?: "")
        }
        return text
    }

    companion object {
        const val MISSING_COMMAND_ID = "missingCommandId"
        const val UNKNOWN_MESSAGE_TYPE = "unknownMessageType"
        const val SESSION_NOT_BOUND = "sessionNotBound"
        const val SESSION_NOT_FOUND = "sessionNotFound"
        const val MISSING_PROJECT_ID = "missingProjectId"
        const val INVALID_PROJECT_ID = "invalidProjectId"
        const val PROJECT_NOT_FOUND = "projectNotFound"
        const val COMMAND_NOT_FOUND = "commandNotFound"
        const val COMMAND_PRIVATE = "commandPrivate"
        const val COMMAND_EXECUTION_FAILED = "commandExecutionFailed"
        const val COMMAND_TIMEOUT = "commandTimeout"
        const val COMMAND_BUSY = "commandBusy"
        const val COMMAND_VALIDATION_FAILED = "commandValidationFailed"
        const val MISSING_DATA = "missingData"
        const val MISSING_PARAMETERS = "missingParameters"
        const val UNKNOWN_ENTITY_TYPE = "unknownEntityType"
        const val PLUGIN_LOAD_FAILED = "pluginLoadFailed"
        const val CIRCULAR_DEPENDENCIES = "circularDependencies"

        const val DESC_CREATE = "description.create"
        const val DESC_OPEN = "description.open"
        const val DESC_LIST = "description.list"
        const val DESC_SAVE = "description.save"
        const val DESC_LOAD = "description.load"
    }
}
