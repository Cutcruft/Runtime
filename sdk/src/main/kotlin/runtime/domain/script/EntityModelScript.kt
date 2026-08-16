package runtime.domain.script

import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.command.CommandType
import runtime.domain.command.CommandVisibility
import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectRef

/**
 * SDK template for standard CRUD commands over a plugin entity model.
 *
 * A plugin subclasses this once per model, providing the mapping from command params to the
 * model (and optional field validation), then registers the four generated commands:
 *
 * ```
 * object TaskScript : EntityModelScript<Task>(TASK_TYPE, namePrefix = "task") {
 *     override fun createModel(params: Any?): Task {
 *         val p = params as? Map<*, *> ?: error("Missing parameters")
 *         return Task(title = p["title"] as? String ?: error("Missing title"), status = "open")
 *     }
 *
 *     override fun validate(model: Task): String? =
 *         if (model.title.isBlank()) "Title must not be blank" else null
 * }
 *
 * plugin.commandRegistry.register(pluginId, TaskScript.createCommand())
 * plugin.commandRegistry.register(pluginId, TaskScript.updateCommand())
 * plugin.commandRegistry.register(pluginId, TaskScript.deleteCommand())
 * plugin.commandRegistry.register(pluginId, TaskScript.validateCommand())
 * ```
 *
 * Every mutating command ([createCommand], [updateCommand], [deleteCommand]) returns a
 * [CommandResult] whose `references` list points at the affected entity, so the runtime
 * publishes ObjectChanged events. Ids are read from `params["id"]` as a UUID string.
 */
abstract class EntityModelScript<T : Any>(
    val entityType: EntityType,
    private val namePrefix: String = ""
) {

    /** Builds a model instance from command params for `create`/`validate`; throws on invalid input. */
    protected abstract fun createModel(params: Any?): T

    /**
     * Returns the model to store for `update`, given the current entity and the params.
     * Defaults to the current model unchanged. May throw on invalid input.
     */
    protected open fun updateModel(existing: T, params: Any?): T = existing

    /** Field-level validation; returns an error message, or `null` when the model is valid. */
    protected open fun validate(model: T): String? = null

    fun createCommand(
        name: String = "${namePrefix}create",
        group: String? = null,
        visibility: CommandVisibility = CommandVisibility.PUBLIC
    ): Command = object : Command(
        name,
        "Create ${entityType.value}",
        group,
        type = CommandType.SYSTEM,
        visibility = visibility
    ) {
        override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
            val model = createModel(params)
            validate(model)?.let { return CommandResult.error(it) }
            return context.withProjectLock {
                val ref = context.objectList<T>(entityType).create(model)
                CommandResult.success(value = model, references = listOf(ref))
            }
        }
    }

    fun updateCommand(
        name: String = "${namePrefix}update",
        group: String? = null,
        visibility: CommandVisibility = CommandVisibility.PUBLIC
    ): Command = object : Command(
        name,
        "Update ${entityType.value}",
        group,
        type = CommandType.SYSTEM,
        visibility = visibility
    ) {
        override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
            val id = idOf(params) ?: return CommandResult.error("Missing or invalid id")
            return context.withProjectLock {
                val list = context.objectList<T>(entityType)
                val existing = list.get(id) ?: return@withProjectLock CommandResult.error("Entity not found")
                val updated = updateModel(existing, params)
                validate(updated)?.let { return@withProjectLock CommandResult.error(it) }
                if (!list.update(id, updated)) {
                    return@withProjectLock CommandResult.error("Entity not found")
                }
                CommandResult.success(value = updated, references = listOf(ObjectRef(entityType, id)))
            }
        }
    }

    fun deleteCommand(
        name: String = "${namePrefix}delete",
        group: String? = null,
        visibility: CommandVisibility = CommandVisibility.PUBLIC
    ): Command = object : Command(
        name,
        "Delete ${entityType.value}",
        group,
        type = CommandType.SYSTEM,
        visibility = visibility
    ) {
        override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
            val id = idOf(params) ?: return CommandResult.error("Missing or invalid id")
            return context.withProjectLock {
                if (!context.objectList<T>(entityType).delete(id)) {
                    return@withProjectLock CommandResult.error("Entity not found")
                }
                CommandResult.success(
                    value = mapOf("deleted" to id.value.toString()),
                    references = listOf(ObjectRef(entityType, id))
                )
            }
        }
    }

    fun validateCommand(
        name: String = "${namePrefix}validate",
        group: String? = null,
        visibility: CommandVisibility = CommandVisibility.PUBLIC
    ): Command = object : Command(
        name,
        "Validate ${entityType.value}",
        group,
        readOnly = true,
        type = CommandType.SYSTEM,
        visibility = visibility
    ) {
        override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
            val model = createModel(params)
            val problem = validate(model)
            return if (problem == null) CommandResult.success(value = mapOf("valid" to true))
            else CommandResult.error(problem)
        }
    }

    /** Reads `params["id"]` as a UUID string; returns `null` when absent or malformed. */
    protected fun idOf(params: Any?): ObjectId? {
        return (params as? Map<*, *>)?.get("id")?.let { raw ->
            if (raw is String) ObjectId.fromString(raw) else null
        }
    }
}
