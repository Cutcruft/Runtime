package runtime.domain.module

import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.UIDefinition

/**
 * V8 — module API. A module supplies UI primitives (+ their documentation) and
 * may extend the WS protocol. Unlike a plain plugin, a module focuses on reusable
 * interface elements; plugins implement logic on top of the core + module primitives.
 *
 * A module also exposes the full [PluginContext], so a single artifact may register
 * both primitives and commands (e.g. an editor module registers editor primitives).
 */
interface ModuleContext : PluginContext {

    /** Registers a reusable UI primitive (Button, Table, ...). */
    fun registerPrimitive(definition: PrimitiveDefinition)

    /**
     * Registers a WS protocol handler for custom message types. When the core
     * receives a message whose type matches [messageType], it routes it here
     * instead of returning "unknown message type". The handler returns a response
     * payload, or `null` when it chooses not to respond.
     */
    fun registerWsHandler(messageType: String, handler: WsMessageHandler)
}
