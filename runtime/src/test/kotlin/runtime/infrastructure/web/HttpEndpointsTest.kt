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
import runtime.application.workspace.WorkspaceRegistry
import runtime.application.workspace.WorkspaceRuntime
import runtime.application.workspace.WorkspaceServices
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.inmem.InMemoryInfrastructureRegistry
import runtime.infrastructure.inmem.InMemorySessionRepository
import runtime.infrastructure.plugin.PluginAssetsService
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty

class HttpEndpointsTest {

    /** Builds a real WorkspaceServices from the given UI config (for HTTP tests). */
    private fun testWorkspaceServices(id: String, wsConfig: WorkspaceConfiguration): WorkspaceServices {
        val runtimeConfig = runtime.domain.models.RuntimeConfig(
            server = runtime.domain.models.ServerConfig("127.0.0.1", 0),
            http = HttpConfig("/config", "static"),
            ws = runtime.domain.models.WsConfig("/ws"),
            plugins = runtime.domain.models.PluginsConfig(emptyList(), "config.yaml", 1),
            command = runtime.domain.models.CommandConfig(null, null, null, null, null),
            audit = runtime.domain.models.AuditConfig(false, 10000),
            storage = runtime.domain.models.StorageConfig("memory", false, -1, "lru", ".data/projects", null, null),
            routing = runtime.domain.models.RoutingConfig("hash", emptyList()),
            ui = runtime.domain.models.UiConfig(
                pluginOrder = emptyList(), landingPage = null, navInclude = emptyList(), navExclude = emptyList(),
                navigationComponentType = "Navigation", pageComponentType = "Page", appComponentType = "App",
                shortcutComponentType = "Shortcut", subscriptionComponentType = "EventSubscription",
                overlayComponentType = "Overlay", overlayTriggerComponentType = "OverlayTrigger",
                layerComponentType = "Layer",
                app = runtime.domain.models.AppConfig("Runtime", null, "sidebar"),
                navigationFields = runtime.domain.models.NavigationFields("id", "label", "pageId", "order", "group", "icon"),
                pageFields = runtime.domain.models.PageFields("id", "title", "sections", "layers"),
                layerFields = runtime.domain.models.LayerFields("pageId", "id", "title", "order", "visible", "opacity", "positionType", "pointerEvents", "className", "sections"),
                appFields = runtime.domain.models.AppFields("title", "logo", "layout"),
                theme = ThemeConfig("light", emptyMap())
            ),
            i18n = runtime.domain.models.I18nConfig("en", listOf("en")),
            messages = emptyMap()
        )
        // The test only exercises HTTP config serving; use the real builder for a valid slice.
        val builder = runtime.application.workspace.WorkspaceBuilder(
            sharedStore = runtime.infrastructure.storage.DefaultEntityStore(),
            projectLocks = runtime.application.command.ProjectLocks(),
            executorDispatcher = kotlinx.coroutines.Dispatchers.Default,
            configPath = null
        )
        val services = builder.build(id, runtimeConfig)
        // Replace the built workspaceConfiguration with the test fixture.
        val runtime = runtime.application.workspace.WorkspaceRuntime(
            workspaceId = id,
            config = runtimeConfig,
            workspaceConfiguration = wsConfig,
            entityRegistry = services.runtime.entityRegistry,
            commandRegistry = services.runtime.commandRegistry,
            infrastructureRegistry = services.runtime.infrastructureRegistry,
            sessionRepository = services.runtime.sessionRepository,
            pluginDescriptors = services.runtime.pluginDescriptors
        )
        return WorkspaceServices(
            runtime = runtime,
            dispatchService = services.dispatchService,
            sessionManager = services.sessionManager,
            projectService = services.projectService,
            eventPublisher = services.eventPublisher,
            presenceManager = services.presenceManager,
            activeSessions = services.activeSessions
        )
    }

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
        val registry = WorkspaceRegistry()
        registry.register(testWorkspaceServices("default", workspace(mode)))
        val endpoints = HttpEndpoints(
            HttpConfig(configPath = "/config", staticRoot = "static"),
            registry,
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
    fun `config core section serves app routing transport`() {
        withServer("hash") { port ->
            val response = get(port, "/config/core")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("\"app\""))
            assertTrue(response.body().contains("\"landingPageId\":\"boards\""))
            assertTrue(response.body().contains("\"transport\""))
            assertTrue(response.body().contains("\"wsPath\":\"/ws\""))
        }
    }

