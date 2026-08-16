package runtime.infrastructure.script

import java.io.File
import java.net.URLClassLoader
import java.security.MessageDigest
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import kotlin.io.path.createDirectories
import kotlin.io.path.writeText
import org.jetbrains.kotlin.cli.common.ExitCode
import org.jetbrains.kotlin.cli.common.arguments.K2JVMCompilerArguments
import org.jetbrains.kotlin.cli.common.messages.CompilerMessageSeverity
import org.jetbrains.kotlin.cli.common.messages.CompilerMessageSourceLocation
import org.jetbrains.kotlin.cli.common.messages.MessageCollector
import org.jetbrains.kotlin.cli.jvm.K2JVMCompiler
import org.jetbrains.kotlin.config.Services
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.command.LogicalScriptCommand

/**
 * [ScriptEngine] built on the embedded Kotlin compiler.
 *
 * Each script is compiled with `K2JVMCompiler` into a dedicated output directory and loaded
 * through a shared class loader (runtime classpath + plugin jars). Compilation is serialized
 * on a single daemon thread — off the command path — and the compiled facade class is cached
 * by the SHA-256 of the full source text, so re-running or re-validating an unchanged script
 * never re-compiles.
 *
 * Script contract: the source must define a top-level
 * `fun run(context: CommandContext, params: Any?): Any?`; the return value is wrapped into a
 * [CommandResult] (a returned [CommandResult] is kept as-is). [LogicalScriptCommand.DEFAULT_SCRIPT_IMPORTS]
 * are prepended to every script.
 */
