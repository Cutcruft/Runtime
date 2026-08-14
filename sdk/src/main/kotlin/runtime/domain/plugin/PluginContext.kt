package runtime.domain.plugin

import runtime.domain.command.Command
import runtime.domain.entity.EntityDefinition

interface PluginContext {
    fun registerEntity(definition: EntityDefinition)

    fun registerCommand(command: Command)

    fun registerUi(ui: UIDefinition)
}
