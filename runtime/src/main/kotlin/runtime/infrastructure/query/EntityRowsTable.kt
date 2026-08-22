package runtime.infrastructure.query

import org.apache.calcite.DataContext
import org.apache.calcite.config.CalciteConnectionConfig
import org.apache.calcite.linq4j.AbstractEnumerable
import org.apache.calcite.linq4j.Enumerable
import org.apache.calcite.linq4j.Enumerator
import org.apache.calcite.rel.type.RelDataType
import org.apache.calcite.rel.type.RelDataTypeFactory
import org.apache.calcite.schema.ScannableTable
import org.apache.calcite.schema.Schema
import org.apache.calcite.schema.Statistic
import org.apache.calcite.schema.Statistics
import org.apache.calcite.sql.SqlCall
import org.apache.calcite.sql.SqlNode
import org.apache.calcite.sql.type.SqlTypeName

/**
 * A Calcite virtual table backed by in-memory rows derived from a project's
 * entity list. Column types are inferred from the Jackson-serialized values:
 * booleans -> BOOLEAN, integral numbers -> BIGINT, other numbers -> DOUBLE,
 * everything else -> VARCHAR (nullable).
 */
class EntityRowsTable(
    private val columns: List<ColumnDef>
) : ScannableTable {

    data class ColumnDef(
        val name: String,
        val values: List<Any?>
    )

    override fun getRowType(typeFactory: RelDataTypeFactory): RelDataType {
        val builder = typeFactory.builder()
        columns.forEach { col -> builder.add(col.name, columnType(typeFactory, col.values)) }
        return builder.build()
    }

    override fun getStatistic(): Statistic = Statistics.UNKNOWN

    override fun getJdbcTableType(): Schema.TableType = Schema.TableType.TABLE

    override fun isRolledUp(column: String): Boolean = false

    override fun rolledUpColumnValidInsideAgg(
        column: String,
        call: SqlCall,
        node: SqlNode?,
        config: CalciteConnectionConfig?
    ): Boolean = false

    override fun scan(root: DataContext): Enumerable<Array<Any?>> {
        val rowCount = columns.firstOrNull()?.values?.size ?: 0
        val rows: List<Array<Any?>> = (0 until rowCount).map { rowIndex ->
            columns.map { col -> col.values.getOrNull(rowIndex) }.toTypedArray()
        }
        return object : AbstractEnumerable<Array<Any?>>() {
            override fun enumerator(): Enumerator<Array<Any?>> = ArrayEnumerator(rows)
        }
    }

    private class ArrayEnumerator(private val rows: List<Array<Any?>>) : Enumerator<Array<Any?>> {
        private val iterator = rows.iterator()
        private var current: Array<Any?>? = null

        override fun current(): Array<Any?> = current ?: throw IllegalStateException("Enumerator not positioned")
        override fun moveNext(): Boolean {
            if (!iterator.hasNext()) {
                current = null
                return false
            }
            current = iterator.next()
            return true
        }

        override fun reset() = Unit
        override fun close() = Unit
    }

    companion object {
        fun columnType(typeFactory: RelDataTypeFactory, values: List<Any?>): RelDataType {
            val nonNull = values.filterNotNull()
            if (nonNull.isEmpty()) return typeFactory.createSqlType(SqlTypeName.VARCHAR)
            val nullable = values.any { it == null }
            fun base(type: SqlTypeName) = typeFactory.createTypeWithNullability(typeFactory.createSqlType(type), nullable)
            return when {
                nonNull.all { it is Boolean } -> base(SqlTypeName.BOOLEAN)
                nonNull.all { it is Byte || it is Short || it is Int || it is Long } -> base(SqlTypeName.BIGINT)
                nonNull.all { it is Number } -> base(SqlTypeName.DOUBLE)
                else -> typeFactory.createTypeWithNullability(typeFactory.createSqlType(SqlTypeName.VARCHAR), true)
            }
        }
    }
}
