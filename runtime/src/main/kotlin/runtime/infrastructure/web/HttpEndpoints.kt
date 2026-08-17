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
import runtime.domain.models.HttpConfig
import runtime.domain.models.WorkspaceConfiguration
import runtime.infrastructure.plugin.PluginAssetsService

class HttpEndpoints(
    private val httpConfig: HttpConfig,
    workspaceConfiguration: WorkspaceConfiguration,
    private val pluginAssetsService: PluginAssetsService,
    private val routingMode: String = "hash",
    private val uidocsEnabled: Boolean = false,
    uidocsRoot: String = "frontend/storybook-static"
) {
    private val uidocsDirectory = File(uidocsRoot).canonicalFile
    private val configRef = AtomicReference(workspaceConfiguration)

    fun updateConfig(newConfig: WorkspaceConfiguration) {
        configRef.set(newConfig)
    }

    fun module(): Application.() -> Unit = {
        install(ContentNegotiation) {
            jackson()
        }
        routing {
            staticResources("/", httpConfig.staticRoot)
            get(httpConfig.configPath) {
                call.respond(configRef.get())
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
                call.respondBytes(asset.bytes, ContentType.parse(contentTypeFor(asset.name)))
            }
        }
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
        val index = indexHtml
        if (index == null) {
            respond(HttpStatusCode.NotFound)
        } else {
            respondBytes(index, ContentType.Text.Html)
        }
    }

    private val indexHtml: ByteArray? by lazy {
        javaClass.classLoader
            .getResource("${httpConfig.staticRoot}/index.html")
            ?.readBytes()
            ?: listOf(
                File("frontend/dist/index.html"),
                File("../frontend/dist/index.html")
            ).firstOrNull { it.isFile }?.readBytes()
    }

    private fun contentTypeFor(name: String): String = when (name.substringAfterLast('.', "").lowercase()) {
        "gltf", "json" -> "application/json"
        "glb" -> "model/gltf-binary"
        "png" -> "image/png"
        "jpg", "jpeg" -> "image/jpeg"
        "webp" -> "image/webp"
        "svg" -> "image/svg+xml"
        "gif" -> "image/gif"
        "ktx2" -> "image/ktx2"
        "hdr" -> "image/vnd.radiance"
        else -> "application/octet-stream"
    }
}
