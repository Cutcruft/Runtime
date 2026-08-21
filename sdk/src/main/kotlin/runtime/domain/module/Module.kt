package runtime.domain.module

import runtime.domain.plugin.PluginInfo

/**
 * V8 — a module. Modules supply UI primitives (+ documentation) and may extend the
 * WS protocol. The core loads modules before plugins so plugins can reference the
 * primitives a module provides.
 */
abstract class Module {
    abstract val info: PluginInfo

    open fun initialize(context: ModuleContext) {}

    open fun start() {}

    open fun stop() {}
}
