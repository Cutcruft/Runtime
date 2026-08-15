package runtime.infrastructure.configuration

import java.io.File
import org.yaml.snakeyaml.Yaml
import runtime.domain.models.AppConfig
import runtime.domain.models.AppFields
import runtime.domain.models.AuditConfig
import runtime.domain.models.CommandConfig
import runtime.domain.models.HttpConfig
import runtime.domain.models.NavigationFields
import runtime.domain.models.PageFields
import runtime.domain.models.PluginsConfig
import runtime.domain.models.RuntimeConfig
import runtime.domain.models.ServerConfig
import runtime.domain.models.ThemeConfig
import runtime.domain.models.UiConfig
import runtime.domain.models.WsConfig

class ConfigLoader(
    private val bundledResource: String = "/application.yaml"
) {
    private val yaml = Yaml()

    fun load(configPath: String?): RuntimeConfig {
        val defaults = loadBundled()
        val external = configPath?.let { loadFile(it) } ?: emptyMap()
        val merged = mergeDeep(defaults, external)
        return toConfig(merged)
    }

    private fun loadBundled(): Map<String, Any> {
        val stream = javaClass.getResourceAsStream(bundledResource) ?: return emptyMap()
        return stream.use { yaml.load(it) as? Map<String, Any> } ?: emptyMap()
    }

    private fun loadFile(path: String): Map<String, Any> {
        val file = File(path)
        if (!file.exists()) return emptyMap()
        return (yaml.load(file.readText()) as? Map<String, Any>) ?: emptyMap()
    }

    private fun toConfig(map: Map<String, Any>): RuntimeConfig {
        val server = section(map, "server")
        val http = section(map, "http")
        val ws = section(map, "ws")
        val plugins = section(map, "plugins")
        val command = section(map, "command")
        val audit = section(map, "audit")
        val ui = section(map, "ui")
        return RuntimeConfig(
            server = ServerConfig(
                host = server["host"] as String,
                port = (server["port"] as Number).toInt()
            ),
            http = HttpConfig(
                configPath = http["configPath"] as String,
                staticRoot = http["staticRoot"] as String
            ),
            ws = WsConfig(path = ws["path"] as String),
            plugins = PluginsConfig(
                directories = (plugins["directories"] as List<*>).filterIsInstance<String>(),
                configFileName = plugins["configFileName"] as String,
                apiVersion = (plugins["apiVersion"] as Number).toInt()
            ),
            command = CommandConfig(
                executorThreads = (command["executorThreads"] as? Number)?.toInt()
            ),
            audit = AuditConfig(
                enabled = audit["enabled"] as Boolean,
                maxEventsPerProject = (audit["maxEventsPerProject"] as Number).toInt()
            ),
            ui = UiConfig(
                mainPlugin = ui["mainPlugin"] as? String,
                landingPage = ui["landingPage"] as? String,
                navigationComponentType = ui["navigationComponentType"] as String,
                pageComponentType = ui["pageComponentType"] as String,
                appComponentType = ui["appComponentType"] as String,
                shortcutComponentType = ui["shortcutComponentType"] as String,
                subscriptionComponentType = ui["subscriptionComponentType"] as String,
                app = AppConfig(
                    title = section(ui, "app")["title"] as String,
                    logo = section(ui, "app")["logo"] as? String,
                    layout = section(ui, "app")["layout"] as String
                ),
                navigationFields = NavigationFields(
                    id = section(ui, "navigationFields")["id"] as String,
                    label = section(ui, "navigationFields")["label"] as String,
                    pageId = section(ui, "navigationFields")["pageId"] as String,
                    order = section(ui, "navigationFields")["order"] as String
                ),
                pageFields = PageFields(
                    id = section(ui, "pageFields")["id"] as String,
                    title = section(ui, "pageFields")["title"] as String,
                    sections = section(ui, "pageFields")["sections"] as String
                ),
                appFields = AppFields(
                    title = section(ui, "appFields")["title"] as String,
                    logo = section(ui, "appFields")["logo"] as String,
                    layout = section(ui, "appFields")["layout"] as String
                ),
                theme = ThemeConfig(
                    mode = section(ui, "theme")["mode"] as String,
                    tokens = (section(ui, "theme")["tokens"] as? Map<*, *> ?: emptyMap<Any?, Any?>())
                        .entries.associate { it.key.toString() to it.value.toString() }
                )
            ),
            messages = section(map, "messages").mapValues { (_, value) -> value.toString() }
        )
    }

    @Suppress("UNCHECKED_CAST")
    private fun section(map: Map<String, Any>, key: String): Map<String, Any> =
        (map[key] as? Map<String, Any>) ?: emptyMap()

    @Suppress("UNCHECKED_CAST")
    private fun mergeDeep(base: Map<String, Any>, override: Map<String, Any>): Map<String, Any> {
        val result = LinkedHashMap<String, Any>(base)
        override.forEach { (key, value) ->
            val existing = result[key]
            result[key] = when {
                existing is Map<*, *> && value is Map<*, *> ->
                    mergeDeep(existing as Map<String, Any>, value as Map<String, Any>)
                else -> value
            }
        }
        return result
    }
}
