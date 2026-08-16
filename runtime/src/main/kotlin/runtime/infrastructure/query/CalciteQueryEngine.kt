package runtime.infrastructure.query

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.sql.DriverManager
import org.apache.calcite.jdbc.CalciteConnection
import org.apache.calcite.schema.impl.AbstractSchema
import org.apache.calcite.sql.SqlKind
import org.apache.calcite.sql.SqlNode
import org.apache.calcite.sql.parser.SqlParser
import org.apache.calcite.tools.Frameworks
import runtime.domain.command.CommandResult
import runtime.domain.models.Project

/**
 * Executes analytical SQL (SELECT only) over a project's entities using Apache
 * Calcite. Each registered entity type becomes a virtual table (`plugin.type`)
 * whose columns are auto-mapped from the Jackson-serialized plugin models.
 * Named parameters in the SQL (`{paramName}`) are substituted from the params
 * map before parsing.
 */
class CalciteQueryEngine {

    private val mapper = ObjectMapper().registerModule(KotlinModule.Builder().build())

    fun execute(project: Project, sql: String, params: Any?): CommandResult {
        val prepared = try {
            substituteParams(sql, params)
        } catch (e: Exception) {
            return CommandResult.error("Invalid parameters: ${e.message}")
        }
        val parsed = try {
            SqlParser.create(prepared).parseStmt()
        } catch (e: Exception) {
            return CommandResult.error("SQL parse error: ${e.message}")
        }
        if (!isSelect(parsed)) {
            return CommandResult.error("Only SELECT queries are allowed")
        }
        return try {
            DriverManager.getConnection("jdbc:calcite:lex=JAVA").use { connection ->
                val calcite = connection.unwrap(CalciteConnection::class.java)
                registerSchema(calcite, project)
                connection.createStatement().use { stmt ->
                    stmt.executeQuery(prepared).use { rs ->
                        val meta = rs.metaData
                        val columnCount = meta.columnCount
                        val labels = (1..columnCount).map { meta.getColumnLabel(it) }
                        val rows = mutableListOf<Map<String, Any?>>()
                        while (rs.next()) {
                            val row = LinkedHashMap<String, Any?>()
                            for (i in 1..columnCount) row[labels[i - 1]] = rs.getObject(i)
                            rows.add(row)
                        }
                        CommandResult.success(rows)
                    }
                }
            }
        } catch (e: Exception) {
            CommandResult.error("Query failed: ${e.message}")
        }
    }

    private fun isSelect(node: SqlNode): Boolean {
        var current = node
        if (current.kind == SqlKind.ORDER_BY) {
            val orderBy = current as? org.apache.calcite.sql.SqlOrderBy ?: return false
            current = orderBy.query
        }
        return current.kind == SqlKind.SELECT
    }

    private fun registerSchema(calcite: CalciteConnection, project: Project) {
        val root = calcite.rootSchema
        val byPlugin = project.registeredEntityTypes().groupBy { it.value.substringBefore('.') }
        for ((plugin, types) in byPlugin) {
            val sub = root.add(plugin, AbstractSchema())
            for (type in types) {
                val tableName = type.value.substringAfter('.')
                val objects = project.objectList<Any>(type)?.values().orEmpty()
                val maps = objects.map { row ->
                    @Suppress("UNCHECKED_CAST")
                    mapper.convertValue(row, Map::class.java) as Map<String, Any?>
                }
                sub.add(tableName, tableFromRows(tableName, maps))
            }
        }
    }

    private fun tableFromRows(tableName: String, rows: List<Map<String, Any?>>): EntityRowsTable {
        val columnOrder = LinkedHashSet<String>()
        rows.forEach { row -> row.keys.forEach { columnOrder.add(it) } }
        val columns = columnOrder.map { name ->
            EntityRowsTable.ColumnDef(name, rows.map { row -> row[name] })
        }
        return EntityRowsTable(columns)
    }

    private fun substituteParams(sql: String, params: Any?): String {
        val map: Map<*, *> = when (params) {
            null -> emptyMap<Any, Any>()
            is Map<*, *> -> params
            else -> throw IllegalArgumentException("Analytical parameters must be a map")
        }
        var result = sql
        for ((key, value) in map) {
            result = result.replace("{$key}", sqlLiteral(value))
        }
        return result
    }

    private fun sqlLiteral(value: Any?): String = when (value) {
        null -> "NULL"
        is Boolean -> if (value) "TRUE" else "FALSE"
        is Number -> value.toString()
        else -> "'" + value.toString().replace("'", "''") + "'"
    }
}
