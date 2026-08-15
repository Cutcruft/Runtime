package runtime.infrastructure.plugin

import java.io.File
import java.nio.file.Files
import java.util.jar.JarEntry
import java.util.jar.JarOutputStream
import kotlin.test.assertContentEquals
import kotlin.test.assertEquals
import kotlin.test.assertNull
import org.junit.jupiter.api.Test
import runtime.domain.models.PluginDescriptor
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginVersion

class PluginAssetsServiceTest {

    private fun writeJar(dir: File, entries: Map<String, String>): String {
        val jarFile = File(dir, "assets.jar")
        JarOutputStream(jarFile.outputStream().buffered()).use { jar ->
            entries.forEach { (path, content) ->
                jar.putNextEntry(JarEntry(path))
                jar.write(content.toByteArray(Charsets.UTF_8))
                jar.closeEntry()
            }
        }
        return jarFile.absolutePath
    }

    private fun service(dir: File): PluginAssetsService {
        val jarPath = writeJar(
            dir,
            mapOf(
                "models/cube.glb" to "GLB-BINARY",
                "models/scene.gltf" to """{"asset":{"version":"2.0"}}""",
                "textures/albedo.png" to "PNG-BYTES",
                "samples/plain.txt" to "not allowed"
            )
        )
        val descriptor = PluginDescriptor(
            id = PluginId("demo"),
            version = PluginVersion("1.0.0"),
            apiVersion = 1,
            mainClass = "com.example.DemoPlugin",
            jarPath = jarPath
        )
        return PluginAssetsService(listOf(descriptor))
    }

    @Test
    fun `serves allowed asset types from jar`() {
        val service = service(Files.createTempDirectory("rt-assets").toFile())

        val gltf = service.resolve("demo", "models/scene.gltf")
        assertEquals("""{"asset":{"version":"2.0"}}""", gltf?.bytes?.toString(Charsets.UTF_8))

        val png = service.resolve("demo", "textures/albedo.png")
        assertContentEquals("PNG-BYTES".toByteArray(Charsets.UTF_8), png?.bytes)
    }

    @Test
    fun `rejects disallowed extension, traversal and unknown plugin`() {
        val service = service(Files.createTempDirectory("rt-assets").toFile())

        assertNull(service.resolve("demo", "samples/plain.txt"))
        assertNull(service.resolve("demo", "../runtime/pom.xml"))
        assertNull(service.resolve("demo", "models/../scene.gltf"))
        assertNull(service.resolve("missing", "models/cube.glb"))
        assertNull(service.resolve("demo", "not-there.glb"))
    }
}
