package runtime.infrastructure.web

import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.http.content.staticResources
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.response.respond
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import runtime.domain.models.HttpConfig
import runtime.domain.models.WorkspaceConfiguration

class HttpEndpoints(
    private val httpConfig: HttpConfig,
    private val workspaceConfiguration: WorkspaceConfiguration
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
        }
    }
}
