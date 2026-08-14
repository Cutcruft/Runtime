package runtime.infrastructure.plugin

import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginVersion
import org.yaml.snakeyaml.Yaml
import java.io.File
import java.net.URL

class PluginDescriptorLoader {
    private val yaml = Yaml()

    fun load(pluginDir: String): PluginDescriptor {
        val configFile = File(pluginDir, "config.yaml")
        if (!configFile.exists()) {
            throw IllegalArgumentException("Plugin config.yaml not found in $pluginDir")
        }
        val map = yaml.load(configFile.readText()) as Map<String, Any>
        val id = PluginId(map["id"] as String)
        val version = PluginVersion(map["version"] as String)
        val apiVersion = (map["apiVersion"] as Number).toInt()
        val mainClass = map["main"] as String
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
            throw IllegalArgumentException("Plugin JAR not found in $pluginDir")
        }
        return PluginDescriptor(id, version, apiVersion, mainClass, deps, jarPath)
    }
}
