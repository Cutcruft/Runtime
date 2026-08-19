package runtime.application.plugin

import runtime.application.i18n.MessageRegistry
import runtime.domain.models.Messages
import runtime.domain.models.RegisteredUi
import runtime.domain.models.RuntimeConfig
import runtime.domain.plugin.FrontendComponentDefinition
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry
import runtime.domain.repositories.InfrastructureRegistry
import runtime.infrastructure.i18n.MessageCatalogLoader
import runtime.infrastructure.plugin.PluginClassLoader
import runtime.infrastructure.plugin.PluginContextImpl
import runtime.infrastructure.plugin.PluginDescriptorLoader
import runtime.infrastructure.plugin.PluginLoader
import runtime.infrastructure.script.KotlinScriptEngine

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
        val messageRegistry: MessageRegistry,
        val scriptEngine: KotlinScriptEngine
    )

    fun bootstrap(): Result {
        // Discover plugins
        val pluginLoader = PluginLoader(
            config.plugins.directories,
            PluginDescriptorLoader(config.plugins.configFileName, config.plugins.apiVersion)
        )
        val descriptors = pluginLoader.discover()

        // Bootstrap plugins
        val uiDefinitions = mutableListOf<RegisteredUi>()
        val frontendComponents = mutableListOf<Pair<PluginId, FrontendComponentDefinition>>()
        val pluginManager = PluginManager(
            resolver = DependencyResolver(),
            instantiate = { descriptor ->
                val clazz = pluginLoader.loadClass(descriptor, PluginClassLoader::class.java.classLoader)
                clazz.getDeclaredConstructor().newInstance() as runtime.domain.plugin.Plugin
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
            messages = messages
        )
        val loadedPluginIds = pluginManager.bootstrap(descriptors).toSet()

        // Build script engine
        val scriptEngine = KotlinScriptEngine(
            pluginJars = descriptors.mapNotNull { descriptor ->
                runCatching { java.io.File(descriptor.jarPath) }.getOrNull()
            },
            pluginLoaders = pluginLoader.loadedClassLoaders()
        )

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

        return Result(
            descriptors = descriptors,
            loadedPluginIds = loadedPluginIds,
            uiDefinitions = uiDefinitions,
            frontendComponents = frontendComponents,
            messageRegistry = messageRegistry,
            scriptEngine = scriptEngine
        )
    }
}
