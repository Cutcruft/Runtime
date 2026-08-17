package runtime.infrastructure.dev

import java.io.File
import java.nio.file.FileSystems
import java.nio.file.Path
import java.nio.file.StandardWatchEventKinds
import java.nio.file.WatchKey
import java.nio.file.WatchService
import java.util.concurrent.ConcurrentHashMap
import java.util.logging.Logger

/**
 * Watches plugin directories for changes to JAR files and config.yaml descriptors.
 * When a change is detected, invokes the [onChange] callback.
 *
 * Uses JDK WatchService — no external dependencies.
 */
class PluginWatcher(
    private val watchDirs: List<String>,
    private val configFileName: String = "config.yaml",
    private val pollIntervalMs: Long = 1000,
    private val onChange: () -> Unit
) {
    private val logger = Logger.getLogger(PluginWatcher::class.java.name)
    private val watchService: WatchService = FileSystems.getDefault().newWatchService()
    private val registeredKeys = ConcurrentHashMap<WatchKey, Path>()
    private val thread: Thread = Thread({ run() }, "plugin-watcher").apply { isDaemon = true }

    @Volatile
    private var running = false

    fun start() {
        if (running) return
        running = true
        registerDirs()
        thread.start()
        logger.info("PluginWatcher started, watching ${registeredKeys.size} directories")
    }

    fun stop() {
        running = false
        thread.interrupt()
        watchService.close()
        logger.info("PluginWatcher stopped")
    }

    private fun registerDirs() {
        for (dirName in watchDirs) {
            val baseDir = File(dirName)
            if (!baseDir.isDirectory) continue
            // Watch the base plugin directory itself
            registerPath(baseDir.toPath())
            // Watch each plugin subdirectory
            baseDir.listFiles()?.filter { it.isDirectory }?.forEach { pluginDir ->
                registerPath(pluginDir.toPath())
            }
        }
    }

    private fun registerPath(dir: Path) {
        try {
            val key = dir.register(
                watchService,
                StandardWatchEventKinds.ENTRY_CREATE,
                StandardWatchEventKinds.ENTRY_DELETE,
                StandardWatchEventKinds.ENTRY_MODIFY
            )
            registeredKeys[key] = dir
        } catch (e: Exception) {
            logger.warning("Failed to watch directory $dir: ${e.message}")
        }
    }

    private fun run() {
        while (running) {
            try {
                val key = watchService.poll(pollIntervalMs, java.util.concurrent.TimeUnit.MILLISECONDS) ?: continue
                var changed = false
                for (event in key.pollEvents()) {
                    val kind = event.kind()
                    if (kind == StandardWatchEventKinds.OVERFLOW) continue

                    @Suppress("UNCHECKED_CAST")
                    val fileName = (event.context() as? Path)?.toString() ?: continue
                    if (fileName.endsWith(".jar") || fileName == configFileName) {
                        changed = true
                        logger.info("Plugin change detected: $kind $fileName in ${registeredKeys[key]}")
                    }
                }
                key.reset()
                if (changed) {
                    // Small debounce — wait for file writes to settle
                    Thread.sleep(200)
                    onChange()
                }
            } catch (e: InterruptedException) {
                break
            } catch (e: Exception) {
                if (running) logger.warning("PluginWatcher error: ${e.message}")
            }
        }
    }
}
