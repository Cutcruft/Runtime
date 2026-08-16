package com.example.demo

import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandParameter
import runtime.domain.command.CommandResult
import runtime.domain.command.LogicalScriptCommand
import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectId

internal val SCRIPT_TYPE = EntityType("demo.script")

/**
 * Runs a script stored as a `demo.script` entity.
 * Params: `{ scriptId: "..." }` (or a bare script id string).
 */
class RunScriptCommand : LogicalScriptCommand(
    name = "runscript",
    description = "Runs a Kotlin script stored in the project (demo.script entity)",
    scriptType = SCRIPT_TYPE,
    scriptIdParam = "scriptId",
    parameters = listOf(CommandParameter("scriptId", "uuid", required = true, description = "Id of the demo.script entity"))
)

/** Creates a `demo.script` entity: `{ name, code }`. */
class CreateScriptCommand : Command(
    name = "scriptcreate",
    description = "Creates a Kotlin script in the project",
    group = "Scripts",
    readOnly = false,
    parameters = listOf(
        CommandParameter("name", "string", required = true, description = "Script name"),
        CommandParameter("code", "string", required = true, description = "Kotlin source code")
    )
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val map = params as? Map<*, *> ?: return CommandResult.error("Expected params map")
        val name = map["name"]?.toString()?.takeIf { it.isNotBlank() }
            ?: return CommandResult.error("Missing 'name' parameter")
        val code = map["code"]?.toString()
            ?: return CommandResult.error("Missing 'code' parameter")
        context.validateScript(code)?.let { return CommandResult.error(it) }
        val scripts = context.objectList<Script>(SCRIPT_TYPE)
        val id = ObjectId.generate()
        scripts.create(id, Script(name = name, code = code))
        return CommandResult.success(
            mapOf("id" to id.toString(), "name" to name, "status" to "created")
        )
    }
}

/** Updates the `code` of a `demo.script` entity: `{ id, code }`. */
class UpdateScriptCommand : Command(
    name = "scriptupdate",
    description = "Updates the code of a Kotlin script in the project",
    group = "Scripts",
    readOnly = false,
    parameters = listOf(
        CommandParameter("id", "uuid", required = true, description = "Script id"),
        CommandParameter("code", "string", required = true, description = "New Kotlin source code")
    )
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val map = params as? Map<*, *> ?: return CommandResult.error("Expected params map")
        val id = parseId(map)
            ?: return CommandResult.error("Missing or invalid 'id' parameter")
        val code = map["code"]?.toString()
            ?: return CommandResult.error("Missing 'code' parameter")
        context.validateScript(code)?.let { return CommandResult.error(it) }
        val scripts = context.objectList<Script>(SCRIPT_TYPE)
        val existing = scripts.get(id)
            ?: return CommandResult.error("Script '$id' not found")
        scripts.update(id, existing.copy(code = code))
        return CommandResult.success(mapOf("id" to id.toString(), "name" to existing.name, "status" to "updated"))
    }
}

/** Deletes a `demo.script` entity: `{ id }`. */
class DeleteScriptCommand : Command(
    name = "scriptdelete",
    description = "Deletes a Kotlin script from the project",
    group = "Scripts",
    readOnly = false,
    parameters = listOf(CommandParameter("id", "uuid", required = true, description = "Script id"))
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val map = params as? Map<*, *> ?: return CommandResult.error("Expected params map")
        val id = parseId(map)
            ?: return CommandResult.error("Missing or invalid 'id' parameter")
        val removed = context.objectList<Script>(SCRIPT_TYPE).delete(id)
        if (!removed) return CommandResult.error("Script '$id' not found")
        return CommandResult.success(mapOf("id" to id.toString(), "status" to "deleted"))
    }
}

/** Lists `demo.script` entities: `{ name, code }` per row. */
class ListScriptsCommand : Command(
    name = "scriptlist",
    description = "Lists Kotlin scripts in the project",
    group = "Scripts",
    readOnly = true
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val scripts = context.objectList<Script>(SCRIPT_TYPE)
        val rows = scripts.list().map { ref ->
            val script = scripts.get(ref.objectId)
            mapOf(
                "id" to ref.objectId.toString(),
                "name" to (script?.name ?: ""),
                "code" to (script?.code ?: "")
            )
        }
        return CommandResult.success(rows)
    }
}

/** Trial-compiles script code without storing it: `{ code }`. */
class ValidateScriptCommand : Command(
    name = "scriptvalidate",
    description = "Trial-compiles script code and reports syntax errors",
    group = "Scripts",
    readOnly = true,
    parameters = listOf(CommandParameter("code", "string", required = true, description = "Kotlin source code to check"))
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val map = params as? Map<*, *> ?: return CommandResult.error("Expected params map")
        val code = map["code"]?.toString()
            ?: return CommandResult.error("Missing 'code' parameter")
        val error = context.validateScript(code)
        return if (error == null) {
            CommandResult.success(mapOf("valid" to true))
        } else {
            CommandResult.error(error)
        }
    }
}
