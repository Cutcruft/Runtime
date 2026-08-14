package runtime.domain.plugin

abstract class Plugin {
    abstract val info: PluginInfo

    open fun initialize(context: PluginContext) {}

    open fun start() {}

    open fun stop() {}
}
