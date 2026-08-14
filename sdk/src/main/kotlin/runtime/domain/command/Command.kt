package runtime.domain.command

abstract class Command(
    val name: String,
    val description: String = ""
) {
    init {
        require(name.isNotBlank()) { "Command name must not be blank" }
        require(name.matches(Regex("^[a-z][a-z0-9]*$"))) {
            "Command name must match pattern [a-z][a-z0-9]*"
        }
    }

    abstract suspend fun execute(context: CommandContext, params: Any?): CommandResult
}
