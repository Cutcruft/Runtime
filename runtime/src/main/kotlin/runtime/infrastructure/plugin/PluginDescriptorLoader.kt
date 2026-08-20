package runtime.infrastructure.plugin

import java.io.File
import org.yaml.snakeyaml.Yaml
import runtime.domain.models.PluginDependency
import runtime.domain.models.PluginDescriptor
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginVersion

class PluginDescriptorLoader(
    private val configFileName: String = "config.yaml",
    private val defaultApiVersion: Int = 1
) {
    private val yaml = Yaml()

    fun load(pluginDir: String): PluginDescriptor {
        val configFile = File(pluginDir, configFileName)
        if (!configFile.exists()) {
            throw IllegalArgumentException("Plugin config file not found in $pluginDir")
        }
        val map = yaml.load(configFile.readText()) as Map<String, Any>
        val id = PluginId(map["id"] as String)
        val version = PluginVersion(map["version"] as String)
        val apiVersion = (map["apiVersion"] as? Number)?.toInt() ?: defaultApiVersion
        val mainClass = map["main"] as? String
        val deps = (map["dependencies"] as? List<Map<String, Any>>)?.map { dep ->
            PluginDependency(
                PluginId(dep["plugin"] as String),
                dep["version"] as String
            )
        } ?: emptyList()
        val jarPath = File(pluginDir, "${id}.jar").absolutePath
        if (!File(jarPath).exists()) {
            val jars = File(pluginDir).listFiles { f -> f.extension == "jar" }
            if (jars != null && jars.size == 1) {
                return PluginDescriptor(id, version, apiVersion, mainClass, deps, jars[0].absolutePath)
            }
            // YAML-only plugin (dev mode): use the directory itself as the "jar path"
            // so YamlResourceLoader can read from <dir>/yaml/.
            if (File(pluginDir, "yaml").isDirectory) {
                return PluginDescriptor(id, version, apiVersion, mainClass, deps, pluginDir)
            }
            throw IllegalArgumentException("Plugin JAR not found in $pluginDir")
        }
        return PluginDescriptor(id, version, apiVersion, mainClass, deps, jarPath)
    }
}
