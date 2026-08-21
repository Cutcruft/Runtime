package runtime.domain.command

import runtime.infrastructure.query.CalciteQueryEngine

/**
 * Analytical command that runs a SQL SELECT over a project's entities.
 *
 * The core runtime passes the project's data as a `projectData` entry in the
 * params map: `Map<entityType, List<Map<String, Any?>>>` (entity types like
 * `demo.task` become virtual tables `demo.task`; values are Jackson-serialized
 * plugin models). The SDK's own engine (Apache Calcite) executes the SELECT over
 * those in-memory tables — the core has no Calcite dependency.
 *
 * Parameters may be referenced in the SQL as `{paramName}` and are substituted
 * from the remaining [params] before parsing.
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

    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val map = params as? Map<*, *> ?: emptyMap<Any, Any>()
        @Suppress("UNCHECKED_CAST")
        val projectData = map["projectData"] as? Map<String, List<Map<String, Any?>>>
            ?: return CommandResult.error("Analytical command requires 'projectData' in params (provided by the core)")
        val sqlParams = map.filterKeys { it != "projectData" }
        return CalciteQueryEngine().execute(projectData, sql, sqlParams)
    }
}
