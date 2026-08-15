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
    private val pluginAssetsService: PluginAssetsService
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
