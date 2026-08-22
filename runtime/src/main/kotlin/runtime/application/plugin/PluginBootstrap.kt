package runtime.application.plugin

import runtime.RuntimeMode
import runtime.application.i18n.MessageRegistry
import runtime.domain.models.Messages
import runtime.domain.models.RegisteredUi
import runtime.domain.models.RuntimeConfig
import runtime.domain.module.ModuleContext
import runtime.domain.module.PrimitiveDefinition
import runtime.domain.module.WsMessageHandler
import runtime.domain.plugin.FrontendComponentDefinition
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.yaml.YamlCommandParser
import runtime.domain.plugin.yaml.YamlPluginLoader
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry
import runtime.domain.repositories.InfrastructureRegistry
import runtime.infrastructure.i18n.MessageCatalogLoader
import runtime.infrastructure.module.ModuleContextImpl
import runtime.infrastructure.plugin.PluginClassLoader
import runtime.infrastructure.plugin.PluginContextImpl
import runtime.infrastructure.plugin.PluginDescriptorLoader
import runtime.infrastructure.plugin.PluginLoader
import runtime.infrastructure.plugin.YamlResourceLoader
import runtime.infrastructure.script.KotlinScriptEngine
import runtime.infrastructure.script.ScriptEngine

/**
 * Shared plugin bootstrap logic used by both initial startup (Main.kt)
 * and hot-reload (RuntimeReloader.kt).
 */
