package runtime.domain.repositories

import runtime.domain.connector.DataSink
import runtime.domain.connector.DataSource
import runtime.domain.plugin.PluginId

/** Registry of external connectors (data sources/sinks) declared by plugins. */
interface InfrastructureRegistry {
    fun registerSource(pluginId: PluginId, source: DataSource)

    fun registerSink(pluginId: PluginId, sink: DataSink)

    fun getSource(id: String): DataSource?

    fun getSink(id: String): DataSink?

    fun sources(): Map<String, DataSource>

    fun sinks(): Map<String, DataSink>
}
