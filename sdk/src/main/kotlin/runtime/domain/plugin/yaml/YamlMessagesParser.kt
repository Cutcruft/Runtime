package runtime.domain.plugin.yaml

import org.yaml.snakeyaml.Yaml

/**
 * Parses `messages/` files into a locale → (key → text) catalog.
 *
 * Two accepted shapes:
 * ```yaml
 * locale: ru              # single-locale file
 * messages:
 *   demo.task.title: Задача
 * ```
 * or a flat locale-keyed map:
 * ```yaml
 * ru:
 *   demo.task.title: Задача
 * en:
 *   demo.task.title: Task
 * ```
 */
object YamlMessagesParser {

    private val yaml = Yaml()

    fun parse(content: String): Map<String, Map<String, String>> {
        @Suppress("UNCHECKED_CAST")
        val root = yaml.load<Any>(content) as? Map<String, Any?>
            ?: throw IllegalArgumentException("Messages YAML must be a mapping")
        val result = LinkedHashMap<String, Map<String, String>>()

        // Shape 1: single-locale { locale, messages }
        val locale = root["locale"] as? String
        val messages = root["messages"] as? Map<*, *>
        if (locale != null && messages != null) {
            result[locale] = stringMap(messages)
            return result
        }

        // Shape 2: locale → key → text
        for ((loc, raw) in root) {
            val map = raw as? Map<*, *> ?: continue
            result[loc] = stringMap(map)
        }
        return result
    }

    private fun stringMap(map: Map<*, *>): Map<String, String> {
        return map.entries.associate { it.key.toString() to (it.value?.toString() ?: "") }
    }
}
