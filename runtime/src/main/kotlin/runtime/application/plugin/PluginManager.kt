package runtime.application.plugin

import runtime.domain.models.Messages
import runtime.domain.models.PluginDescriptor
import runtime.domain.module.Module
import runtime.domain.module.ModuleContext
import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId

class PluginManager(
    private val resolver: DependencyResolver,
    private val instantiate: (PluginDescriptor) -> Any,
    private val createContext: (PluginId) -> PluginContext,
    private val moduleContext: (PluginId) -> ModuleContext = { createContext(it) as ModuleContext },
    private val messages: Messages
) {
    fun bootstrap(descriptors: List<PluginDescriptor>): List<PluginId> {
        val result = resolver.resolve(descriptors)
        if (result.cycles.isNotEmpty()) {
            throw IllegalStateException(
                messages.format(
                    Messages.CIRCULAR_DEPENDENCIES,
                    "plugins" to result.cycles.map { cycle -> cycle.map { it.id.value } }
                )
            )
        }

        val loaded = mutableListOf<PluginId>()
        for (descriptor in result.sorted) {
            try {
                if (descriptor.mainClass != null) {
                    val instance = instantiate(descriptor)
                    when (instance) {
                        is Module -> {
                            val context = moduleContext(descriptor.id)
                            instance.initialize(context)
                            instance.start()
                        }
                        is Plugin -> {
                            val context = createContext(descriptor.id)
                            instance.initialize(context)
                            instance.start()
                        }
                        else -> throw IllegalStateException(
                            messages.format(
                                Messages.PLUGIN_LOAD_FAILED,
                                "pluginId" to descriptor.id.value,
                                "message" to "main class must extend Plugin or Module"
                            )
                        )
                    }
                }
                loaded += descriptor.id
            } catch (e: Exception) {
                throw IllegalStateException(
                    messages.format(
                        Messages.PLUGIN_LOAD_FAILED,
                        "pluginId" to descriptor.id.value,
                        "message" to (e.message ?: "")
                    ),
                    e
                )
            }
        }
        return loaded
    }
}