class PluginBootstrap(
    private val config: RuntimeConfig,
    private val entityRegistry: EntityRegistry,
    private val commandRegistry: CommandRegistry,
    private val infrastructureRegistry: InfrastructureRegistry,
    private val messages: Messages
) {
    data class Result(
        val descriptors: List<runtime.domain.models.PluginDescriptor>,
        val loadedPluginIds: Set<PluginId>,
        val uiDefinitions: List<RegisteredUi>,
        val frontendComponents: List<Pair<PluginId, FrontendComponentDefinition>>,
        val primitives: List<Pair<PluginId, PrimitiveDefinition>>,
        val wsHandlers: Map<String, WsMessageHandler>,
        val messageRegistry: MessageRegistry,
        val scriptEngine: ScriptEngine
    )

    fun bootstrap(): Result {
        // Wire YAML auto-CRUD generation (SDK delegates to runtime SchemaCrudCommands).
        YamlCommandParser.crudFactory = { entity, prefix, group ->
            val schema = entityRegistry.get(entity)?.schema
                ?: throw IllegalArgumentException("Auto-CRUD for '$entity' requires a registered schema entity")
            listOf(
                runtime.domain.script.SchemaCrudCommands.create(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.update(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.delete(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.list(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.validate(schema, prefix, group)
            )
        }

        // Wire YAML SQL command generation (SDK delegates to runtime AnalyticalCommand).
        // Disabled in native mode — Calcite Janino requires runtime bytecode generation.
        if (RuntimeMode.isJvm) {
            YamlCommandParser.sqlCommandFactory = { name, sql, description, group ->
                runtime.domain.command.AnalyticalCommand(name = name, sql = sql, description = description, group = group)
            }
        }

        // Discover plugins
        val pluginLoader = PluginLoader(
            config.plugins.directories,
            PluginDescriptorLoader(config.plugins.configFileName, config.plugins.apiVersion)
        )
        val descriptors = pluginLoader.discover()

        // Bootstrap plugins
        val uiDefinitions = mutableListOf<RegisteredUi>()
        val frontendComponents = mutableListOf<Pair<PluginId, FrontendComponentDefinition>>()
        val primitives = mutableListOf<Pair<PluginId, PrimitiveDefinition>>()
        val wsHandlers = mutableMapOf<String, WsMessageHandler>()
        val pluginManager = PluginManager(
            resolver = DependencyResolver(),
            instantiate = { descriptor ->
                val clazz = pluginLoader.loadClass(descriptor, PluginClassLoader::class.java.classLoader)
                clazz.getDeclaredConstructor().newInstance()
            },
            createContext = { pluginId ->
                PluginContextImpl(pluginId, entityRegistry, commandRegistry, infrastructureRegistry,
                    onUiRegistered = { ui ->
                        uiDefinitions += RegisteredUi(pluginId = pluginId, definition = ui)
                    },
                    onFrontendComponentRegistered = { fc ->
                        frontendComponents += pluginId to fc
                    }
                )
            },
            moduleContext = { pluginId ->
                ModuleContextImpl(pluginId, entityRegistry, commandRegistry, infrastructureRegistry,
                    onUiRegistered = { ui -> uiDefinitions += RegisteredUi(pluginId = pluginId, definition = ui) },
                    onFrontendComponentRegistered = { fc -> frontendComponents += pluginId to fc },
                    onPrimitiveRegistered = { id, p -> primitives += id to p },
                    onWsHandlerRegistered = { type, handler -> wsHandlers[type] = handler }
                )
            },
            messages = messages
        )
        val loadedPluginIds = pluginManager.bootstrap(descriptors).toSet()

        // Load YAML-declared definitions (entities/commands/ui) from each plugin JAR.
        val yamlResourceLoader = YamlResourceLoader()
        val yamlMessageEntries = mutableMapOf<String, Map<String, String>>()
        for (descriptor in descriptors) {
            val pluginId = descriptor.id
            val context = PluginContextImpl(pluginId, entityRegistry, commandRegistry, infrastructureRegistry,
                onUiRegistered = { ui -> uiDefinitions += RegisteredUi(pluginId = pluginId, definition = ui) },
                onFrontendComponentRegistered = { fc -> frontendComponents += pluginId to fc }
            )
            loadYamlForPlugin(pluginId.value, descriptor, yamlResourceLoader, context, yamlMessageEntries)
        }

        // Build script engine (KTS only in JVM mode — requires Kotlin compiler)
        val scriptEngine = if (RuntimeMode.isJvm) {
            KotlinScriptEngine(
                pluginJars = descriptors.mapNotNull { descriptor ->
                    runCatching { java.io.File(descriptor.jarPath) }.getOrNull()
                },
                pluginLoaders = pluginLoader.loadedClassLoaders()
            )
        } else {
            KotlinScriptEngine.noop()
        }

        // Load message catalogs
        val messageRegistry = MessageRegistry(config.i18n.defaultLocale)
        val messageCatalogLoader = MessageCatalogLoader()
        val coreCatalogs = messageCatalogLoader.loadFromClasspathAll("core")
        val allowedLocales = config.i18n.locales.ifEmpty { coreCatalogs.keys.sorted() }
        allowedLocales.forEach { locale ->
            val entries = coreCatalogs[locale]
                ?: throw IllegalStateException(
                    "Core message catalog for locale '$locale' is missing (expected messages/$locale.json on the classpath)"
                )
            messageRegistry.register(locale, entries)
        }
        if (config.i18n.defaultLocale !in messageRegistry.locales()) {
            throw IllegalStateException(
                "Default locale '${config.i18n.defaultLocale}' has no core message catalog"
            )
        }
        descriptors.forEach { descriptor ->
            messageCatalogLoader
                .loadFromJar(descriptor.id.value, descriptor.jarPath)
                .forEach { (locale, entries) -> messageRegistry.register(locale, entries) }
        }
        // Register YAML messages (overlay/merge after JSON catalogs so YAML wins).
        yamlMessageEntries.forEach { (locale, entries) -> messageRegistry.register(locale, entries) }

        return Result(
            descriptors = descriptors,
            loadedPluginIds = loadedPluginIds,
            uiDefinitions = uiDefinitions,
            frontendComponents = frontendComponents,
            primitives = primitives,
            wsHandlers = wsHandlers,
            messageRegistry = messageRegistry,
            scriptEngine = scriptEngine
        )
    }

    /**
     * Loads YAML definitions for a plugin from its JAR (`yaml/` resources) and, in
     * dev mode, from the plugin's unpacked directory (`<dir>/yaml/`). Directory files
     * override JAR entries when both exist.
     */
    private fun loadYamlForPlugin(
        pluginIdValue: String,
        descriptor: runtime.domain.models.PluginDescriptor,
        yamlResourceLoader: YamlResourceLoader,
        context: PluginContextImpl,
        yamlMessageEntries: MutableMap<String, Map<String, String>>
    ) {
        val jarPath = descriptor.jarPath
        val isClasspath = jarPath.startsWith("classpath:")
        val isDir = !isClasspath && java.io.File(jarPath).isDirectory
        val entries = when {
            isClasspath -> yamlResourceLoader.listYamlEntries(jarPath)
            isDir -> yamlResourceLoader.listYamlEntriesFromDir(jarPath)
            else -> yamlResourceLoader.listYamlEntries(jarPath)
        }
        if (entries.isEmpty()) return

        val read: (String) -> String? = { entry ->
            when {
                isClasspath -> yamlResourceLoader.readEntry(jarPath, entry)
                isDir -> yamlResourceLoader.readEntryFromDir(jarPath, entry)
                else -> yamlResourceLoader.readEntry(jarPath, entry)
            }
        }
        val resolver: (String) -> String? = read

        // Entities first (CRUD generation depends on registered schemas), then commands/ui/messages.
        for (entry in entries) {
            if (!isYamlCategory(entry, "entities")) continue
            val content = read(entry) ?: continue
            val entity = runtime.domain.plugin.yaml.YamlEntityParser.parse(content)
            context.registerEntity(entity)
        }

        for (entry in entries) {
            val content = read(entry) ?: continue
            when {
                isYamlCategory(entry, "commands") ->
                    YamlCommandParser.parse(content, pluginIdValue, resolver).forEach { context.registerCommand(it) }
                isYamlCategory(entry, "ui") ->
                    runtime.domain.plugin.yaml.YamlUiParser.parse(content).forEach { context.registerUi(it) }
                isYamlCategory(entry, "messages") ->
                    runtime.domain.plugin.yaml.YamlMessagesParser.parse(content).forEach { (locale, msgs) ->
                        yamlMessageEntries[locale] = (yamlMessageEntries[locale] ?: emptyMap()) + msgs
                    }
            }
        }
    }

    /** Matches `yaml/entities/x.yaml`, `entities/x.yaml`, and `./entities/x.yaml`. */
    private fun isYamlCategory(entry: String, category: String): Boolean {
        val normalized = entry.trimStart('/')
        return normalized == "$category" || normalized.startsWith("$category/")
    }
}
