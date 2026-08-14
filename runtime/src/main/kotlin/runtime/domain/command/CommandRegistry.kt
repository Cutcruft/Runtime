package runtime.domain.command

import runtime.domain.plugin.PluginId
import java.util.concurrent.ConcurrentHashMap

class CommandRegistry {
    private val commands = ConcurrentHashMap<String, Command>()

    fun register(pluginId: PluginId, command: Command) {
        register(fullId(pluginId, command.name), command)
    }

    fun register(id: String, command: Command) {
        require(!commands.containsKey(id)) { "Command $id already registered" }
        commands[id] = command
    }

    fun get(id: String): Command? = commands[id]

    fun all(): Map<String, Command> = commands.toMap()

    companion object {
        fun fullId(pluginId: PluginId, commandName: String): String = "${pluginId.value}.$commandName"
    }
}