class KotlinScriptEngine(
    private val pluginJars: List<File> = emptyList(),
    private val pluginLoaders: List<ClassLoader> = emptyList(),
    private val workDir: File = File(System.getProperty("java.io.tmpdir"), "cutcruft-scripts"),
    private val maxCacheEntries: Int = 64,
    private val jvmTarget: String = "17"
) : ScriptEngine {

    private sealed class Script {
        abstract val facade: String

        data class Compiled(
            override val facade: String,
            val method: java.lang.reflect.Method
        ) : Script()

        data class Failed(
            override val facade: String,
            val message: String
        ) : Script()
    }

    private val cache = object : LinkedHashMap<String, Script>(maxCacheEntries, 0.75f, true) {
        override fun removeEldestEntry(eldest: MutableMap.MutableEntry<String, Script>): Boolean = size > maxCacheEntries
    }
    private val cacheLock = Any()

    private val compileExecutor = Executors.newSingleThreadExecutor { r ->
        Thread(r, "cutcruft-script-compiler").apply { isDaemon = true; priority = Thread.NORM_PRIORITY }
    }

    private val classpath = buildClasspath()

    init {
        runCatching { workDir.toPath().createDirectories() }
    }

    override fun evaluate(code: String, params: Any?, context: CommandContext): CommandResult {
        val script = compiled(code)
        val result = when (script) {
            is Script.Failed -> return CommandResult.error(script.message)
            is Script.Compiled -> try {
                script.method.invoke(null, context, params)
            } catch (e: java.lang.reflect.InvocationTargetException) {
                return CommandResult.error("Script failed: ${formatCause(e.cause ?: e)}")
            } catch (e: Exception) {
                return CommandResult.error("Script failed: ${formatCause(e)}")
            }
        }
        return if (result is CommandResult) result else CommandResult.success(result)
    }

    override fun validate(code: String): String? = when (val script = compiled(code)) {
        is Script.Failed -> script.message
        is Script.Compiled -> null
    }

    private fun compiled(code: String): Script {
        val source = sourceText(code)
        val hash = sha256(source)
        synchronized(cacheLock) {
            cache[hash]?.let { return it }
        }
        val script = compile(hash, source)
        synchronized(cacheLock) {
            cache[hash] = script
            // drop loader roots for evicted entries by re-keying; simple size guard is enough here
        }
        return script
    }

    private fun compile(hash: String, source: String): Script {
        val hash8 = hash.take(8)
        // Unique per-hash facade name so the shared class loader can never resolve a stale
        // `LogicalScriptKt` from another compiled script.
        val sourceName = "LogicalScript_$hash8.kt"
        val facade = "LogicalScript_${hash8}Kt"
        val sourceFile = File(workDir, sourceName)
        try {
            workDir.toPath().createDirectories()
            sourceFile.toPath().writeText(source)
        } catch (e: Exception) {
            return Script.Failed("", "Script engine: cannot write source: ${e.message}")
        }

        val args = K2JVMCompilerArguments()
        args.freeArgs = arrayListOf(sourceFile.absolutePath)
        args.destination = workDir.absolutePath
        args.classpath = classpath.joinToString(File.pathSeparator) { it.absolutePath }
        args.noStdlib = true
        args.jvmTarget = jvmTarget
        args.moduleName = "logical_script_$hash8"

        val collector = CollectingMessageCollector()
        val exitCode = try {
            compileExecutor.submit<ExitCode> {
                K2JVMCompiler().exec(collector, Services.EMPTY, args)
            }.get()
        } catch (e: Exception) {
            return Script.Failed("", "Script engine error: ${formatCause(e)}")
        }

        if (exitCode != ExitCode.OK || collector.hasErrors()) {
            return Script.Failed(facade, "Script compile error: ${collector.messages.joinToString("; ")}")
        }
        val method = try {
            // Loader is created AFTER compilation so the directory already contains the class
            // (URLClassLoader caches its directory index for the lifetime of the loader).
            // Plugin classes are resolved through the plugin's own class loader so script code
            // sees the exact same model classes as the entities stored in the project.
            val loader = ScriptClassLoader(
                (classpath.map { it.toURI().toURL() } + workDir.toURI().toURL()).toTypedArray(),
                pluginLoaders,
                LogicalScriptCommand::class.java.classLoader
            )
            loader.loadClass(facade).getMethod("run", CommandContext::class.java, Any::class.java)
        } catch (e: Exception) {
            return Script.Failed(
                facade,
                "Script compile error: missing top-level fun run(context: CommandContext, params: Any?): Any?"
            )
        }
        return Script.Compiled(facade, method)
    }

    /**
     * URLClassLoader that resolves classes through the plugin class loaders first, so any
     * plugin model classes referenced by a script are identity-equal to the plugin's own
     * instances. Runtime/SDK classes fall through to the normal class path.
     */
    private class ScriptClassLoader(
        urls: Array<java.net.URL>,
        private val pluginLoaders: List<ClassLoader>,
        parent: ClassLoader
    ) : URLClassLoader(urls, parent) {

        override fun loadClass(name: String, resolve: Boolean): Class<*> {
            synchronized(getClassLoadingLock(name)) {
                var loaded = findLoadedClass(name)
                if (loaded == null) {
                    for (pluginLoader in pluginLoaders) {
                        try {
                            loaded = pluginLoader.loadClass(name)
                            break
                        } catch (_: ClassNotFoundException) {
                            // not provided by this plugin, try the next one
                        }
                    }
                }
                if (loaded == null) {
                    loaded = super.loadClass(name, false)
                }
                if (resolve) resolveClass(loaded)
                return loaded
            }
        }
    }

    private fun sourceText(code: String): String =
        LogicalScriptCommand.DEFAULT_SCRIPT_IMPORTS + "\n\n" + code.trim()

    private fun sha256(text: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(text.toByteArray(Charsets.UTF_8))
        return digest.joinToString("") { "%02x".format(it) }
    }

    private fun buildClasspath(): List<File> {
        val urls = linkedSetOf<String>()
        collectClassLoaderUrls(javaClass.classLoader, urls)
        collectClassLoaderUrls(CommandContext::class.java.classLoader, urls)
        System.getProperty("java.class.path")
            ?.split(File.pathSeparator)
            ?.filter { it.isNotBlank() }
            ?.forEach { urls += File(it).absolutePath }
        pluginJars.forEach { if (it.exists()) urls += it.absolutePath }
        return urls.map(::File).filter { it.exists() }
    }

    private fun collectClassLoaderUrls(classLoader: ClassLoader?, out: MutableSet<String>) {
        var current = classLoader
        while (current != null) {
            if (current is URLClassLoader) {
                current.urLs.forEach { url ->
                    if (url.protocol == "file") out += File(url.toURI()).absolutePath
                }
            }
            current = current.parent
        }
    }

    private fun formatCause(e: Throwable): String {
        val message = e.message?.takeIf { it.isNotBlank() }
        return if (message != null) "${e::class.simpleName}: $message" else e::class.simpleName ?: "unknown error"
    }

    private class CollectingMessageCollector : MessageCollector {
        val messages = mutableListOf<String>()
        private var errors = false

        override fun clear() {
            messages.clear()
            errors = false
        }

        override fun hasErrors(): Boolean = errors

        override fun report(
            severity: CompilerMessageSeverity,
            message: String,
            location: CompilerMessageSourceLocation?
        ) {
            if (severity != CompilerMessageSeverity.ERROR && severity != CompilerMessageSeverity.EXCEPTION) {
                return
            }
            errors = true
            messages += if (location != null && location.line >= 0) {
                "${location.path}:${location.line}:${location.column}: $message"
            } else {
                message
            }
        }
    }
}
