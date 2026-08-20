package runtime.domain.plugin.yaml

import java.io.File
import runtime.domain.plugin.PluginContext

/**
 * Result of loading a YAML-declared plugin: all definitions that were registered
 * into a [PluginContext] plus the discovered messages catalog.
 */
data class YamlPluginLoadResult(
    val entityCount: Int,
    val commandCount: Int,
    val uiCount: Int,
    val messages: Map<String, Map<String, String>>
)

/**
 * Loads a plugin that is declared entirely (or partially) with YAML resources.
 *
 * Directory layout:
 * ```
 * plugin/
 * ├── plugin.yaml              # id, version, apiVersion, main?, dependencies?
 * ├── entities/          # declarative entity schemas (+ auto-CRUD)
 * ├── commands/          # script/sql/rest commands
 * ├── ui/                # pages, navigation, overlays, shortcuts, subscriptions
 * ├── messages/          # i18n catalogs
 * ├── scripts/            # logical scripts referenced by commands
 * └── sql/                # analytical queries referenced by commands
 * ```
 *
 * The loader registers everything through the standard [PluginContext], so a
 * YAML plugin coexists with a Kotlin [runtime.domain.plugin.Plugin] that calls
 * the same registration APIs. `plugin.yaml` may still point to a Kotlin `main`
 * class that performs additional registration.
 */
class YamlPluginLoader(
    private val resourceResolver: (String) -> String? = { null }
) {

    /**
     * Loads all YAML definitions from [dir]. When [pluginContext] is non-null,
     * registers entities/commands/UI into it and returns the load result.
     */
    fun load(dir: File, pluginContext: PluginContext? = null): YamlPluginLoadResult {
        if (!dir.isDirectory) {
            throw IllegalArgumentException("Plugin directory not found: $dir")
        }

        var entityCount = 0
        var commandCount = 0
        var uiCount = 0
        val messages = LinkedHashMap<String, Map<String, String>>()

        // Entities
        for (file in listYaml(dir, "entities")) {
            val entity = YamlEntityParser.parse(file.readText())
            if (pluginContext != null) {
                pluginContext.registerEntity(entity)
            }
            entityCount++
            // Auto-CRUD for the schema entity
            YamlCommandParser.crudFactory?.let { factory ->
                val crud = factory.invoke(entity.type, entity.type.value.substringAfter('.'), null)
                if (pluginContext != null) {
                    crud.forEach { pluginContext.registerCommand(it) }
                    commandCount += crud.size
                }
            }
        }

        // Commands
        for (file in listYaml(dir, "commands")) {
            val commands = YamlCommandParser.parse(file.readText(), dir.name, resourceResolver)
            if (pluginContext != null) {
                commands.forEach { pluginContext.registerCommand(it) }
                commandCount += commands.size
            }
        }

        // UI
        for (file in listYaml(dir, "ui")) {
            val ui = YamlUiParser.parse(file.readText())
            if (pluginContext != null) {
                ui.forEach { pluginContext.registerUi(it) }
                uiCount += ui.size
            }
        }

        // Messages
        for (file in listYaml(dir, "messages")) {
            val catalog = YamlMessagesParser.parse(file.readText())
            catalog.forEach { (locale, msgs) ->
                messages[locale] = (messages[locale] ?: emptyMap()) + msgs
            }
        }

        return YamlPluginLoadResult(
            entityCount = entityCount,
            commandCount = commandCount,
            uiCount = uiCount,
            messages = messages
        )
    }

    private fun listYaml(dir: File, subdir: String): List<File> {
        val directory = File(dir, subdir)
        if (!directory.isDirectory) return emptyList()
        return directory.listFiles { f -> f.isFile && f.extension.lowercase() in setOf("yaml", "yml") }
            ?.sortedBy { it.name } ?: emptyList()
    }
}