    @Test
    fun `config pages section serves pages and navigation only`() {
        withServer("hash") { port ->
            val response = get(port, "/config/pages")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("\"pages\""))
            assertTrue(response.body().contains("\"navigation\""))
            assertTrue(response.body().contains("\"id\":\"boards\""))
            // Should NOT include commands/entities (section-scoped).
            assertTrue(!response.body().contains("\"commands\""))
        }
    }

    @Test
    fun `config entities section serves entities`() {
        withServer("hash") { port ->
            val response = get(port, "/config/entities")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("\"entities\""))
        }
    }

    @Test
    fun `config overlays section serves overlays shortcuts subscriptions`() {
        withServer("hash") { port ->
            val response = get(port, "/config/overlays")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("\"overlays\""))
            assertTrue(response.body().contains("\"shortcuts\""))
            assertTrue(response.body().contains("\"subscriptions\""))
            assertTrue(response.body().contains("\"overlayTriggers\""))
        }
    }

    @Test
    fun `config i18n section serves i18n`() {
        withServer("hash") { port ->
            val response = get(port, "/config/i18n")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("\"i18n\""))
        }
    }

    @Test
    fun `config commands section serves commands`() {
        withServer("hash") { port ->
            val response = get(port, "/config/commands")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("\"commands\""))
        }
    }

    @Test
    fun `config components section serves plugin components`() {
        withServer("hash") { port ->
            val response = get(port, "/config/components")
            assertEquals(200, response.statusCode())
            assertTrue(response.body().contains("\"pluginComponents\""))
        }
    }

    @Test
    fun `v5 per-workspace config endpoint serves that workspace config`() {
        val port = freePort()
        val registry = WorkspaceRegistry()
        registry.register(testWorkspaceServices("default", workspace("hash")))
        val altConfig = workspace("hash")
        val altWs = runtime.domain.models.WorkspaceConfiguration(
            app = AppConfiguration(title = "Alt Workspace", logo = null, layout = "sidebar", landingPageId = "alt", theme = ThemeConfig("dark", emptyMap())),
            navigation = altConfig.navigation,
            pages = altConfig.pages,
            shortcuts = altConfig.shortcuts,
            subscriptions = altConfig.subscriptions,
            commands = altConfig.commands,
            entities = altConfig.entities,
            overlays = altConfig.overlays,
            overlayTriggers = altConfig.overlayTriggers,
            i18n = altConfig.i18n,
            transport = altConfig.transport,
            routing = altConfig.routing
        )
        registry.register(testWorkspaceServices("alt", altWs))

        val endpoints = HttpEndpoints(
            HttpConfig(configPath = "/config", staticRoot = "static"),
            registry,
            PluginAssetsService(emptyList()),
            "hash"
        )
        val server = embeddedServer(Netty, port = port, host = "127.0.0.1") {
            endpoints.module()(this)
            endpoints.spa()(this)
        }
        server.start(wait = false)
        try {
            // Default workspace served at /config/{workspace} and legacy /config.
            val legacy = get(port, "/config")
            assertTrue(legacy.body().contains("\"landingPageId\":\"boards\""))
            val def = get(port, "/config/default")
            assertEquals(200, def.statusCode())
            assertTrue(def.body().contains("\"landingPageId\":\"boards\""))
            // Alt workspace isolated config.
            val alt = get(port, "/config/alt")
            assertEquals(200, alt.statusCode())
            assertTrue(alt.body().contains("Alt Workspace"))
            assertTrue(alt.body().contains("\"mode\":\"dark\""))
            // Unknown workspace → 404.
            assertEquals(404, get(port, "/config/nope").statusCode())
            // Per-workspace section.
            val altCore = get(port, "/config/alt/core")
            assertEquals(200, altCore.statusCode())
            assertTrue(altCore.body().contains("\"dark\""))
        } finally {
            server.stop(500, 1000)
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
