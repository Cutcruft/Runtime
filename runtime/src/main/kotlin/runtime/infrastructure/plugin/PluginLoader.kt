package runtime.infrastructure.plugin

import java.io.File
import java.net.URLClassLoader
import runtime.domain.models.PluginDescriptor

class PluginLoader(
    private val pluginDirectories: List<String>,
    private val descriptorLoader: PluginDescriptorLoader
) {
    private val loadedClassLoaders = mutableListOf<ClassLoader>()

    /** Class loaders created by [loadClass]; kept for callers that need class identity. */
    fun loadedClassLoaders(): List<ClassLoader> = loadedClassLoaders.toList()

    fun discover(): List<PluginDescriptor> {
        val descriptors = mutableListOf<PluginDescriptor>()
        for (dir in pluginDirectories) {
            val pluginDir = File(dir)
            if (!pluginDir.exists() || !pluginDir.isDirectory) continue
            pluginDir.listFiles { file -> file.isDirectory }?.forEach { subDir ->
                try {
                    descriptors.add(descriptorLoader.load(subDir.absolutePath))
                } catch (e: Exception) {
                    // Skip invalid plugins during discovery
                }
            }
        }
        return descriptors
    }

    fun loadClass(descriptor: PluginDescriptor, parent: ClassLoader): Class<*> {
        val jarFile = File(descriptor.jarPath)
        if (!jarFile.exists()) {
            throw IllegalArgumentException("Plugin JAR not found: ${descriptor.jarPath}")
        }
        val classLoader = PluginClassLoader(parent, listOf(jarFile.toURI().toURL()))
        loadedClassLoaders += classLoader
        return Class.forName(descriptor.mainClass, true, classLoader)
    }
}
