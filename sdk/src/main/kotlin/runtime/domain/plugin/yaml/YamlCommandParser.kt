package runtime.domain.plugin.yaml

import org.yaml.snakeyaml.Yaml
import runtime.domain.command.Command
import runtime.domain.command.CommandParameter
import runtime.domain.command.CommandResult
import runtime.domain.command.CommandType
import runtime.domain.entity.EntityType

/**
 * Parses `commands/` into [Command] instances. Supports three declaration kinds:
 *
 * **Auto-CRUD** — generate CRUD for a schema entity:
 * ```yaml
 * crud:
 *   entity: demo.task        # entity type registered in entities/
 *   prefix: task             # optional command prefix (default: entity name)
 *   group: Tasks             # optional
 * ```
 *
 * **Script** — a logical .kts command (inline or file reference):
 * ```yaml
 * script:
 *   name: report             # command id suffix → "<name>"
 *   description: Run report
 *   group: Reports
 *   file: scripts/report.kts # inline alternative: script: |
 *   parameters:
 *     - name: period
 *       type: string
 *       required: true
 * ```
 *
 * **SQL** — analytical SELECT (inline or file reference):
 * ```yaml
 * sql:
 *   name: stats
 *   description: Task stats
 *   file: sql/stats.sql      # inline alternative: query: |
 * ```
 *
 * **REST / gRPC** — external call through a registered connector:
 * ```yaml
 * rest:
 *   name: call
 *   endpoint: my-source      # id of a DataSource registered by this plugin
 *   description: Call external API
 *   method: POST
 *   url: https://example.com/api
 * ```
 */
object YamlCommandParser {

    private val yaml = Yaml()

    fun parse(content: String, pluginId: String, resourceResolver: (String) -> String?): List<Command> {
        @Suppress("UNCHECKED_CAST")
        val root = yaml.load<Any>(content) as? Map<String, Any?>
            ?: throw IllegalArgumentException("Command YAML must be a mapping")
        return parse(root, pluginId, resourceResolver)
    }

    @Suppress("UNCHECKED_CAST")
    fun parse(root: Map<String, Any?>, pluginId: String, resourceResolver: (String) -> String?): List<Command> {
        val commands = mutableListOf<Command>()

        // Auto-CRUD
        (root["crud"] as? Map<String, Any?>)?.let { crud ->
            val entity = EntityType(requireString(crud, "entity"))
            val prefix = crud["prefix"] as? String ?: entity.value.substringAfter('.')
            val group = crud["group"] as? String
            commands += buildCrud(entity, prefix, group)
        }

        // Script command
        (root["script"] as? Map<String, Any?>)?.let { script ->
            commands += buildScript(script, resourceResolver)
        }

        // SQL command
        (root["sql"] as? Map<String, Any?>)?.let { sql ->
            commands += buildSql(sql, resourceResolver)
        }

        // REST command
        (root["rest"] as? Map<String, Any?>)?.let { rest ->
            commands += buildRest(rest)
        }

        return commands
    }

    // ── Builders ──────────────────────────────────────────────────────────────

    private fun buildCrud(entity: EntityType, prefix: String, group: String?): List<Command> {
        // SchemaCrudCommands lives in the script package; resolved lazily via a factory
        // to avoid a hard dependency cycle at parse time.
        return crudFactory?.invoke(entity, prefix, group) ?: throw IllegalArgumentException(
            "Auto-CRUD requires the runtime SDK; entity=$entity"
        )
    }

    private fun buildScript(script: Map<String, Any?>, resolver: (String) -> String?): Command {
        val name = requireString(script, "name")
        val description = script["description"] as? String ?: ""
        val group = script["group"] as? String
        val inline = script["code"] as? String
        val file = script["file"] as? String
        val code: String = when {
            inline != null -> inline
            file != null -> resolver(file) ?: throw IllegalArgumentException("Script file not found: $file")
            else -> throw IllegalArgumentException("Script command '$name' requires 'code' or 'file'")
        }
        val parameters = parseParameters(script["parameters"])

        return object : Command(
            name = name,
            description = description,
            group = group,
            type = CommandType.LOGICAL,
            parameters = parameters
        ) {
            override suspend fun executeInternal(context: runtime.domain.command.CommandContext, params: Any?): CommandResult {
                return context.evaluateScript(code, params)
            }
        }
    }

    private fun buildSql(sql: Map<String, Any?>, resolver: (String) -> String?): Command {
        val name = requireString(sql, "name")
        val description = sql["description"] as? String ?: ""
        val group = sql["group"] as? String
        val inline = sql["query"] as? String
        val file = sql["file"] as? String
        val query: String = when {
            inline != null -> inline
            file != null -> resolver(file) ?: throw IllegalArgumentException("SQL file not found: $file")
            else -> throw IllegalArgumentException("SQL command '$name' requires 'query' or 'file'")
        }
        return sqlCommandFactory?.invoke(name, query, description, group) ?: throw IllegalArgumentException(
            "SQL command '$name' requires the runtime to be configured with a SQL command factory"
        )
    }

    private fun buildRest(rest: Map<String, Any?>): Command {
        val name = requireString(rest, "name")
        val endpoint = requireString(rest, "endpoint")
        val description = rest["description"] as? String ?: ""
        val group = rest["group"] as? String
        val parameters = parseParameters(rest["parameters"])

        // The connector itself must be registered (YAML or code); the command references it by id.
        return object : Command(
            name = name,
            description = description,
            group = group,
            readOnly = true,
            type = CommandType.INFRASTRUCTURE,
            parameters = parameters
        ) {
            override suspend fun executeInternal(context: runtime.domain.command.CommandContext, params: Any?): CommandResult {
                return try {
                    val response = context.invokeDataSource<Any?>(endpoint, params)
                    CommandResult.success(response)
                } catch (e: Exception) {
                    CommandResult.error(e.message ?: "External call to '$endpoint' failed")
                }
            }
        }
    }

    @Suppress("UNCHECKED_CAST")
    private fun parseParameters(raw: Any?): List<CommandParameter> {
        if (raw !is List<*>) return emptyList()
        return raw.mapNotNull { item ->
            val map = item as? Map<*, *> ?: return@mapNotNull null
            CommandParameter(
                name = map["name"] as? String ?: return@mapNotNull null,
                type = map["type"] as? String ?: "string",
                required = map["required"] as? Boolean ?: false,
                description = map["description"] as? String ?: ""
            )
        }
    }

    private fun requireString(map: Map<String, Any?>, key: String): String =
        map[key] as? String ?: throw IllegalArgumentException("Missing string field '$key'")

    /** Injected by the runtime to avoid SDK-internal circular wiring. */
    var crudFactory: ((EntityType, String, String?) -> List<Command>)? = null

    /** Injected by the runtime; builds an analytical SQL command. */
    var sqlCommandFactory: ((name: String, sql: String, description: String, group: String?) -> Command)? = null
}
