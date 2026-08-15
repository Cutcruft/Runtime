package runtime.infrastructure.plugin

import runtime.domain.command.Command
import runtime.domain.entity.EntityDefinition
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.UIDefinition
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry

class PluginContextImpl(
    private val pluginId: PluginId,
    private val entityRegistry: EntityRegistry,
    private val commandRegistry: CommandRegistry,
    private val onUiRegistered: (UIDefinition) -> Unit
) : PluginContext {

    override fun registerEntity(definition: EntityDefinition) {
        entityRegistry.register(definition)
    }

    override fun registerCommand(command: Command) {
        commandRegistry.register(pluginId, command)
    }

    override fun registerUi(ui: UIDefinition) {
        onUiRegistered(ui)
    }
}
