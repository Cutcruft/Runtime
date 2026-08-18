package runtime.application.layer

import runtime.application.command.CommandContextImpl
import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandParameter
import runtime.domain.command.CommandResult
import runtime.domain.command.CommandType
import runtime.domain.models.Project

private fun CommandContext.requireProject(): Project =
    (this as? CommandContextImpl)?.project
        ?: throw IllegalStateException("Command context is not bound to a project")

class LayerShowCommand(
    private val layerService: LayerService
) : Command(
    "show",
    "Show a UI layer",
    type = CommandType.SYSTEM,
    parameters = listOf(
        CommandParameter("pageId", "string", required = true, description = "Page id"),
        CommandParameter("layerId", "string", required = true, description = "Layer id")
    )
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val map = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val pageId = map["pageId"] as? String ?: return CommandResult.error("Missing pageId")
        val layerId = map["layerId"] as? String ?: return CommandResult.error("Missing layerId")
        val project = context.requireProject()
        layerService.setVisible(project.id, layerId, true)
        return CommandResult.success(mapOf("pageId" to pageId, "layerId" to layerId, "visible" to true))
    }
}

class LayerHideCommand(
    private val layerService: LayerService
) : Command(
    "hide",
    "Hide a UI layer",
    type = CommandType.SYSTEM,
    parameters = listOf(
        CommandParameter("pageId", "string", required = true, description = "Page id"),
        CommandParameter("layerId", "string", required = true, description = "Layer id")
    )
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val map = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val pageId = map["pageId"] as? String ?: return CommandResult.error("Missing pageId")
        val layerId = map["layerId"] as? String ?: return CommandResult.error("Missing layerId")
        val project = context.requireProject()
        layerService.setVisible(project.id, layerId, false)
        return CommandResult.success(mapOf("pageId" to pageId, "layerId" to layerId, "visible" to false))
    }
}

class LayerToggleCommand(
    private val layerService: LayerService
) : Command(
    "toggle",
    "Toggle a UI layer visibility",
    type = CommandType.SYSTEM,
    parameters = listOf(
        CommandParameter("pageId", "string", required = true, description = "Page id"),
        CommandParameter("layerId", "string", required = true, description = "Layer id")
    )
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val map = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val pageId = map["pageId"] as? String ?: return CommandResult.error("Missing pageId")
        val layerId = map["layerId"] as? String ?: return CommandResult.error("Missing layerId")
        val project = context.requireProject()
        val visible = layerService.toggle(project.id, layerId)
        return CommandResult.success(mapOf("pageId" to pageId, "layerId" to layerId, "visible" to visible))
    }
}
