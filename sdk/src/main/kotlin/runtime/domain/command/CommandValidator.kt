package runtime.domain.command

/**
 * Validates command `params` against the declared parameter schema and produces
 * structured [FieldError]s. Returns an empty list when the params are valid.
 *
 * Supported types: `string`, `number` (int/long/double), `integer`, `boolean`,
 * `uuid`, `enum`, `array`, `object`/`map`. When a parameter declares
 * [CommandParameter.enumValues], an `enum`-typed value must be one of them.
 * `min`/`max` apply to numeric ranges or string lengths; `pattern` applies to strings.
 */
object CommandValidator {

    fun validate(command: Command, params: Any?): List<FieldError> {
        if (command.parameters.isEmpty()) return emptyList()
        val map = params as? Map<*, *> ?: emptyMap<Any, Any>()

        val errors = mutableListOf<FieldError>()

        for (param in command.parameters) {
            val key = param.name
            val raw = map[key]

            // Required check
            if (param.required && raw == null) {
                errors += FieldError(
                    field = key,
                    code = "required",
                    message = if (param.description.isNotBlank()) "Field '$key' is required: ${param.description}"
                    else "Field '$key' is required"
                )
                continue
            }
            if (raw == null) continue

            validateValue(param, raw, key)?.let { errors += it }
        }

        return errors
    }

    private fun validateValue(param: CommandParameter, raw: Any, field: String): FieldError? {
        val type = param.type.lowercase()

        return when (type) {
            "string", "text" -> validateString(param, raw, field)
            "number", "integer", "int", "long", "double", "float" -> validateNumber(param, raw, field)
            "boolean", "bool" ->
                if (raw is Boolean) null
                else fieldError(field, "type", "Field '$field' must be a boolean")
            "uuid" -> {
                val text = raw.toString()
                val ok = runCatching { java.util.UUID.fromString(text) }.isSuccess
                if (ok) null else fieldError(field, "uuid", "Field '$field' must be a valid UUID")
            }
            "enum" -> validateEnum(param, raw, field)
            "array", "list" -> {
                if (raw is List<*>) null
                else fieldError(field, "type", "Field '$field' must be an array")
            }
            "object", "map" -> {
                if (raw is Map<*, *>) null
                else fieldError(field, "type", "Field '$field' must be an object")
            }
            // Unknown declared types are treated as string-ish (accept any scalar).
            else -> null
        }
    }

    private fun validateString(param: CommandParameter, raw: Any, field: String): FieldError? {
        if (raw !is String) return fieldError(field, "type", "Field '$field' must be a string")
        param.min?.let {
            if (raw.length < it) {
                return fieldError(field, "minLength", "Field '$field' must be at least ${it.toInt()} characters")
            }
        }
        param.max?.let {
            if (raw.length > it) {
                return fieldError(field, "maxLength", "Field '$field' must be at most ${it.toInt()} characters")
            }
        }
        param.pattern?.let {
            if (!Regex(it).matches(raw)) {
                return fieldError(field, "pattern", "Field '$field' does not match the required pattern")
            }
        }
        return null
    }

    private fun validateNumber(param: CommandParameter, raw: Any, field: String): FieldError? {
        val number = when (raw) {
            is Number -> raw.toDouble()
            is String -> raw.toDoubleOrNull()
            else -> null
        } ?: return fieldError(field, "type", "Field '$field' must be a number")
        param.min?.let {
            if (number < it) {
                return fieldError(field, "min", "Field '$field' must be at least $it")
            }
        }
        param.max?.let {
            if (number > it) {
                return fieldError(field, "max", "Field '$field' must be at most $it")
            }
        }
        return null
    }

    private fun validateEnum(param: CommandParameter, raw: Any, field: String): FieldError? {
        val text = raw.toString()
        val allowed = param.enumValues
        if (allowed.isNotEmpty() && text !in allowed) {
            return fieldError(field, "enum", "Field '$field' must be one of: ${allowed.joinToString(", ")}")
        }
        return null
    }

    private fun fieldError(field: String, code: String, message: String): FieldError =
        FieldError(field = field, code = code, message = message)
}
