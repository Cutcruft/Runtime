package runtime.infrastructure.web

import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

/**
 * Jakarta REST resource replacing Ktor's HttpEndpoints routing.
 * Serves /config, /workspaces, /plugin-assets and section-scoped config endpoints.
 * Static SPA routes (/embed, /docs, /uidocs) and history-mode fallbacks are also handled here.
 */
@Path("/")
class HttpResource {

    private fun state() = RuntimeState

    // ── Config endpoints ──────────────────────────────────────────────────

    @GET
    @Path("/config")
    @Produces(MediaType.APPLICATION_JSON)
    fun config(): Any = state().httpEndpoints.defaultConfig()

    @GET
    @Path("/config/core")
    @Produces(MediaType.APPLICATION_JSON)
    fun configCore(): Any = state().httpEndpoints.configSection("core")

    @GET
    @Path("/config/pages")
    @Produces(MediaType.APPLICATION_JSON)
    fun configPages(): Any = state().httpEndpoints.configSection("pages")

    @GET
    @Path("/config/commands")
    @Produces(MediaType.APPLICATION_JSON)
    fun configCommands(): Any = state().httpEndpoints.configSection("commands")

    @GET
    @Path("/config/entities")
    @Produces(MediaType.APPLICATION_JSON)
    fun configEntities(): Any = state().httpEndpoints.configSection("entities")

    @GET
    @Path("/config/i18n")
    @Produces(MediaType.APPLICATION_JSON)
    fun configI18n(): Any = state().httpEndpoints.configSection("i18n")

    @GET
    @Path("/config/overlays")
    @Produces(MediaType.APPLICATION_JSON)
    fun configOverlays(): Any = state().httpEndpoints.configSection("overlays")

    @GET
    @Path("/config/components")
    @Produces(MediaType.APPLICATION_JSON)
    fun configComponents(): Any = state().httpEndpoints.configSection("components")

    @GET
    @Path("/workspaces")
    @Produces(MediaType.APPLICATION_JSON)
    fun workspaces(): Any = mapOf("workspaces" to state().registry.ids().sorted())

    @GET
    @Path("/config/{workspace}")
    @Produces(MediaType.APPLICATION_JSON)
    fun workspaceConfig(@PathParam("workspace") workspaceId: String): Response {
        val ws = state().registry.get(workspaceId)
            ?: return Response.status(Response.Status.NOT_FOUND)
                .entity(mapOf("error" to "Workspace not found"))
                .build()
        return Response.ok(ws.runtime.workspaceConfiguration).build()
    }

    @GET
    @Path("/config/{workspace}/{section}")
    @Produces(MediaType.APPLICATION_JSON)
    fun workspaceConfigSection(
        @PathParam("workspace") workspaceId: String,
        @PathParam("section") section: String
    ): Response {
        val ws = state().registry.get(workspaceId)
            ?: return Response.status(Response.Status.NOT_FOUND)
                .entity(mapOf("error" to "Workspace or section not found"))
                .build()
        return Response.ok(state().httpEndpoints.configSectionOf(ws.runtime.workspaceConfiguration, section)).build()
    }

    // ── Plugin assets ─────────────────────────────────────────────────────

    @GET
    @Path("/plugin-assets/{pluginId}/{path: .*}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    fun pluginAssets(
        @PathParam("pluginId") pluginId: String,
        @PathParam("path") path: String
    ): Response {
        if (pluginId.isEmpty() || path.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(mapOf("error" to "Missing pluginId or path"))
                .build()
        }
        val asset = state().pluginAssetsService.resolve(pluginId, path)
            ?: return Response.status(Response.Status.NOT_FOUND)
                .entity(mapOf("error" to "Asset not found"))
                .build()
        return Response.ok(asset.bytes)
            .header("Cache-Control", "no-cache, no-store, must-revalidate")
            .type(state().httpEndpoints.contentTypeFor(asset.name))
            .build()
    }

    // ── SPA routes ────────────────────────────────────────────────────────

    @GET
    @Path("/embed")
    fun embed(): Response = serveIndex()

    @GET
    @Path("/docs")
    fun docs(): Response = serveIndex()

    @GET
    @Path("/uidocs")
    fun uidocsRoot(): Response = serveUidocs("index.html")

    @GET
    @Path("/uidocs/{path: .*}")
    fun uidocs(@PathParam("path") path: String): Response = serveUidocs(path)

    @GET
    @Path("/page/{pageId}")
    fun pageDeepLink(@PathParam("pageId") pageId: String): Response {
        val fb = state().httpEndpoints.resolveHistoryFallback("/page/$pageId")
            ?: return Response.status(Response.Status.NOT_FOUND).build()
        return Response.ok(fb).type(MediaType.TEXT_HTML)
            .header("Cache-Control", "no-cache, no-store, must-revalidate")
            .build()
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private fun serveIndex(): Response {
        val index = state().httpEndpoints.loadIndexHtml()
            ?: return Response.status(Response.Status.NOT_FOUND).build()
        return Response.ok(index)
            .type(MediaType.TEXT_HTML)
            .header("Cache-Control", "no-cache, no-store, must-revalidate")
            .build()
    }

    private fun serveUidocs(path: String): Response {
        val file = state().httpEndpoints.resolveUidocsFile(path)
            ?: return Response.status(Response.Status.NOT_FOUND).build()
        return Response.ok(file.readBytes())
            .type(state().httpEndpoints.contentTypeFor(file.name))
            .build()
    }
}
