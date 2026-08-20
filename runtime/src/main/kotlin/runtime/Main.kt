package runtime

import java.util.concurrent.Executors
import java.util.logging.Logger
import kotlin.system.exitProcess
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asCoroutineDispatcher
import runtime.application.command.ProjectLocks
import runtime.application.workspace.WorkspaceBuilder
import runtime.application.workspace.WorkspaceRegistry
import runtime.domain.models.Messages
import runtime.infrastructure.configuration.ConfigLoader
import runtime.infrastructure.dev.PluginWatcher
import runtime.infrastructure.dev.RuntimeReloader
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.plugin.PluginAssetsService
import runtime.infrastructure.storage.StorageFactory
import runtime.infrastructure.web.WebServer

private val logger = Logger.getLogger("Runtime")

fun main(args: Array<String>) {
    try {
        val configPath = resolveConfigPath(args)
        val config = ConfigLoader().load(configPath)
        val messages = Messages(config.messages)

        // Shared infrastructure across workspaces.
        val entityRegistry = InMemoryEntityRegistry()
        val storageResult = StorageFactory().create(config.storage, entityRegistry)
        val entityStore = storageResult.store
        val projectLocks = ProjectLocks()
        val dispatcher = config.command.executorThreads?.let { threads ->
            Executors.newFixedThreadPool(threads).asCoroutineDispatcher()
        } ?: Dispatchers.Default

        val builder = WorkspaceBuilder(
            sharedStore = entityStore,
            projectLocks = projectLocks,
            executorDispatcher = dispatcher,
            configPath = configPath
        )

        // V5: register the default workspace (from application.yaml) and any
        // additional workspaces discovered under workspaces/<id>/application.yaml.
        val registry = WorkspaceRegistry()
        registry.register(builder.build("default", config))
        loadAdditionalWorkspaces(registry, builder)

        val defaultWs = registry.default()
        val pluginAssetsService = PluginAssetsService(defaultWs.runtime.pluginDescriptors)

        val webServer = WebServer(
            config = config,
            registry = registry,
            messages = messages,
            pluginAssetsService = pluginAssetsService
        )
        webServer.start()

        logger.info("Runtime started on http://${config.server.host}:${config.server.port}")
        logger.info("Workspaces: ${registry.ids()}")

        // Dev-mode: start plugin watcher for hot-reload of the default workspace.
        if (config.dev.enabled) {
            val watchPaths = config.dev.watchPaths.ifEmpty { config.plugins.directories }
            val reloader = RuntimeReloader(
                configPath = configPath,
                entityRegistry = entityRegistry,
                commandRegistry = defaultWs.runtime.commandRegistry,
                infrastructureRegistry = defaultWs.runtime.infrastructureRegistry,
                httpEndpoints = webServer.httpEndpoints,
                pluginAssetsService = pluginAssetsService,
                activeSessions = defaultWs.activeSessions,
                sessionRepository = defaultWs.runtime.sessionRepository,
                messages = messages,
                eventPublisher = defaultWs.eventPublisher
            )
            val watcher = PluginWatcher(
                watchDirs = watchPaths,
                configFileName = config.plugins.configFileName,
                pollIntervalMs = config.dev.watchIntervalMs,
                onChange = { reloader.reload() }
            )
            watcher.start()
            logger.info("Dev-mode: watching plugins in $watchPaths for changes")

            java.lang.Runtime.getRuntime().addShutdownHook(Thread {
                watcher.stop()
                entityStore.closeAll()
                logger.info("Shutting down Runtime...")
            })
        } else {
            java.lang.Runtime.getRuntime().addShutdownHook(Thread {
                entityStore.closeAll()
                logger.info("Shutting down Runtime...")
            })
        }

        Thread.currentThread().join()
    } catch (e: Exception) {
        logger.severe("Failed to start Runtime: ${e.message}")
        e.printStackTrace()
        exitProcess(1)
    }
}

/** V5: discovers additional workspaces from `workspaces/<id>/application.yaml`. */
private fun loadAdditionalWorkspaces(
    registry: WorkspaceRegistry,
    builder: WorkspaceBuilder
) {
    val workspacesDir = java.io.File("workspaces")
    if (!workspacesDir.isDirectory) return
    for (dir in workspacesDir.listFiles { f -> f.isDirectory }?.sortedBy { it.name } ?: emptyList()) {
        val id = dir.name
        if (id == "default" || registry.get(id) != null) continue
        val cfgFile = java.io.File(dir, "application.yaml")
        if (!cfgFile.isFile) continue
        runCatching {
            val cfg = ConfigLoader().load(cfgFile.absolutePath)
            registry.register(builder.build(id, cfg))
            logger.info("Registered workspace '$id' from ${cfgFile.absolutePath}")
        }.onFailure {
            logger.severe("Failed to load workspace '$id': ${it.message}")
        }
    }
}

private fun resolveConfigPath(args: Array<String>): String? {
    val cliIndex = args.indexOf("--config")
    val cliValue = if (cliIndex >= 0 && cliIndex + 1 < args.size) args[cliIndex + 1] else null
    return cliValue ?: System.getenv("RUNTIME_CONFIG") ?: "config/application.yaml"
}
