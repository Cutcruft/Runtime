package runtime.domain.plugin

import runtime.domain.command.Command
import runtime.domain.connector.DataSink
import runtime.domain.connector.DataSource
import runtime.domain.entity.EntityDefinition

interface PluginContext {
    fun registerEntity(definition: EntityDefinition)

    fun registerCommand(command: Command)

    fun registerUi(ui: UIDefinition)

    fun registerDataSource(source: DataSource)

    fun registerDataSink(sink: DataSink)
}
