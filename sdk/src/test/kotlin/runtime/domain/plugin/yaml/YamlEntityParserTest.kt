package runtime.domain.plugin.yaml

import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.domain.entity.FieldType

class YamlEntityParserTest {

    @Test
    fun `parses entity schema with typed fields`() {
        val yaml = """
            type: demo.task
            titleField: title
            fields:
              - name: title
                type: string
                required: true
                min: 3
                max: 100
                description: Task title
              - name: status
                type: enum
                enum: [open, done]
              - name: priority
                type: integer
                min: 0
                max: 5
              - name: boardId
                type: reference
                reference: demo.board
              - name: assigneeId
                type: uuid
        """.trimIndent()

        val entity = YamlEntityParser.parse(yaml)
        assertEquals("demo.task", entity.type.value)
        assertEquals(5, entity.schema.fields.size)
        assertTrue(entity.schema.fields.first { it.name == "title" }.required)
        assertEquals(3.0, entity.schema.fields.first { it.name == "title" }.min)
        assertEquals(listOf("open", "done"), entity.schema.fields.first { it.name == "status" }.enumValues)
        assertEquals("demo.board", entity.schema.fields.first { it.name == "boardId" }.reference?.value)
        assertEquals(FieldType.INTEGER, entity.schema.fields.first { it.name == "priority" }.type)
    }

    @Test
    fun `parses default value`() {
        val yaml = """
            type: demo.task
            fields:
              - name: title
                type: string
              - name: status
                type: string
                default: open
        """.trimIndent()
        val entity = YamlEntityParser.parse(yaml)
        assertEquals("open", entity.schema.field("status")?.defaultValue)
    }

    @Test
    fun `throws on missing type`() {
        val yaml = """
            fields:
              - name: title
                type: string
        """.trimIndent()
        val thrown = runCatching { YamlEntityParser.parse(yaml) }.exceptionOrNull()
        assertNotNull(thrown)
        assertTrue(thrown.message?.contains("type") == true)
    }
}
