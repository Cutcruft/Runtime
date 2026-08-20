package runtime.infrastructure.plugin

import java.io.File
import java.util.jar.JarFile
import runtime.domain.plugin.yaml.YamlPluginLoader

/**
 * Loads YAML-declared plugin definitions (entities/commands/ui/messages) from a
 * plugin JAR's `yaml/` resource directory. YAML plugins register through the same
 * [runtime.domain.plugin.PluginContext] as Kotlin plugins, so both styles coexist.
 *
 * Layout inside the JAR:
 * ```
 * yaml/
 * ├── plugin.yaml
 * ├── entities/YAML
 * ├── commands/YAML
 * ├── ui/YAML
 * ├── messages/YAML
 * ├── scripts/KTS
 * └── sql/SQL
 * ```
 */
class YamlResourceLoader {

    private val loader = YamlPluginLoader(resourceResolver = { path ->
        // Resolved by the caller-provided classloader at bootstrap time; this default
        // returns null (callers override via the classloader-aware resolver).
        null
    })

    /**
     * Returns the YAML resource paths contained in [jarPath] under the `yaml/` prefix.
     * Works for both a JAR file and an unpacked plugin directory.
     */
    fun listYamlEntries(jarPath: String): List<String> {
        val file = File(jarPath)
        if (file.isDirectory) return listYamlEntriesFromDir(jarPath)
        return runCatching {
            JarFile(jarPath).use { jar ->
                jar.entries().asSequence()
                    .map { it.name }
                    .filter { it.startsWith("yaml/") }
                    .filterNot { it.endsWith("/") }
                    .filter { it.endsWith(".yaml") || it.endsWith(".yml") }
                    .sorted()
                    .toList()
            }
        }.getOrDefault(emptyList())
    }

    /**
     * Reads a YAML entry (or a referenced script/SQL file) from [jarPath].
     * Returns the file content or `null` when missing. Works for JAR and directory.
     */
    fun readEntry(jarPath: String, name: String): String? {
        if (File(jarPath).isDirectory) return readEntryFromDir(jarPath, name)
        val entry = if (name.startsWith("yaml/")) name else "yaml/$name"
        return runCatching {
            JarFile(jarPath).use { jar ->
                val e = jar.getJarEntry(entry) ?: return@use null
                jar.getInputStream(e).bufferedReader().use { it.readText() }
            }
        }.getOrNull()
    }

    /**
     * Lists YAML entries under the `yaml/` subdirectory of a plain directory
     * (dev-mode convenience so a YAML plugin need not be packaged as a JAR).
     */
    fun listYamlEntriesFromDir(dir: String): List<String> {
        val yamlDir = File(dir, "yaml")
        if (!yamlDir.isDirectory) return emptyList()
        return yamlDir.walkTopDown()
            .filter { it.isFile && (it.extension.lowercase() in setOf("yaml", "yml")) }
            .map { it.relativeTo(yamlDir).path.replace(File.separatorChar, '/') }
            .sorted()
            .toList()
    }

    /** Reads a file under the `yaml/` subdirectory of [dir]. */
    fun readEntryFromDir(dir: String, name: String): String? {
        val relative = if (name.startsWith("yaml/")) name.removePrefix("yaml/") else name
        val file = File(File(dir, "yaml"), relative)
        if (!file.isFile) return null
        return runCatching { file.readText() }.getOrNull()
    }
}
