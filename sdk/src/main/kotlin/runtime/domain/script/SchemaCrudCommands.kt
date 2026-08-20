package runtime.domain.script

import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandParameter
import runtime.domain.command.CommandResult
import runtime.domain.command.CommandType
import runtime.domain.command.CommandVisibility
import runtime.domain.entity.EntityField
import runtime.domain.entity.EntitySchema
import runtime.domain.entity.FieldType
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectRef

/**
 * Generates declarative CRUD commands from an [EntitySchema].
 *
 * Models are stored as `Map<String, Any?>` and validated against the schema
 * before every write (required, types, enum, min/max, pattern, reference
 * existence). The generated commands declare their parameters from the schema,
 * so the runtime command validator and /config/commands expose the same rules.
 *
 * Naming: `<prefix>create`, `<prefix>update`, `<prefix>delete`, `<prefix>list`,
 * `<prefix>validate` (prefix defaults to the entity name, e.g. "demo.task" → "task").
 */
object SchemaCrudCommands {

    /** Builds the four mutating/read commands for a schema. Registers under `prefix`. */
    fun create(schema: EntitySchema, prefix: String = entityName(schema), group: String? = null): Command {
        return object : Command(
            name = "${prefix}create",
            description = "Create ${schema.entityType.value}",
            group = group,
            type = CommandType.SYSTEM,
            visibility = CommandVisibility.PUBLIC,
            parameters = commandParameters(schema, includeId = false)
        ) {
            override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                val input = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
                val fieldErrors = SchemaValidator.validate(schema, input, includeId = false)
                if (fieldErrors.isNotEmpty()) {
                    return CommandResult.validationError(
                        "Invalid ${schema.entityType.value}",
                        fieldErrors
                    )
                }
                return context.withProjectLock {
                    val model = buildModel(schema, input)
                    val ref = context.objectList<Any>(schema.entityType).create(model)
                    CommandResult.success(value = model, references = listOf(ref))
                }
            }
        }
    }

    fun update(schema: EntitySchema, prefix: String = entityName(schema), group: String? = null): Command {
        return object : Command(
            name = "${prefix}update",
            description = "Update ${schema.entityType.value}",
            group = group,
            type = CommandType.SYSTEM,
            visibility = CommandVisibility.PUBLIC,
            parameters = commandParameters(schema, includeId = true, markFieldsRequired = false)
        ) {
            override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                val input = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
                val id = parseId(input) ?: return CommandResult.error("Missing or invalid id")
                // Partial update: validate only the fields actually provided (required fields
                // are not re-required on update unless explicitly sent).
                val fieldErrors = SchemaValidator.validateProvided(schema, input)
                if (fieldErrors.isNotEmpty()) {
                    return CommandResult.validationError("Invalid ${schema.entityType.value}", fieldErrors)
                }
                return context.withProjectLock {
                    val list = context.objectList<Map<String, Any?>>(schema.entityType)
                    val existing = list.get(id) ?: return@withProjectLock CommandResult.error("Entity not found")
                    val merged = existing.toMutableMap()
                    schema.fields.forEach { field ->
                        val value = input[field.name]
                        if (value != null || field.defaultValue != null) {
                            merged[field.name] = value ?: field.defaultValue
                        }
                    }
                    if (!list.update(id, merged)) {
                        return@withProjectLock CommandResult.error("Entity not found")
                    }
                    CommandResult.success(value = merged, references = listOf(ObjectRef(schema.entityType, id)))
                }
            }
        }
    }

    fun delete(schema: EntitySchema, prefix: String = entityName(schema), group: String? = null): Command {
        return object : Command(
            name = "${prefix}delete",
            description = "Delete ${schema.entityType.value}",
            group = group,
            type = CommandType.SYSTEM,
            visibility = CommandVisibility.PUBLIC,
            parameters = listOf(CommandParameter("id", "uuid", required = true, description = "Entity id"))
        ) {
            override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                val input = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
                val id = parseId(input) ?: return CommandResult.error("Missing or invalid id")
                return context.withProjectLock {
                    if (!context.objectList<Any>(schema.entityType).delete(id)) {
                        return@withProjectLock CommandResult.error("Entity not found")
                    }
                    CommandResult.success(
                        value = mapOf("deleted" to id.value.toString()),
                        references = listOf(ObjectRef(schema.entityType, id))
                    )
                }
            }
        }
    }

    fun list(schema: EntitySchema, prefix: String = entityName(schema), group: String? = null): Command {
        return object : Command(
            name = "${prefix}list",
            description = "List ${schema.entityType.value}",
            group = group,
            readOnly = true,
            type = CommandType.SYSTEM,
            visibility = CommandVisibility.PUBLIC,
            parameters = listOf(
                CommandParameter("offset", "integer", required = false, description = "Pagination offset"),
                CommandParameter("limit", "integer", required = false, description = "Pagination limit")
            )
        ) {
            override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                val input = params as? Map<*, *>
                val offset = (input?.get("offset") as? Number)?.toInt() ?: 0
                val limit = (input?.get("limit") as? Number)?.toInt() ?: Int.MAX_VALUE
                val list = context.objectList<Map<String, Any?>>(schema.entityType)
                val rows = list.list().mapNotNull { ref ->
                    val model = list.get(ref.objectId) ?: return@mapNotNull null
                    mapOf("id" to ref.objectId.value.toString()) + model
                }.drop(offset).take(limit)
                return CommandResult.success(value = rows)
            }
        }
    }

    fun validate(schema: EntitySchema, prefix: String = entityName(schema), group: String? = null): Command {
        return object : Command(
            name = "${prefix}validate",
            description = "Validate ${schema.entityType.value}",
            group = group,
            readOnly = true,
            type = CommandType.SYSTEM,
            visibility = CommandVisibility.PUBLIC,
            parameters = commandParameters(schema, includeId = false)
        ) {
            override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
                val input = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
                val errors = SchemaValidator.validate(schema, input, includeId = false)
                return if (errors.isEmpty()) {
                    CommandResult.success(value = mapOf("valid" to true))
                } else {
                    CommandResult.validationError("Invalid ${schema.entityType.value}", errors)
                }
            }
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    fun commandParameters(schema: EntitySchema, includeId: Boolean, markFieldsRequired: Boolean = true): List<CommandParameter> {
        val params = mutableListOf<CommandParameter>()
        if (includeId) {
            params += CommandParameter("id", "uuid", required = true, description = "Entity id")
        }
        for (field in schema.fields) {
            params += fieldToParameter(field, required = markFieldsRequired && field.required)
        }
        return params
    }

    private fun fieldToParameter(field: EntityField, required: Boolean): CommandParameter {
        return CommandParameter(
            name = field.name,
            type = field.type.name.lowercase(),
            required = required,
            description = field.description,
            entityType = field.reference?.value,
            enumValues = field.enumValues,
            min = field.min,
            max = field.max,
            pattern = field.pattern
        )
    }

    private fun buildModel(schema: EntitySchema, input: Map<*, *>): Map<String, Any?> {
        val model = LinkedHashMap<String, Any?>()
        for (field in schema.fields) {
            val raw = input[field.name]
            model[field.name] = raw ?: field.defaultValue
        }
        return model
    }

    private fun parseId(input: Map<*, *>): ObjectId? {
        val raw = input["id"] ?: return null
        return if (raw is String) ObjectId.fromString(raw) else null
    }

    private fun entityName(schema: EntitySchema): String {
        // "demo.task" → "task"
        return schema.entityType.value.substringAfter('.')
    }
}
