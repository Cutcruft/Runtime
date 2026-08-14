package runtime.infrastructure.configuration

import org.yaml.snakeyaml.Yaml
import java.io.File

class ConfigLoader {
    private val yaml = Yaml()

    fun load(configPath: String): RuntimeConfig {
        val file = File(configPath)
        if (!file.exists()) return RuntimeConfig()

        val map = yaml.load(file.readText()) as? Map<String, Any> ?: return RuntimeConfig()

        val server = map["server"] as? Map<String, Any>
        val host = server?.get("host") as? String
        val port = (server?.get("port") as? Number)?.toInt()

        val directories = (map["plugins"] as? Map<String, Any>)?.get("directories") as? List<*>
        val dirs = directories?.filterIsInstance<String>() ?: emptyList()

        return RuntimeConfig(
            pluginDirectories = dirs,
            host = host ?: "0.0.0.0",
            port = port ?: 8080
        )
    }
}
