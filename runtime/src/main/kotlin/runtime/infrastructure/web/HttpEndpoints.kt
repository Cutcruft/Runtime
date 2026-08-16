package runtime.infrastructure.web

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
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import runtime.domain.models.HttpConfig
import runtime.domain.models.WorkspaceConfiguration
import runtime.infrastructure.plugin.PluginAssetsService

class HttpEndpoints(
    private val httpConfig: HttpConfig,
    private val workspaceConfiguration: WorkspaceConfiguration,
    private val pluginAssetsService: PluginAssetsService,
    private val routingMode: String = "hash"
) {
    fun module(): Application.() -> Unit = {
        install(ContentNegotiation) {
            jackson()
        }
        routing {
            staticResources("/", httpConfig.staticRoot)
            get(httpConfig.configPath) {
                call.respond(workspaceConfiguration)
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
            if (routingMode == "history") {
                get("/{path...}") {
                    call.serveIndex()
                }
            }
        }
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
