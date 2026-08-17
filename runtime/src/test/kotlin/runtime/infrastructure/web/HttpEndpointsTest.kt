package runtime.infrastructure.web

import java.net.ServerSocket
import java.nio.file.Files
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.domain.models.AppConfiguration
import runtime.domain.models.ComponentDefinition
import runtime.domain.models.HttpConfig
import runtime.domain.models.I18nConfiguration
import runtime.domain.models.NavigationEntry
import runtime.domain.models.OverlayEntry
import runtime.domain.models.OverlayTriggerEntry
import runtime.domain.models.PageDefinition
import runtime.domain.models.RedirectRuleConfiguration
import runtime.domain.models.RoutingConfiguration
import runtime.domain.models.SectionDefinition
import runtime.domain.models.ShortcutEntry
import runtime.domain.models.SubscriptionEntry
import runtime.domain.models.ThemeConfig
import runtime.domain.models.TransportConfig
import runtime.domain.models.WorkspaceConfiguration
import runtime.infrastructure.plugin.PluginAssetsService
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty

class HttpEndpointsTest {

    private fun workspace(mode: String = "hash") = WorkspaceConfiguration(
        app = AppConfiguration(title = "Runtime", logo = null, layout = "sidebar", landingPageId = "boards", theme = ThemeConfig(mode = "light", tokens = emptyMap())),
        navigation = listOf(NavigationEntry(id = "nav-boards", label = "Boards", pageId = "boards", order = 1, pluginId = null)),
        pages = listOf(
            PageDefinition(
                id = "boards",
                title = "Boards",
                sections = listOf(
                    SectionDefinition(
                        id = "boards-list",
                        layout = "stack",
                        columns = 1,
                        components = listOf(ComponentDefinition(type = "Table", config = mapOf("entityType" to "demo.board")))
                    )
                )
            )
        ),
        shortcuts = listOf<ShortcutEntry>(),
        subscriptions = listOf<SubscriptionEntry>(),
        commands = emptyList(),
        entities = emptyList(),
        overlays = listOf<OverlayEntry>(),
        overlayTriggers = listOf<OverlayTriggerEntry>(),
        i18n = I18nConfiguration(defaultLocale = "en", locales = listOf("en"), messages = emptyMap()),
        transport = TransportConfig(wsPath = "/ws"),
        routing = RoutingConfiguration(
            mode = mode,
            redirects = listOf(RedirectRuleConfiguration(from = "home", to = "boards"))
        )
    )

    private fun freePort(): Int = ServerSocket(0).use { it.localPort }

    private fun get(port: Int, path: String): HttpResponse<String> {
        val client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build()
        val request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:$port$path")).GET().build()
        return client.send(request, HttpResponse.BodyHandlers.ofString())
    }

    private fun withServer(
        mode: String,
        uidocsEnabled: Boolean = false,
        uidocsRoot: String = "frontend/storybook-static",
        block: (Int) -> Unit
    ) {
        val port = freePort()
        val endpoints = HttpEndpoints(
            HttpConfig(configPath = "/config", staticRoot = "static"),
            workspace(mode),
            PluginAssetsService(emptyList()),
            mode,
            uidocsEnabled = uidocsEnabled,
            uidocsRoot = uidocsRoot
        )
        val server = embeddedServer(Netty, port = port, host = "127.0.0.1") {
            endpoints.module()(this)
            endpoints.spa()(this)
        }
        server.start(wait = false)
        try {
            block(port)
        } finally {
            server.stop(500, 1000)
        }
    }

    @Test
    fun `embed endpoint serves index html in hash mode`() {
        withServer("hash") { port ->
            val response = get(port, "/embed")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("<div id=\"app\">"))
        }
    }

    @Test
    fun `embed endpoint serves index html in history mode`() {
        withServer("history") { port ->
            val response = get(port, "/embed")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("<div id=\"app\">"))
        }
    }

    @Test
    fun `unknown path is 404 in hash mode`() {
        withServer("hash") { port ->
            val response = get(port, "/page/boards")
            assertEquals(404, response.statusCode())
        }
    }

    @Test
    fun `page deep link serves index html in history mode`() {
        withServer("history") { port ->
            val response = get(port, "/page/boards")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("<div id=\"app\">"))
        }
    }

    @Test
    fun `config endpoint still serves workspace configuration`() {
        withServer("hash") { port ->
            val response = get(port, "/config")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("\"landingPageId\":\"boards\""))
            assertTrue(response.body().contains("\"mode\":\"hash\""))
            assertTrue(response.body().contains("\"from\":\"home\""))
            assertTrue(response.body().contains("\"protocol\""))
        }
    }

    @Test
    fun `docs endpoint serves index html in hash mode`() {
        withServer("hash") { port ->
            val response = get(port, "/docs")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("<div id=\"app\">"))
        }
    }

    @Test
    fun `docs endpoint serves index html in history mode`() {
        withServer("history") { port ->
            val response = get(port, "/docs")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("<div id=\"app\">"))
        }
    }


    @Test
    fun `uidocs endpoint is not exposed when dev mode is disabled`() {
        withServer("hash", uidocsEnabled = false) { port ->
            val response = get(port, "/uidocs")
            assertEquals(404, response.statusCode())
        }
    }

    @Test
    fun `uidocs endpoint serves storybook files when dev mode is enabled`() {
        val root = Files.createTempDirectory("uidocs-test")
        root.resolve("index.html").toFile().writeText("<html><body>UIDocs</body></html>")
        root.resolve("assets").toFile().mkdirs()
        root.resolve("assets/app.js").toFile().writeText("console.log('uidocs')")

        withServer("hash", uidocsEnabled = true, uidocsRoot = root.toString()) { port ->
            val index = get(port, "/uidocs")
            assertEquals(200, index.statusCode())
            assertTrue(index.body().contains("UIDocs"))

            val asset = get(port, "/uidocs/assets/app.js")
            assertEquals(200, asset.statusCode())
            assertTrue(asset.body().contains("uidocs"))
        }
    }

    @Test
    fun `uidocs endpoint rejects path traversal`() {
        val root = Files.createTempDirectory("uidocs-test")
        root.resolve("index.html").toFile().writeText("<html><body>UIDocs</body></html>")

        withServer("hash", uidocsEnabled = true, uidocsRoot = root.toString()) { port ->
            val response = get(port, "/uidocs/../secret.txt")
            assertEquals(404, response.statusCode())
        }
    }
}
