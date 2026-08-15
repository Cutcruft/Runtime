package runtime.domain.models

import runtime.domain.plugin.PluginId

object CommandIds {
    fun fullId(pluginId: PluginId, commandName: String): String = "${pluginId.value}.$commandName"
}
