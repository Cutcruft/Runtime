package runtime.domain.command

/**
 * Analytical command that runs a SQL SELECT over the project's entities.
 *
 * The SDK only declares the SQL string; the runtime engine (Apache Calcite)
 * executes it against virtual tables derived from the project's entity lists
 * (schema auto-mapped from the plugin models via Jackson). Parameters may be
 * referenced in the SQL as `{paramName}` and are substituted from [params].
 */
open class AnalyticalCommand @JvmOverloads constructor(
    name: String,
    val sql: String,
    description: String = "",
    group: String? = null,
    visibility: CommandVisibility = CommandVisibility.PUBLIC
) : Command(name, description, group, readOnly = true, type = CommandType.ANALYTICAL, visibility = visibility) {

    init {
        require(sql.isNotBlank()) { "Analytical command SQL must not be blank" }
    }

    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult =
        CommandResult.error("Analytical command must be executed by the runtime engine")
}
