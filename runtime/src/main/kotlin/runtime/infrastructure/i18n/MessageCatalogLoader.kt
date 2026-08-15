package runtime.infrastructure.i18n

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.io.File
import java.util.jar.JarFile

/**
 * Loads message catalogs from a plugin JAR.
 *
 * Convention: a plugin ships translations as JSON files at `messages/<lang>.json`
 * inside its JAR resources (e.g. `messages/en.json`, `messages/ru.json`).
 * Keys are namespaced with the plugin id on load.
 */
class MessageCatalogLoader {

    private val objectMapper = ObjectMapper().registerModule(KotlinModule.Builder().build())

    private val localeRegex = Regex("""^[a-z]{2,3}(-[A-Z]{2,3})?$""")

    /** Loads all `messages` JSON catalogs from [jarPath], namespacing keys with [pluginId]. */
    fun loadFromJar(pluginId: String, jarPath: String): Map<String, Map<String, String>> {
        val jarFile = File(jarPath)
        if (!jarFile.exists()) return emptyMap()
        val result = mutableMapOf<String, Map<String, String>>()
        JarFile(jarFile).use { jar ->
            jar.entries().asSequence().forEach { entry ->
                if (entry.isDirectory) return@forEach
                val name = entry.name
                if (!name.startsWith("messages/") || !name.endsWith(".json")) return@forEach
                val locale = name.removePrefix("messages/").removeSuffix(".json")
                if (!localeRegex.matches(locale)) return@forEach
                runCatching {
                    val text = jar.getInputStream(entry).use { it.readBytes().toString(Charsets.UTF_8) }
                    result[locale] = flatten(parse(text), prefix = pluginId)
                }.onFailure { /* skip invalid catalog */ }
            }
        }
        return result
    }

    /** Loads a single catalog resource from the runtime classpath (core messages), namespaced with [prefix]. */
    fun loadFromClasspath(prefix: String, resourcePath: String): Map<String, Map<String, String>> {
        val stream = javaClass.getResourceAsStream(resourcePath) ?: return emptyMap()
        return runCatching {
            val text = stream.use { it.readBytes().toString(Charsets.UTF_8) }
            val normalized = resourcePath.removePrefix("/").removeSuffix("/")
            val locale = normalized.removePrefix("messages/").removeSuffix(".json")
            mapOf(locale to flatten(parse(text), prefix = prefix))
        }.getOrElse { emptyMap() }
    }

    @Suppress("UNCHECKED_CAST")
    private fun parse(text: String): Map<String, Any> =
        (objectMapper.readValue(text, Map::class.java) as? Map<String, Any>) ?: emptyMap()

    /** Flattens nested maps into dotted keys (e.g. `nested: {a: x}` -> `demo.nested.a`). */
    private fun flatten(entries: Map<String, Any>, prefix: String): Map<String, String> {
        val result = mutableMapOf<String, String>()
        fun visit(current: Map<String, Any>, base: String) {
            current.forEach { (key, value) ->
                val fullKey = if (base.isEmpty()) key else "$base.$key"
                if (value is Map<*, *>) {
                    @Suppress("UNCHECKED_CAST")
                    visit(value as Map<String, Any>, fullKey)
                } else {
                    result[fullKey] = value.toString()
                }
            }
        }
        visit(entries, prefix)
        return result
    }
}