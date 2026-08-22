package runtime.infrastructure.web

import java.io.File
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
    private val uiEnabled: Boolean = true,
    uidocsRoot: String? = null
) {
    private val uidocsDirectory: File = resolveUidocsDir(uidocsRoot)

    /** Finds the storybook-static output regardless of the working directory. */
    private fun resolveUidocsDir(root: String?): File {
        val candidates = listOfNotNull(root) + listOf(
            "runtime/frontend/storybook-static",
            "frontend/storybook-static",
            "storybook-static",
            "../runtime/frontend/storybook-static"
        )
        for (candidate in candidates) {
            val f = File(candidate)
            if (f.isDirectory) return f.canonicalFile
        }
        return File("storybook-static").canonicalFile
    }

    fun defaultConfig(): WorkspaceConfiguration = registry.default().runtime.workspaceConfiguration

    fun updateConfig(newConfig: WorkspaceConfiguration) {
        println("[HttpEndpoints] updateConfig (default workspace) — reload via WorkspaceBuilder")
    }

    fun configSection(section: String): Any = configSectionOf(defaultConfig(), section)

    fun configSectionOf(c: WorkspaceConfiguration, section: String): Any = when (section) {
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

    /** Re-read index.html from disk (call after frontend rebuild in dev mode). */
    fun invalidateIndexCache() {
        cachedIndexHtml = null
    }

    @Volatile
    private var cachedIndexHtml: ByteArray? = null

    fun loadIndexHtml(): ByteArray? {
        if (!uiEnabled) return null
        cachedIndexHtml?.let { return it }
        val bytes = javaClass.classLoader
            .getResource("${httpConfig.staticRoot}/index.html")
            ?.readBytes()
            ?: listOf(
                File("frontend/dist/index.html"),
                File("../frontend/dist/index.html"),
                File("runtime/frontend/dist/index.html"),
                File("../runtime/frontend/dist/index.html")
            ).firstOrNull { it.isFile }?.readBytes()
        cachedIndexHtml = bytes
        return bytes
    }

    fun resolveStaticFile(path: String): File? {
        if (!uiEnabled) return null
        val normalized = path.trim('/').ifEmpty { return null }
        val file = File(httpConfig.staticRoot, normalized).canonicalFile
        if (!file.path.startsWith(File(httpConfig.staticRoot).canonicalFile.path) || !file.isFile) return null
        return file
    }

    fun resolveHistoryFallback(path: String): ByteArray? {
        if (!uiEnabled || routingMode != "history") return null
        if (path.startsWith("/config") || path.startsWith("/plugin-assets") || path.startsWith("/uidocs")) return null
        return loadIndexHtml()
    }

    fun resolveUidocsFile(path: String): File? {
        if (!uidocsEnabled) return null
        val normalized = path.trim('/').ifEmpty { "index.html" }
        val file = File(uidocsDirectory, normalized).canonicalFile
        if (!file.path.startsWith(uidocsDirectory.path) || !file.isFile) return null
        return file
    }

    fun contentTypeFor(name: String): String = when (name.substringAfterLast('.', "").lowercase()) {
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
