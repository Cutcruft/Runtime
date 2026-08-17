package runtime.infrastructure.plugin

import java.io.File
import java.util.jar.JarFile
import runtime.domain.models.PluginDescriptor

/**
 * Serves static resources (GLTF/GLB, textures, images) from plugin JARs.
 * Path is normalized and validated against an extension whitelist; no traversal is possible.
 */
class PluginAssetsService(
    descriptors: List<PluginDescriptor>,
    private val maxBytes: Long = 16L * 1024 * 1024
) {
    @Volatile
    private var byId = descriptors.associateBy { it.id.value }

    fun update(descriptors: List<PluginDescriptor>) {
        byId = descriptors.associateBy { it.id.value }
    }

    data class Asset(val name: String, val bytes: ByteArray)

    fun resolve(pluginId: String, rawPath: String): Asset? {
        val descriptor = byId[pluginId] ?: return null
        val path = normalize(rawPath) ?: return null
        if (!ALLOWED_EXTENSIONS.contains(path.substringAfterLast('.', "").lowercase())) return null
        val jar = File(descriptor.jarPath)
        if (!jar.isFile) return null
        return runCatching {
            JarFile(jar).use { jarFile ->
                val entry = jarFile.getEntry(path) ?: return null
                if (entry.isDirectory || entry.size > maxBytes) return null
                Asset(name = entry.name, bytes = jarFile.getInputStream(entry).readBytes())
            }
        }.getOrNull()
    }

    private fun normalize(rawPath: String): String? {
        var path = rawPath.trimStart('/')
        if (path.isEmpty()) return null
        if (path.contains('\u0000')) return null
        if (path.split('/').any { it.isEmpty() || it == "." || it == ".." }) return null
        return path
    }

    companion object {
        val ALLOWED_EXTENSIONS = setOf(
            "gltf", "glb", "bin", "json",
            "png", "jpg", "jpeg", "webp", "svg", "gif",
            "ktx2", "hdr", "tga"
        )
    }
}
