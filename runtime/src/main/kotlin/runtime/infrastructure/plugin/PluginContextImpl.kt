package runtime.infrastructure.plugin

import runtime.domain.command.Command
import runtime.domain.connector.DataSink
import runtime.domain.connector.DataSource
import runtime.domain.entity.EntityDefinition
import runtime.domain.plugin.FrontendComponentDefinition
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.UIDefinition
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry
import runtime.domain.repositories.InfrastructureRegistry

class PluginContextImpl(
    private val pluginId: PluginId,
    private val entityRegistry: EntityRegistry,
    private val commandRegistry: CommandRegistry,
    private val infrastructureRegistry: InfrastructureRegistry,
    private val onUiRegistered: (UIDefinition) -> Unit,
    private val onFrontendComponentRegistered: (FrontendComponentDefinition) -> Unit = {}
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

    override fun registerFrontendComponent(definition: FrontendComponentDefinition) {
        onFrontendComponentRegistered(definition)
    }

    override fun registerDataSource(source: DataSource) {
        infrastructureRegistry.registerSource(pluginId, source)
    }

    override fun registerDataSink(sink: DataSink) {
        infrastructureRegistry.registerSink(pluginId, sink)
    }
}
