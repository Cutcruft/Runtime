package runtime.domain.script

import runtime.domain.command.FieldError
import runtime.domain.entity.EntityField
import runtime.domain.entity.EntitySchema
import runtime.domain.entity.FieldType

/**
 * Validates a Map-typed model/params against a declarative [EntitySchema].
 * Produces structured [FieldError]s consumed by CommandResult.fieldErrors.
 */
object SchemaValidator {

    fun validate(schema: EntitySchema, input: Map<*, *>?, includeId: Boolean): List<FieldError> {
        val map = input ?: emptyMap<Any, Any>()
        val errors = mutableListOf<FieldError>()

        // Required fields
        for (field in schema.fields) {
            if (field.required && map[field.name] == null) {
                errors += requiredError(field)
            }
        }

        // Present fields → value checks
        for (field in schema.fields) {
            val raw = map[field.name] ?: continue
            validateValue(field, raw)?.let { errors += it }
        }

        return errors
    }

    /**
     * Validates only the fields present in [input] (partial-update semantics).
     * Required checks are skipped; value checks (type/enum/min/max/pattern/uuid) apply.
     */
    fun validateProvided(schema: EntitySchema, input: Map<*, *>?): List<FieldError> {
        val map = input ?: return emptyList()
        val errors = mutableListOf<FieldError>()
        for (field in schema.fields) {
            val raw = map[field.name] ?: continue
            validateValue(field, raw)?.let { errors += it }
        }
        return errors
    }

    private fun validateValue(field: EntityField, raw: Any): FieldError? {
        return when (field.type) {
            FieldType.STRING, FieldType.TEXT, FieldType.ENUM, FieldType.UUID, FieldType.DATE ->
                validateStringLike(field, raw)
            FieldType.NUMBER, FieldType.INTEGER ->
                validateNumber(field, raw)
            FieldType.BOOLEAN ->
                if (raw is Boolean) null
                else fieldError(field, "type", "Field '${field.name}' must be a boolean")
            FieldType.REFERENCE -> validateReference(field, raw)
            FieldType.ARRAY ->
                if (raw is List<*>) null
                else fieldError(field, "type", "Field '${field.name}' must be an array")
            FieldType.OBJECT ->
                if (raw is Map<*, *>) null
                else fieldError(field, "type", "Field '${field.name}' must be an object")
        }
    }

    private fun validateStringLike(field: EntityField, raw: Any): FieldError? {
        if (field.type == FieldType.BOOLEAN) return null
        val text = raw.toString()
        field.min?.let {
            if (text.length < it) {
                return fieldError(field, "minLength", "Field '${field.name}' must be at least ${it.toInt()} characters")
            }
        }
        field.max?.let {
            if (text.length > it) {
                return fieldError(field, "maxLength", "Field '${field.name}' must be at most ${it.toInt()} characters")
            }
        }
        field.pattern?.let {
            if (!Regex(it).matches(text)) {
                return fieldError(field, "pattern", "Field '${field.name}' does not match the required pattern")
            }
        }
        if (field.type == FieldType.UUID) {
            val ok = runCatching { java.util.UUID.fromString(text) }.isSuccess
            if (!ok) return fieldError(field, "uuid", "Field '${field.name}' must be a valid UUID")
        }
        if (field.type == FieldType.ENUM && field.enumValues.isNotEmpty() && text !in field.enumValues) {
            return fieldError(field, "enum", "Field '${field.name}' must be one of: ${field.enumValues.joinToString(", ")}")
        }
        return null
    }

    private fun validateNumber(field: EntityField, raw: Any): FieldError? {
        val number = when (raw) {
            is Number -> raw.toDouble()
            is String -> raw.toDoubleOrNull()
            else -> null
        } ?: return fieldError(field, "type", "Field '${field.name}' must be a number")
        field.min?.let {
            if (number < it) return fieldError(field, "min", "Field '${field.name}' must be at least $it")
        }
        field.max?.let {
            if (number > it) return fieldError(field, "max", "Field '${field.name}' must be at most $it")
        }
        if (field.type == FieldType.INTEGER && number != number.toLong().toDouble()) {
            return fieldError(field, "type", "Field '${field.name}' must be an integer")
        }
        return null
    }

    private fun validateReference(field: EntityField, raw: Any): FieldError? {
        // A reference is stored as a UUID string (or a {entityType, objectId} map).
        if (raw is Map<*, *>) {
            if (raw["objectId"] != null) return null
            return fieldError(field, "reference", "Field '${field.name}' must reference an object")
        }
        val text = raw.toString()
        val ok = runCatching { java.util.UUID.fromString(text) }.isSuccess
        if (!ok) {
            return fieldError(field, "reference", "Field '${field.name}' must be a valid object id")
        }
        return null
    }

    private fun requiredError(field: EntityField): FieldError =
        FieldError(
            field = field.name,
            code = "required",
            message = if (field.description.isNotBlank()) "Field '${field.name}' is required: ${field.description}"
            else "Field '${field.name}' is required"
        )

    private fun fieldError(field: EntityField, code: String, message: String): FieldError =
        FieldError(field = field.name, code = code, message = message)
}
