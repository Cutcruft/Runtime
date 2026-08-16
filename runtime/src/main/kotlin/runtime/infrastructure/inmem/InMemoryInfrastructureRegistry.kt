package runtime.infrastructure.inmem

import java.util.concurrent.ConcurrentHashMap
import runtime.domain.connector.DataSink
import runtime.domain.connector.DataSource
import runtime.domain.models.CommandIds
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.InfrastructureRegistry

class InMemoryInfrastructureRegistry : InfrastructureRegistry {
    private val sources = ConcurrentHashMap<String, DataSource>()
    private val sinks = ConcurrentHashMap<String, DataSink>()

    override fun registerSource(pluginId: PluginId, source: DataSource) {
        val id = CommandIds.fullId(pluginId, source.id)
        require(!sources.containsKey(id)) { "Data source $id already registered" }
        sources[id] = source
    }

    override fun registerSink(pluginId: PluginId, sink: DataSink) {
        val id = CommandIds.fullId(pluginId, sink.id)
        require(!sinks.containsKey(id)) { "Data sink $id already registered" }
        sinks[id] = sink
    }

    override fun getSource(id: String): DataSource? = sources[id]

    override fun getSink(id: String): DataSink? = sinks[id]

    override fun sources(): Map<String, DataSource> = sources.toMap()

    override fun sinks(): Map<String, DataSink> = sinks.toMap()
}
