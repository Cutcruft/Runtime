package runtime

import runtime.application.workspace.WorkspaceBuilder
import runtime.infrastructure.configuration.ConfigLoader
import runtime.infrastructure.web.WebServer
import kotlin.system.exitProcess

fun main() {
    try {
        val config = ConfigLoader().load("config/application.yaml")
        val workspace = WorkspaceBuilder(config.pluginDirectories).build()

        val webServer = WebServer(
            workspace = workspace,
            host = config.host,
            port = config.port
        )
        webServer.start()

        println("Runtime started on http://${config.host}:${config.port}")
        java.lang.Runtime.getRuntime().addShutdownHook(Thread {
            println("Shutting down Runtime...")
        })

        Thread.currentThread().join()
    } catch (e: Exception) {
        System.err.println("Failed to start Runtime: ${e.message}")
        e.printStackTrace()
        exitProcess(1)
    }
}
