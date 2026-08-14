package runtime.infrastructure.plugin

import runtime.domain.command.Command
import runtime.domain.command.CommandRegistry
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityRegistry
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.UIDefinition

class PluginContextImpl(
    private val pluginId: PluginId,
    private val entityRegistry: EntityRegistry,
    private val commandRegistry: CommandRegistry,
    private val uiDefinitions: MutableList<UIDefinition>
) : PluginContext {

    override fun registerEntity(definition: EntityDefinition) {
        entityRegistry.register(definition)
    }

    override fun registerCommand(command: Command) {
        commandRegistry.register(pluginId, command)
    }

    override fun registerUi(ui: UIDefinition) {
        uiDefinitions.add(ui)
    }
}
