package runtime.infrastructure.web

import java.io.File
import java.util.concurrent.atomic.AtomicReference
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.http.content.staticResources
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respond
import io.ktor.server.response.respondBytes
import io.ktor.server.response.respondFile
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import runtime.application.workspace.WorkspaceRegistry
import runtime.domain.models.HttpConfig
import runtime.domain.models.WorkspaceConfiguration
import runtime.infrastructure.plugin.PluginAssetsService

class HttpEndpoints(
    private val httpConfig: HttpConfig,
    private val registry: WorkspaceRegistry,
    private val pluginAssetsService: PluginAssetsService,
    private val routingMode: String = "hash",
    private val uidocsEnabled: Boolean = false,
    uidocsRoot: String? = null
) {
    private val uidocsDirectory: File = resolveUidocsDir(uidocsRoot)

    /** Finds the storybook-static output regardless of the working directory. */
    private fun resolveUidocsDir(root: String?): File {
        val candidates = listOfNotNull(root) + listOf(
            "frontend/storybook-static",
            "storybook-static",
            "../frontend/storybook-static"
        )
        for (candidate in candidates) {
            val f = File(candidate)
            if (f.isDirectory) return f.canonicalFile
        }
        return File("storybook-static").canonicalFile
    }

    private fun defaultConfig(): WorkspaceConfiguration = registry.default().runtime.workspaceConfiguration

    fun updateConfig(newConfig: WorkspaceConfiguration) {
        // Kept for RuntimeReloader compat: updates the default workspace config.
        val defaultWs = registry.default()
        // WorkspaceRuntime holds config; replace the config ref is handled via registry rebuild.
        // For now, rebuild the default workspace config in-place is not possible on an
        // immutable runtime; the reloader rebuilds the whole workspace.
        println("[HttpEndpoints] updateConfig (default workspace) — reload via WorkspaceBuilder")
    }

    fun module(): Application.() -> Unit = {
        install(ContentNegotiation) {
            jackson()
        }
        routing {
            staticResources("/", httpConfig.staticRoot)
            // Legacy single-workspace /config and /config/{section} → default workspace.
            get(httpConfig.configPath) {
                call.respond(defaultConfig())
            }
            get("${httpConfig.configPath}/core") {
                call.respond(configSection("core"))
            }
            get("${httpConfig.configPath}/pages") {
                call.respond(configSection("pages"))
            }
            get("${httpConfig.configPath}/commands") {
                call.respond(configSection("commands"))
            }
            get("${httpConfig.configPath}/entities") {
                call.respond(configSection("entities"))
            }
            get("${httpConfig.configPath}/i18n") {
                call.respond(configSection("i18n"))
            }
            get("${httpConfig.configPath}/overlays") {
                call.respond(configSection("overlays"))
            }
            get("${httpConfig.configPath}/components") {
                call.respond(configSection("components"))
            }
            // V5: list available workspaces.
            get("/workspaces") {
                call.respond(mapOf("workspaces" to registry.ids().sorted()))
            }
            // V5: per-workspace config: /config/{workspace} and /config/{workspace}/{section}.
            get("${httpConfig.configPath}/{workspace}") {
                val ws = registry.get(call.parameters["workspace"])
                if (ws == null) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Workspace not found"))
                } else {
                    call.respond(ws.runtime.workspaceConfiguration)
                }
            }
            get("${httpConfig.configPath}/{workspace}/{section}") {
                val ws = registry.get(call.parameters["workspace"])
                val section = call.parameters["section"]
                if (ws == null || section == null) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Workspace or section not found"))
                } else {
                    call.respond(configSectionOf(ws.runtime.workspaceConfiguration, section))
                }
            }
            get("/plugin-assets/{pluginId}/{path...}") {
                val pluginId = call.parameters["pluginId"]
                val path = call.parameters.getAll("path")?.joinToString("/") ?: ""
                if (pluginId == null || path.isEmpty()) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Missing pluginId or path"))
                    return@get
                }
                val asset = pluginAssetsService.resolve(pluginId, path)
                if (asset == null) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Asset not found"))
                    return@get
                }
                call.response.headers.append("Cache-Control", "no-cache, no-store, must-revalidate")
                call.respondBytes(asset.bytes, ContentType.parse(contentTypeFor(asset.name)))
            }
        }
    }

    private fun configSection(section: String): Any =
        configSectionOf(defaultConfig(), section)

    private fun configSectionOf(c: WorkspaceConfiguration, section: String): Any = when (section) {
        "core" -> mapOf(
            "app" to c.app,
            "routing" to c.routing,
            "transport" to c.transport,
            "protocol" to c.protocol,
            "dev" to c.dev,
            "collaboration" to c.collaboration
        )
        "pages" -> mapOf("pages" to c.pages, "navigation" to c.navigation)
        "commands" -> mapOf("commands" to c.commands)
        "entities" -> mapOf("entities" to c.entities)
        "i18n" -> mapOf("i18n" to c.i18n)
        "overlays" -> mapOf(
            "overlays" to c.overlays,
            "overlayTriggers" to c.overlayTriggers,
            "shortcuts" to c.shortcuts,
            "subscriptions" to c.subscriptions
        )
        "components" -> mapOf("pluginComponents" to c.pluginComponents)
        else -> mapOf("error" to "Unknown config section '$section'")
    }

    /**
     * Shell entry routes: `/embed` (embed mode, chrome-less render) and `/docs`
     * (runtime API documentation) always serve `index.html`; in `history` mode any
     * unknown path serves `index.html` so the router can handle `/page/<id>` deep links.
     * Must be registered AFTER the WebSocket route so `/ws` wins.
     */
    fun spa(): Application.() -> Unit = {
        routing {
            get("/embed") {
                call.serveIndex()
            }
            get("/docs") {
                call.serveIndex()
            }
            get("/uidocs") {
                call.serveUidocs("index.html")
            }
            get("/uidocs/{path...}") {
                call.serveUidocs(call.parameters.getAll("path")?.joinToString("/") ?: "index.html")
            }
            if (routingMode == "history") {
                get("/{path...}") {
                    call.serveIndex()
                }
            }
        }
    }


    private suspend fun io.ktor.server.application.ApplicationCall.serveUidocs(path: String) {
        if (!uidocsEnabled) {
            respond(HttpStatusCode.NotFound)
            return
        }
        val normalized = path.trim('/').ifEmpty { "index.html" }
        val file = File(uidocsDirectory, normalized).canonicalFile
        if (!file.path.startsWith(uidocsDirectory.path) || !file.isFile) {
            respond(HttpStatusCode.NotFound)
            return
        }
        respondFile(file)
    }

    private suspend fun io.ktor.server.application.ApplicationCall.serveIndex() {
        val index = loadIndexHtml()
        if (index == null) {
            respond(HttpStatusCode.NotFound)
        } else {
            response.headers.append("Cache-Control", "no-cache, no-store, must-revalidate")
            respondBytes(index, ContentType.Text.Html)
        }
    }

    @Volatile
    private var cachedIndexHtml: ByteArray? = null

    private fun loadIndexHtml(): ByteArray? {
        cachedIndexHtml?.let { return it }
        val bytes = javaClass.classLoader
            .getResource("${httpConfig.staticRoot}/index.html")
            ?.readBytes()
            ?: listOf(
                File("frontend/dist/index.html"),
                File("../frontend/dist/index.html")
            ).firstOrNull { it.isFile }?.readBytes()
        cachedIndexHtml = bytes
        return bytes
    }

    /** Re-read index.html from disk (call after frontend rebuild in dev mode). */
    fun invalidateIndexCache() {
        cachedIndexHtml = null
    }

    private fun contentTypeFor(name: String): String = when (name.substringAfterLast('.', "").lowercase()) {
        "gltf", "json" -> "application/json"
        "glb" -> "model/gltf-binary"
        "js", "mjs" -> "application/javascript"
        "css" -> "text/css"
        "woff" -> "font/woff"
        "woff2" -> "font/woff2"
        "ttf" -> "font/ttf"
        "eot" -> "application/vnd.ms-fontobject"
        "png" -> "image/png"
        "jpg", "jpeg" -> "image/jpeg"
        "webp" -> "image/webp"
        "svg" -> "image/svg+xml"
        "gif" -> "image/gif"
        "ktx2" -> "image/ktx2"
        "hdr" -> "image/vnd.radiance"
        "map" -> "application/json"
        else -> "application/octet-stream"
    }
}
