package runtime.infrastructure.plugin

import java.io.File
import java.net.URLClassLoader
import runtime.RuntimeMode
import runtime.domain.models.PluginDependency
import runtime.domain.models.PluginDescriptor
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginVersion

class PluginLoader(
    private val pluginDirectories: List<String>,
    private val descriptorLoader: PluginDescriptorLoader
) {
    private val loadedClassLoaders = mutableListOf<ClassLoader>()

    /** Class loaders created by [loadClass]; kept for callers that need class identity. */
    fun loadedClassLoaders(): List<ClassLoader> = loadedClassLoaders.toList()

    fun discover(): List<PluginDescriptor> {
        return if (RuntimeMode.isNative) discoverClasspath() else discoverFilesystem()
    }

    /**
     * JVM mode: scan plugin directories on the filesystem for JARs with config.yaml.
     */
    private fun discoverFilesystem(): List<PluginDescriptor> {
        val descriptors = mutableListOf<PluginDescriptor>()
        for (dir in pluginDirectories) {
            val pluginDir = File(dir)
            if (!pluginDir.exists() || !pluginDir.isDirectory) continue
            pluginDir.listFiles { file -> file.isDirectory }?.forEach { subDir ->
                try {
                    descriptors.add(descriptorLoader.load(subDir.absolutePath))
                    println("[PluginLoader] discovered ${subDir.name}")
                } catch (e: Exception) {
                    println("[PluginLoader] skip ${subDir.name}: ${e.message}")
                }
            }
        }
        return descriptors
    }

    /**
     * Native mode: discover plugins embedded in the classpath. Plugin resources are
     * packaged at build time under `plugins/<id>/` with config.yaml, JARs, and YAML resources.
     */
    private fun discoverClasspath(): List<PluginDescriptor> {
        val descriptors = mutableListOf<PluginDescriptor>()
        val classLoader = javaClass.classLoader

        // Scan for plugin descriptors on the classpath.
        // In native mode, plugins are embedded under plugins/<id>/ with config.yaml.
        val pluginIds = findEmbeddedPluginIds(classLoader)
        for (id in pluginIds) {
            try {
                val descriptor = loadClasspathDescriptor(id, classLoader)
                descriptors.add(descriptor)
                println("[PluginLoader] discovered (native) $id")
            } catch (e: Exception) {
                println("[PluginLoader] skip (native) $id: ${e.message}")
            }
        }
        return descriptors
    }

    private fun findEmbeddedPluginIds(classLoader: ClassLoader): List<String> {
        val ids = mutableListOf<String>()
        // Try scanning the plugins/ resource directory
        val pluginRootUrl = classLoader.getResource("plugins")
        if (pluginRootUrl != null) {
            val protocol = pluginRootUrl.protocol
            if (protocol == "file") {
                val dir = File(pluginRootUrl.toURI())
                dir.listFiles { f -> f.isDirectory }?.forEach { subDir ->
                    val configFile = File(subDir, descriptorLoader.configFileName)
                    if (configFile.exists()) ids.add(subDir.name)
                }
            } else if (protocol == "jar") {
                // For JAR-in-native-image, parse the jar URL
                val jarPath = pluginRootUrl.path.substringBefore("!").removePrefix("file:")
                val jar = java.util.jar.JarFile(File(jarPath))
                jar.entries().asSequence()
                    .filter { it.name.startsWith("plugins/") && it.isDirectory }
                    .map { it.name.removePrefix("plugins/").trimEnd('/').substringBefore('/') }
                    .filter { it.isNotEmpty() }
                    .distinct()
                    .forEach { ids.add(it) }
            }
        }

        // Fallback: scan for known plugin descriptor resources (config.yaml pattern)
        if (ids.isEmpty()) {
            val resources = classLoader.getResources(descriptorLoader.configFileName)
            while (resources.hasMoreElements()) {
                val url = resources.nextElement()
                val path = url.path
                // Look for patterns like ...plugins/<id>/config.yaml
                val match = Regex("plugins/([^/]+)/${Regex.escape(descriptorLoader.configFileName)}").find(path)
                if (match != null) {
                    ids.add(match.groupValues[1])
                }
            }
        }

        return ids
    }

    private fun loadClasspathDescriptor(pluginId: String, classLoader: ClassLoader): PluginDescriptor {
        val stream = classLoader.getResourceAsStream("plugins/$pluginId/${descriptorLoader.configFileName}")
            ?: throw IllegalArgumentException("Plugin descriptor not found on classpath: plugins/$pluginId/${descriptorLoader.configFileName}")
        val content = stream.bufferedReader().readText()

        @Suppress("UNCHECKED_CAST")
        val yaml = org.yaml.snakeyaml.Yaml().load(content) as Map<String, Any>
        val id = yaml["id"] as? String ?: pluginId
        val version = yaml["version"] as? String ?: "1.0.0"
        val mainClass = yaml["mainClass"] as? String
        val apiVersion = (yaml["apiVersion"] as? Number)?.toInt() ?: 1
        @Suppress("UNCHECKED_CAST")
        val deps = (yaml["dependencies"] as? List<Map<String, Any>>)?.map { dep ->
            PluginDependency(
                PluginId(dep["plugin"] as String),
                dep["version"] as String
            )
        } ?: emptyList()

        return PluginDescriptor(
            id = PluginId(id),
            version = PluginVersion(version),
            mainClass = mainClass,
            apiVersion = apiVersion,
            dependencies = deps,
            jarPath = "classpath:plugins/$pluginId"
        )
    }

    fun loadClass(descriptor: PluginDescriptor, parent: ClassLoader): Class<*> {
        if (RuntimeMode.isNative) {
            return loadClassFromClasspath(descriptor, parent)
        }

        val jarFile = File(descriptor.jarPath)
        if (!jarFile.exists()) {
            throw IllegalArgumentException("Plugin JAR not found: ${descriptor.jarPath}")
        }
        val classLoader = PluginClassLoader(parent, listOf(jarFile.toURI().toURL()))
        loadedClassLoaders += classLoader
        return Class.forName(descriptor.mainClass, true, classLoader)
    }

    private fun loadClassFromClasspath(descriptor: PluginDescriptor, parent: ClassLoader): Class<*> {
        val mainClass = descriptor.mainClass
            ?: throw IllegalArgumentException("Plugin '${descriptor.id}' has no mainClass (native mode requires an explicit mainClass)")
        loadedClassLoaders += parent
        return Class.forName(mainClass, true, parent)
    }
}
