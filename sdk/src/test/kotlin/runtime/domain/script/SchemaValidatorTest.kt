package runtime.domain.script

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.domain.entity.EntityField
import runtime.domain.entity.EntitySchema
import runtime.domain.entity.EntityType
import runtime.domain.entity.FieldType

class SchemaValidatorTest {

    private val schema = EntitySchema(
        entityType = EntityType("demo.task"),
        titleField = "title",
        fields = listOf(
            EntityField("title", FieldType.STRING, required = true, min = 3.0, max = 100.0),
            EntityField("status", FieldType.ENUM, enumValues = listOf("open", "done")),
            EntityField("priority", FieldType.INTEGER, min = 0.0, max = 5.0),
            EntityField("assigneeId", FieldType.UUID),
            EntityField("boardId", FieldType.REFERENCE, reference = EntityType("demo.board"))
        )
    )

    @Test
    fun `required field missing produces required error`() {
        val errors = SchemaValidator.validate(schema, mapOf("status" to "open"), includeId = false)
        assertTrue(errors.any { it.field == "title" && it.code == "required" })
    }

    @Test
    fun `minLength enforced`() {
        val errors = SchemaValidator.validate(schema, mapOf("title" to "ab", "status" to "open"), includeId = false)
        assertTrue(errors.any { it.field == "title" && it.code == "minLength" })
    }

    @Test
    fun `enum enforced`() {
        val errors = SchemaValidator.validate(schema, mapOf("title" to "valid", "status" to "archived"), includeId = false)
        assertTrue(errors.any { it.field == "status" && it.code == "enum" })
    }

    @Test
    fun `integer type enforced`() {
        val errors = SchemaValidator.validate(schema, mapOf("title" to "valid", "priority" to 1.5), includeId = false)
        assertTrue(errors.any { it.field == "priority" && it.code == "type" })
    }

    @Test
    fun `uuid enforced`() {
        val errors = SchemaValidator.validate(schema, mapOf("title" to "valid", "assigneeId" to "nope"), includeId = false)
        assertTrue(errors.any { it.field == "assigneeId" && it.code == "uuid" })
    }

    @Test
    fun `valid model passes`() {
        val errors = SchemaValidator.validate(
            schema,
            mapOf("title" to "Valid task", "status" to "done", "priority" to 2, "boardId" to "11111111-1111-4111-8111-111111111111"),
            includeId = false
        )
        assertTrue(errors.isEmpty())
    }

    @Test
    fun `multiple errors reported together`() {
        val errors = SchemaValidator.validate(schema, mapOf("title" to "ab", "status" to "x"), includeId = false)
        assertTrue(errors.size >= 2)
    }
}
