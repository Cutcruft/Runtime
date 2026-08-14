package runtime.domain.plugin

import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginVersion

data class PluginInfo(
    val id: PluginId,
    val version: PluginVersion,
    val apiVersion: Int
)
