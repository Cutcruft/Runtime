package runtime.infrastructure.module

import runtime.domain.module.ModuleContext
import runtime.domain.module.PrimitiveDefinition
import runtime.domain.module.WsMessageHandler
import runtime.domain.plugin.FrontendComponentDefinition
import runtime.domain.plugin.PluginId
import runtime.infrastructure.plugin.PluginContextImpl

/**
 * V8 — runtime implementation of [ModuleContext]. Extends the plugin context so a
 * module can register entities/commands/ui in addition to primitives. Primitives
 * are surfaced through the same frontend-component channel (bundle path served
 * from the module JAR); WS handlers are routed via a per-message-type registry.
 */
class ModuleContextImpl(
    pluginId: PluginId,
    entityRegistry: runtime.domain.repositories.EntityRegistry,
    commandRegistry: runtime.domain.repositories.CommandRegistry,
    infrastructureRegistry: runtime.domain.repositories.InfrastructureRegistry,
    onUiRegistered: (runtime.domain.plugin.UIDefinition) -> Unit,
    onFrontendComponentRegistered: (FrontendComponentDefinition) -> Unit,
    private val onPrimitiveRegistered: (PluginId, PrimitiveDefinition) -> Unit = { _, _ -> },
    private val onWsHandlerRegistered: (String, WsMessageHandler) -> Unit = { _, _ -> }
) : PluginContextImpl(
    pluginId = pluginId,
    entityRegistry = entityRegistry,
    commandRegistry = commandRegistry,
    infrastructureRegistry = infrastructureRegistry,
    onUiRegistered = onUiRegistered,
    onFrontendComponentRegistered = onFrontendComponentRegistered
), ModuleContext {

    override fun registerPrimitive(definition: PrimitiveDefinition) {
        onPrimitiveRegistered(pluginId, definition)
        // Primitives are served as frontend bundles from the module JAR.
        onFrontendComponentRegistered(
            FrontendComponentDefinition(
                type = definition.type,
                name = definition.name,
                version = definition.version,
                bundlePath = definition.bundlePath,
                cssPath = definition.cssPath,
                schema = definition.schema,
                capabilities = definition.capabilities
            )
        )
    }

    override fun registerWsHandler(messageType: String, handler: WsMessageHandler) {
        onWsHandlerRegistered(messageType, handler)
    }
}
