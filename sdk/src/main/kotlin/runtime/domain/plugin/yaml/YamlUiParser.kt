package runtime.domain.plugin.yaml

import org.yaml.snakeyaml.Yaml
import runtime.domain.plugin.UIDefinition

/**
 * Parses `ui/` files into [UIDefinition]s. Each top-level key is a
 * component type (Page, Navigation, Shortcut, Overlay, OverlayTrigger,
 * EventSubscription, App) whose value is the component config map — the same
 * shape as `context.registerUi(UiComponent(...))`.
 *
 * ```yaml
 * Page:
 *   id: tasks
 *   title: Tasks
 *   sections:
 *     - id: list
 *       layout: grid
 *       columns: 1
 *       components:
 *         - type: Table
 *           config:
 *             data:
 *               command: demo.list
 *               entityType: demo.task
 * ```
 *
 * Multiple files may declare the same component type (each yields one UIDefinition).
 */
object YamlUiParser {

    private val yaml = Yaml()

    fun parse(content: String): List<UIDefinition> {
        @Suppress("UNCHECKED_CAST")
        val root = yaml.load<Any>(content) as? Map<String, Any?>
            ?: throw IllegalArgumentException("UI YAML must be a mapping")
        return parse(root)
    }

    @Suppress("UNCHECKED_CAST")
    fun parse(root: Map<String, Any?>): List<UIDefinition> {
        val result = mutableListOf<UIDefinition>()
        for ((componentType, rawConfig) in root) {
            when (rawConfig) {
                is Map<*, *> -> result += YamlUiDefinition(componentType, configMap(rawConfig))
                is List<*> -> {
                    // Multiple declarations of the same type: each list item is a config.
                    rawConfig.forEach { item ->
                        if (item is Map<*, *>) {
                            result += YamlUiDefinition(componentType, configMap(item))
                        }
                    }
                }
                else -> throw IllegalArgumentException("UI '$componentType' must be a mapping or list of mappings")
            }
        }
        return result
    }

    /** Coerces SnakeYAML values (Map<Any,Any>, List<Any>) to Map<String,Any>/List<Any>. */
    @Suppress("UNCHECKED_CAST")
    private fun coerce(value: Any?): Any? = when (value) {
        is Map<*, *> -> value.entries.associate { it.key.toString() to coerce(it.value) }
        is List<*> -> value.map { coerce(it) }
        else -> value
    }

    @Suppress("UNCHECKED_CAST")
    private fun configMap(value: Any?): Map<String, Any> {
        return coerce(value) as? Map<String, Any>
            ?: throw IllegalArgumentException("UI config must be a mapping")
    }

    private class YamlUiDefinition(
        override val componentType: String,
        override val config: Map<String, Any>
    ) : UIDefinition
}
