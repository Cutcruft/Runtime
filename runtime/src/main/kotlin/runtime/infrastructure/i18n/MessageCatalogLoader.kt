package runtime.infrastructure.i18n

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.io.File
import java.util.jar.JarFile

import runtime.RuntimeMode

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
        // Native mode: load from classpath resources
        if (RuntimeMode.isNative || jarPath.startsWith("classpath:")) {
            return loadFromClasspathPlugin(pluginId)
        }

        val jarFile = File(jarPath)
        if (!jarFile.exists()) return emptyMap()
        val result = mutableMapOf<String, Map<String, String>>()
        if (jarFile.isDirectory) {
            // Unpacked plugin directory (dev mode): read messages/<locale>.json from disk.
            val messagesDir = File(jarFile, "messages")
            messagesDir.listFiles { f -> f.isFile && f.name.endsWith(".json") }.orEmpty().forEach { file ->
                val locale = file.name.removeSuffix(".json")
                if (localeRegex.matches(locale)) {
                    runCatching { result[locale] = flatten(parse(file.readText()), prefix = pluginId) }
                }
            }
            return result
        }
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

    /**
     * Discovers every `messages/<locale>.json` catalog shipped by the runtime itself
     * (its own classes dir or JAR — i.e. the code source of this class), namespacing
     * keys with [prefix]. Scans only the runtime's own resources so catalogs bundled
     * in dependency/plugin JARs (e.g. the demo plugin) never pollute core keys.
     */
    fun loadFromClasspathAll(prefix: String): Map<String, Map<String, String>> {
        val result = mutableMapOf<String, Map<String, String>>()
        val codeSource = javaClass.protectionDomain.codeSource?.location ?: return result
        when (codeSource.protocol) {
            "file" -> {
                val location = runCatching { File(codeSource.toURI()) }.getOrNull() ?: return result
                if (location.isDirectory) {
                    File(location, "messages")
                        .listFiles { file -> file.isFile && file.name.endsWith(".json") }
                        .orEmpty()
                        .forEach { file ->
                            val locale = file.name.removeSuffix(".json")
                            if (localeRegex.matches(locale)) {
                                runCatching { result[locale] = flatten(parse(file.readText()), prefix) }
                            }
                        }
                } else if (location.name.endsWith(".jar")) {
                    loadMessagesFromJarPath(location.absolutePath, prefix, result)
                }
            }
        }
        return result
    }

    private fun loadMessagesFromJarPath(
        jarPath: String,
        prefix: String,
        result: MutableMap<String, Map<String, String>>
    ) {
        JarFile(jarPath).use { jar ->
            jar.entries().asSequence().forEach { entry ->
                if (entry.isDirectory) return@forEach
                val name = entry.name
                if (!name.startsWith("messages/") || !name.endsWith(".json")) return@forEach
                val locale = name.removePrefix("messages/").removeSuffix(".json")
                if (!localeRegex.matches(locale)) return@forEach
                runCatching {
                    val text = jar.getInputStream(entry).use { it.readBytes().toString(Charsets.UTF_8) }
                    result[locale] = flatten(parse(text), prefix = prefix)
                }
            }
        }
    }

    /**
     * Native mode: loads message catalogs from classpath resources for a plugin.
     * Plugin resources are embedded under `plugins/<pluginId>/messages/<locale>.json`.
     */
    private fun loadFromClasspathPlugin(pluginId: String): Map<String, Map<String, String>> {
        val result = mutableMapOf<String, Map<String, String>>()
        val classLoader = javaClass.classLoader
        val locales = listOf("en", "ru") // Known locales — extend as needed
        for (locale in locales) {
            val stream = classLoader.getResourceAsStream("plugins/$pluginId/messages/$locale.json") ?: continue
            runCatching {
                val text = stream.use { it.readBytes().toString(Charsets.UTF_8) }
                result[locale] = flatten(parse(text), prefix = pluginId)
            }
        }
        return result
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