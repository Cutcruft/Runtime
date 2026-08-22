package runtime.infrastructure.web

import java.nio.file.Files
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
import runtime.infrastructure.plugin.PluginAssetsService

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
        val builder = runtime.application.workspace.WorkspaceBuilder(configPath = null)
        val services = builder.build(id, runtimeConfig)
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
            activeSessions = services.activeSessions,
            entityStore = services.entityStore
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

    private fun buildEndpoints(
        mode: String = "hash",
        uidocsEnabled: Boolean = false,
        uidocsRoot: String = "frontend/storybook-static",
        uiEnabled: Boolean = true,
        registry: WorkspaceRegistry? = null
    ): Pair<WorkspaceRegistry, HttpEndpoints> {
        val reg = registry ?: WorkspaceRegistry().also {
            it.register(testWorkspaceServices("default", workspace(mode)))
        }
        val endpoints = HttpEndpoints(
            HttpConfig(configPath = "/config", staticRoot = "static"),
            reg,
            PluginAssetsService(emptyList()),
            mode,
            uidocsEnabled = uidocsEnabled,
            uiEnabled = uiEnabled,
            uidocsRoot = uidocsRoot
        )
        return Pair(reg, endpoints)
    }

    private fun String?.containsHtml(): Boolean =
        this != null && this.contains("<div id=\"app\">")

    @Test
    fun `embed endpoint serves index html in hash mode`() {
        val (_, endpoints) = buildEndpoints("hash")
        val html = endpoints.loadIndexHtml()?.decodeToString()
        assertTrue(html != null && html.contains("<div id=\"app\">"))
    }

    @Test
    fun `embed endpoint serves index html in history mode`() {
        val (_, endpoints) = buildEndpoints("history")
        val html = endpoints.loadIndexHtml()?.decodeToString()
        assertTrue(html != null && html.contains("<div id=\"app\">"))
    }

    @Test
    fun `unknown path is null in hash mode`() {
        val (_, endpoints) = buildEndpoints("hash")
        val result = endpoints.resolveStaticFile("page/boards")
        assertEquals(null, result)
    }

    @Test
    fun `page deep link serves index html in history mode`() {
        val (_, endpoints) = buildEndpoints("history")
        val result = endpoints.resolveHistoryFallback("page/boards")?.decodeToString()
        assertTrue(result != null && result.contains("<div id=\"app\">"))
    }

    @Test
    fun `config endpoint still serves workspace configuration`() {
        val (_, endpoints) = buildEndpoints("hash")
        val config = endpoints.defaultConfig()
        val json = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(config)
        assertTrue(json.contains("\"landingPageId\":\"boards\""))
        assertTrue(json.contains("\"mode\":\"hash\""))
        assertTrue(json.contains("\"from\":\"home\""))
    }

    @Test
    fun `config core section serves app routing transport`() {
        val (_, endpoints) = buildEndpoints("hash")
        val core = endpoints.configSection("core")
        val json = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(core)
        assertTrue(json.contains("\"app\""))
        assertTrue(json.contains("\"landingPageId\":\"boards\""))
        assertTrue(json.contains("\"transport\""))
        assertTrue(json.contains("\"wsPath\":\"/ws\""))
    }

    @Test
    fun `config pages section serves pages and navigation only`() {
        val (_, endpoints) = buildEndpoints("hash")
        val pages = endpoints.configSection("pages")
        val json = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(pages)
        assertTrue(json.contains("\"pages\""))
        assertTrue(json.contains("\"navigation\""))
        assertTrue(json.contains("\"id\":\"boards\""))
        assertTrue(!json.contains("\"commands\""))
    }

    @Test
    fun `config entities section serves entities`() {
        val (_, endpoints) = buildEndpoints("hash")
        val entities = endpoints.configSection("entities")
        val json = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(entities)
        assertTrue(json.contains("\"entities\""))
    }

    @Test
    fun `config overlays section serves overlays shortcuts subscriptions`() {
        val (_, endpoints) = buildEndpoints("hash")
        val overlays = endpoints.configSection("overlays")
        val json = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(overlays)
        assertTrue(json.contains("\"overlays\""))
        assertTrue(json.contains("\"shortcuts\""))
        assertTrue(json.contains("\"subscriptions\""))
        assertTrue(json.contains("\"overlayTriggers\""))
    }

    @Test
    fun `config i18n section serves i18n`() {
        val (_, endpoints) = buildEndpoints("hash")
        val i18n = endpoints.configSection("i18n")
        val json = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(i18n)
        assertTrue(json.contains("\"i18n\""))
    }

    @Test
    fun `config commands section serves commands`() {
        val (_, endpoints) = buildEndpoints("hash")
        val commands = endpoints.configSection("commands")
        val json = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(commands)
        assertTrue(json.contains("\"commands\""))
    }

    @Test
    fun `config components section serves plugin components`() {
        val (_, endpoints) = buildEndpoints("hash")
        val components = endpoints.configSection("components")
        val json = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(components)
        assertTrue(json.contains("\"pluginComponents\""))
    }

    @Test
    fun `v5 per-workspace config endpoint serves that workspace config`() {
        val registry = WorkspaceRegistry()
        registry.register(testWorkspaceServices("default", workspace("hash")))
        val altWs = workspace("hash").copy(
            app = AppConfiguration(title = "Alt Workspace", logo = null, layout = "sidebar", landingPageId = "alt", theme = ThemeConfig("dark", emptyMap()))
        )
        registry.register(testWorkspaceServices("alt", altWs))

        val (_, endpoints) = buildEndpoints("hash", registry = registry)

        val defaultConfig = endpoints.defaultConfig()
        val defaultJson = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(defaultConfig)
        assertTrue(defaultJson.contains("\"landingPageId\":\"boards\""))

        val defWs = registry.get("default")!!
        val defConfig = endpoints.configSectionOf(defWs.runtime.workspaceConfiguration, "core")
        val defJson = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(defConfig)
        assertTrue(defJson.contains("\"landingPageId\":\"boards\""))

        val altWsRuntime = registry.get("alt")!!
        val altConfig = endpoints.configSectionOf(altWsRuntime.runtime.workspaceConfiguration, "core")
        val altJson = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(altConfig)
        assertTrue(altJson.contains("Alt Workspace"))
        assertTrue(altJson.contains("\"dark\""))
    }

    @Test
    fun `docs endpoint serves index html in hash mode`() {
        val (_, endpoints) = buildEndpoints("hash")
        val html = endpoints.loadIndexHtml()?.decodeToString()
        assertTrue(html != null && html.contains("<div id=\"app\">"))
    }

    @Test
    fun `docs endpoint serves index html in history mode`() {
        val (_, endpoints) = buildEndpoints("history")
        val html = endpoints.loadIndexHtml()?.decodeToString()
        assertTrue(html != null && html.contains("<div id=\"app\">"))
    }

    @Test
    fun `uidocs endpoint is not exposed when dev mode is disabled`() {
        val (_, endpoints) = buildEndpoints("hash", uidocsEnabled = false)
        val result = endpoints.resolveUidocsFile("index.html")
        assertEquals(null, result)
    }

    @Test
    fun `uidocs endpoint serves storybook files when dev mode is enabled`() {
        val root = Files.createTempDirectory("uidocs-test")
        root.resolve("index.html").toFile().writeText("<html><body>UIDocs</body></html>")
        root.resolve("assets").toFile().mkdirs()
        root.resolve("assets/app.js").toFile().writeText("console.log('uidocs')")

        val (_, endpoints) = buildEndpoints("hash", uidocsEnabled = true, uidocsRoot = root.toString())
        val index = endpoints.resolveUidocsFile("index.html")
        assertTrue(index != null && index.readText().contains("UIDocs"))

        val asset = endpoints.resolveUidocsFile("assets/app.js")
        assertTrue(asset != null && asset.readText().contains("uidocs"))
    }

    @Test
    fun `uidocs endpoint rejects path traversal`() {
        val root = Files.createTempDirectory("uidocs-test")
        root.resolve("index.html").toFile().writeText("<html><body>UIDocs</body></html>")

        val (_, endpoints) = buildEndpoints("hash", uidocsEnabled = true, uidocsRoot = root.toString())
        val result = endpoints.resolveUidocsFile("../secret.txt")
        assertEquals(null, result)
    }

    @Test
    fun `headless mode returns null for spa routes`() {
        val (_, endpoints) = buildEndpoints("hash", uiEnabled = false)
        assertEquals(null, endpoints.loadIndexHtml())
        assertEquals(null, endpoints.resolveHistoryFallback("/page/test"))
    }

    @Test
    fun `headless mode still serves config`() {
        val (_, endpoints) = buildEndpoints("hash", uiEnabled = false)
        val config = endpoints.defaultConfig()
        val json = com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(config)
        assertTrue(json.contains("\"landingPageId\":\"boards\""))
    }
}
