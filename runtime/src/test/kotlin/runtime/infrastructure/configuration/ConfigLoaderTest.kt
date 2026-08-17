package runtime.infrastructure.configuration

import java.io.File
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
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

    @Test
    fun `routing defaults to hash mode without redirects`() {
        val config = ConfigLoader().load(null)
        assertEquals("hash", config.routing.mode)
        assertTrue(config.routing.redirects.isEmpty())
    }

    @Test
    fun `external routing section overrides mode and parses redirects`() {
        val file = File.createTempFile("runtime-config", ".yaml")
        try {
            file.writeText(
                """
                routing:
                  mode: history
                  redirects:
                    - from: home
                      to: boards
                    - from: legacy
                      to: docs
                """.trimIndent()
            )
            val config = ConfigLoader().load(file.absolutePath)
            assertEquals("history", config.routing.mode)
            assertEquals(
                listOf("home" to "boards", "legacy" to "docs"),
                config.routing.redirects.map { it.from to it.to }
            )
        } finally {
            file.delete()
        }
    }

    @Test
    fun `unsupported routing mode is rejected`() {
        val file = File.createTempFile("runtime-config", ".yaml")
        try {
            file.writeText("routing:\n  mode: query\n")
            assertFailsWith<IllegalArgumentException> {
                ConfigLoader().load(file.absolutePath)
            }
        } finally {
            file.delete()
        }
    }

    @Test
    fun `dev section defaults to disabled`() {
        val config = ConfigLoader().load(null)
        assertEquals(false, config.dev.enabled)
        assertEquals(1000L, config.dev.watchIntervalMs)
        assertTrue(config.dev.watchPaths.isEmpty())
    }

    @Test
    fun `external dev section overrides defaults`() {
        val file = File.createTempFile("runtime-config", ".yaml")
        try {
            file.writeText(
                """
                dev:
                  enabled: true
                  watchIntervalMs: 500
                  watchPaths:
                    - demo-plugin/src
                """.trimIndent()
            )
            val config = ConfigLoader().load(file.absolutePath)
            assertEquals(true, config.dev.enabled)
            assertEquals(500L, config.dev.watchIntervalMs)
            assertEquals(listOf("demo-plugin/src"), config.dev.watchPaths)
        } finally {
            file.delete()
        }
    }

    @Test
    fun `collaboration section defaults to disabled`() {
        val config = ConfigLoader().load(null)
        assertEquals(false, config.collaboration.enabled)
        assertEquals(false, config.collaboration.cursorsEnabled)
    }

    @Test
    fun `external collaboration section overrides defaults`() {
        val file = File.createTempFile("runtime-config", ".yaml")
        try {
            file.writeText(
                """
                collaboration:
                  enabled: true
                  cursorsEnabled: true
                """.trimIndent()
            )
            val config = ConfigLoader().load(file.absolutePath)
            assertEquals(true, config.collaboration.enabled)
            assertEquals(true, config.collaboration.cursorsEnabled)
        } finally {
            file.delete()
        }
    }
}
