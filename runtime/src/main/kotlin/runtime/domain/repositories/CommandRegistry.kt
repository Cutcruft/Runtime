package runtime.domain.repositories

import runtime.domain.command.Command
import runtime.domain.plugin.PluginId

interface CommandRegistry {
    fun register(pluginId: PluginId, command: Command)

    fun register(id: String, command: Command)

    fun get(id: String): Command?

    fun all(): Map<String, Command>
}
