package runtime.infrastructure.i18n

import java.io.File
import java.nio.file.Files
import java.util.jar.JarEntry
import java.util.jar.JarOutputStream
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.application.i18n.MessageRegistry

class MessageCatalogLoaderTest {

    private fun writeJarWithMessages(dir: File, entries: Map<String, String>): String {
        val jarFile = File(dir, "catalog.jar")
        JarOutputStream(jarFile.outputStream().buffered()).use { jar ->
            entries.forEach { (path, content) ->
                jar.putNextEntry(JarEntry(path))
                jar.write(content.toByteArray(Charsets.UTF_8))
                jar.closeEntry()
            }
        }
        return jarFile.absolutePath
    }

    @Test
    fun `loads and namespaces catalogs from plugin jar`() {
        val dir = Files.createTempDirectory("rt-catalog").toFile()
        val jarPath = writeJarWithMessages(
            dir,
            mapOf(
                "messages/en.json" to """{"hello": "Hi", "nested": {"a": "x"}}""",
                "messages/ru.json" to """{"hello": "Привет"}""",
                "messages/ignore.txt" to """not a catalog""",
                "META-INF/MANIFEST.MF" to """Manifest-Version: 1.0"""
            )
        )

        val loader = MessageCatalogLoader()
        val catalogs = loader.loadFromJar("demo", jarPath)

        assertEquals(setOf("en", "ru"), catalogs.keys)
        assertEquals("Hi", catalogs["en"]?.get("demo.hello"))
        assertEquals("Привет", catalogs["ru"]?.get("demo.hello"))
        assertEquals("x", catalogs["en"]?.get("demo.nested.a"))
        // non-JSON / non-messages entries are ignored
        assertTrue(catalogs["en"]?.get("demo.ignore") == null)
    }

    @Test
    fun `registry aggregates locales and exposes default locale`() {
        val registry = MessageRegistry(defaultLocale = "en")
        registry.register("en", mapOf("demo.hello" to "Hi"))
        registry.register("ru", mapOf("demo.hello" to "Привет"))

        assertEquals("en", registry.defaultLocale)
        assertEquals(listOf("en", "ru"), registry.locales())
        assertEquals("Hi", registry.messages()["en"]?.get("demo.hello"))
    }

    @Test
    fun `loads core catalog from runtime classpath`() {
        val loader = MessageCatalogLoader()
        val catalogs = loader.loadFromClasspath("core", "/messages/en.json")

        assertEquals(setOf("en"), catalogs.keys)
        assertEquals("Search", catalogs["en"]?.get("core.table.search"))
    }

    @Test
    fun `discovers all core catalogs from classpath`() {
        val loader = MessageCatalogLoader()
        val catalogs = loader.loadFromClasspathAll("core")

        assertTrue(catalogs.containsKey("en"), "expected 'en' catalog on classpath")
        assertTrue(catalogs.containsKey("ru"), "expected 'ru' catalog on classpath")
        assertEquals("Search", catalogs["en"]?.get("core.table.search"))
        assertEquals("Поиск", catalogs["ru"]?.get("core.table.search"))
        assertTrue(catalogs.values.all { it.keys.all { key -> key.startsWith("core.") } })
    }
}
