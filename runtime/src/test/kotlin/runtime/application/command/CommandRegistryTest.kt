package runtime.application.command

import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandRegistry
import runtime.domain.command.CommandResult
import runtime.domain.plugin.PluginId
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals

class CommandRegistryTest {
    @Test
    fun `should register and retrieve command by full id`() {
        val registry = CommandRegistry()
        val command = object : Command("command", "Test command") {
            override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
                return CommandResult.success()
            }
        }
        registry.register(PluginId("test"), command)
        assertEquals(command, registry.get("test.command"))
        assertEquals(command, registry.get(CommandRegistry.fullId(PluginId("test"), "command")))
    }

    @Test
    fun `should throw on duplicate command id`() {
        val registry = CommandRegistry()
        val command = object : Command("command") {
            override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
                return CommandResult.success()
            }
        }
        registry.register(PluginId("test"), command)
        assertThrows<IllegalArgumentException> {
            registry.register(PluginId("test"), command)
        }
    }

    @Test
    fun `should throw on invalid command name`() {
        assertThrows<IllegalArgumentException> {
            object : Command("invalid name") {
                override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
                    return CommandResult.success()
                }
            }
        }
    }
}
