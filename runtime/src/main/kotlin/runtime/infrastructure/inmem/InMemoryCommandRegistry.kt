package runtime.infrastructure.inmem

import java.util.concurrent.ConcurrentHashMap
import runtime.domain.command.Command
import runtime.domain.models.CommandIds
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry

class InMemoryCommandRegistry : CommandRegistry {
    private val commands = ConcurrentHashMap<String, Command>()

    override fun register(pluginId: PluginId, command: Command) {
        register(CommandIds.fullId(pluginId, command.name), command)
    }

    override fun register(id: String, command: Command) {
        require(!commands.containsKey(id)) { "Command $id already registered" }
        commands[id] = command
    }

    override fun get(id: String): Command? = commands[id]

    override fun all(): Map<String, Command> = commands.toMap()
}
