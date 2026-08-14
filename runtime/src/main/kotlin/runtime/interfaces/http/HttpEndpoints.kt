package runtime.interfaces.http

import io.ktor.serialization.jackson.jackson
import runtime.domain.workspace.WorkspaceConfiguration
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.http.content.staticResources
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respond
import io.ktor.server.routing.get
import io.ktor.server.routing.routing

class HttpEndpoints(private val workspaceConfiguration: WorkspaceConfiguration) {
    fun module(): Application.() -> Unit = {
        install(ContentNegotiation) {
            jackson()
        }
        routing {
            staticResources("/", "static")
            get("/config") {
                call.respond(workspaceConfiguration)
            }
        }
    }
}
