package runtime.domain.command

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test

class CommandValidatorTest {

    private fun commandWith(vararg params: CommandParameter): Command = object : Command(
        name = "validateme",
        parameters = params.toList()
    ) {
        override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult =
            CommandResult.success(value = null)
    }

    @Test
    fun `required missing field produces fieldError with code required`() {
        val command = commandWith(CommandParameter("title", "string", required = true))
        val errors = CommandValidator.validate(command, emptyMap<String, Any>())
        assertEquals(1, errors.size)
        assertEquals("title", errors[0].field)
        assertEquals("required", errors[0].code)
    }

    @Test
    fun `string minLength and maxLength are enforced`() {
        val command = commandWith(
            CommandParameter("name", "string", min = 3.0, max = 10.0)
        )
        val tooShort = CommandValidator.validate(command, mapOf("name" to "ab"))
        assertEquals("minLength", tooShort[0].code)

        val tooLong = CommandValidator.validate(command, mapOf("name" to "abcdefghijk"))
        assertEquals("maxLength", tooLong[0].code)

        val ok = CommandValidator.validate(command, mapOf("name" to "hello"))
        assertTrue(ok.isEmpty())
    }

    @Test
    fun `enum field must be one of declared values`() {
        val command = commandWith(
            CommandParameter("status", "enum", enumValues = listOf("open", "done"))
        )
        val errors = CommandValidator.validate(command, mapOf("status" to "archived"))
        assertEquals("enum", errors[0].code)

        val ok = CommandValidator.validate(command, mapOf("status" to "done"))
        assertTrue(ok.isEmpty())
    }

    @Test
    fun `number min and max are enforced`() {
        val command = commandWith(
            CommandParameter("count", "number", min = 0.0, max = 100.0)
        )
        assertEquals("min", CommandValidator.validate(command, mapOf("count" to -1))[0].code)
        assertEquals("max", CommandValidator.validate(command, mapOf("count" to 101))[0].code)
        assertTrue(CommandValidator.validate(command, mapOf("count" to 50)).isEmpty())
    }

    @Test
    fun `uuid field rejects non-uuid`() {
        val command = commandWith(CommandParameter("id", "uuid", required = true))
        assertEquals("uuid", CommandValidator.validate(command, mapOf("id" to "not-a-uuid"))[0].code)
        assertTrue(CommandValidator.validate(command, mapOf("id" to "11111111-1111-4111-8111-111111111111")).isEmpty())
    }

    @Test
    fun `pattern is enforced on strings`() {
        val command = commandWith(
            CommandParameter("code", "string", pattern = "[a-z]{3}")
        )
        assertEquals("pattern", CommandValidator.validate(command, mapOf("code" to "AB1"))[0].code)
        assertTrue(CommandValidator.validate(command, mapOf("code" to "abc")).isEmpty())
    }

    @Test
    fun `type mismatch for number`() {
        val command = commandWith(CommandParameter("count", "number"))
        assertEquals("type", CommandValidator.validate(command, mapOf("count" to "not-a-number"))[0].code)
    }

    @Test
    fun `multiple field errors reported together`() {
        val command = commandWith(
            CommandParameter("title", "string", required = true, min = 3.0),
            CommandParameter("status", "enum", required = true, enumValues = listOf("open", "done"))
        )
        val errors = CommandValidator.validate(command, mapOf("title" to "x", "status" to "nope"))
        assertEquals(2, errors.size)
        assertTrue(errors.all { it.code in setOf("minLength", "enum") })
    }

    @Test
    fun `commands without declared parameters skip validation`() {
        val command = commandWith()
        assertTrue(CommandValidator.validate(command, null).isEmpty())
        assertTrue(CommandValidator.validate(command, mapOf("anything" to "goes")).isEmpty())
    }
}
