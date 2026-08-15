package runtime.infrastructure.configuration

import java.io.File
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test

class ConfigLoaderTest {

    @Test
    fun `load without external file returns bundled defaults`() {
        val config = ConfigLoader().load(null)
        assertEquals("0.0.0.0", config.server.host)
        assertEquals(8080, config.server.port)
        assertEquals("/ws", config.ws.path)
        assertEquals("/config", config.http.configPath)
        assertEquals("static", config.http.staticRoot)
        assertEquals("config.yaml", config.plugins.configFileName)
        assertEquals(1, config.plugins.apiVersion)
        assertTrue(config.audit.enabled)
        assertEquals(10000, config.audit.maxEventsPerProject)
        assertEquals("Missing commandId", config.messages["missingCommandId"])
        assertEquals("Create a new project", config.messages["description.create"])
    }

    @Test
    fun `external file overrides and merges with defaults`() {
        val file = File.createTempFile("runtime-config", ".yaml")
        try {
            file.writeText(
                """
                server:
                  port: 9090
                ws:
                  path: /realtime
                """.trimIndent()
            )
            val config = ConfigLoader().load(file.absolutePath)
            assertEquals("0.0.0.0", config.server.host)
            assertEquals(9090, config.server.port)
            assertEquals("/realtime", config.ws.path)
            assertEquals("/config", config.http.configPath)
        } finally {
            file.delete()
        }
    }

    @Test
    fun `missing external file falls back to defaults`() {
        val config = ConfigLoader().load("/nonexistent/config.yaml")
        assertEquals(8080, config.server.port)
        assertEquals("0.0.0.0", config.server.host)
    }
}
