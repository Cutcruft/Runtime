package runtime.domain.models

import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginVersion

data class PluginDescriptor(
    val id: PluginId,
    val version: PluginVersion,
    val apiVersion: Int,
    val mainClass: String,
    val dependencies: List<PluginDependency> = emptyList(),
    val jarPath: String
)

data class PluginDependency(
    val pluginId: PluginId,
    val versionConstraint: String
)
