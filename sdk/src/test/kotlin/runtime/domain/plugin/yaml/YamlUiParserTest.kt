package runtime.domain.plugin.yaml

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test

class YamlUiParserTest {

    @Test
    fun `parses page declaration`() {
        val yaml = """
            Page:
              id: tasks
              title: Tasks
              sections:
                - id: list
                  layout: grid
                  columns: 1
                  components:
                    - type: Table
                      config:
                        data:
                          command: demo.list
                          entityType: demo.task
        """.trimIndent()

        val ui = YamlUiParser.parse(yaml)
        assertEquals(1, ui.size)
        assertEquals("Page", ui[0].componentType)
        val config = ui[0].config
        assertEquals("tasks", config["id"])
        val sections = config["sections"] as List<*>
        val section = sections[0] as Map<*, *>
        val components = section["components"] as List<*>
        val table = components[0] as Map<*, *>
        assertEquals("Table", table["type"])
        val tableConfig = table["config"] as Map<*, *>
        val data = tableConfig["data"] as Map<*, *>
        assertEquals("demo.list", data["command"])
    }

    @Test
    fun `parses navigation and shortcut declarations`() {
        val yaml = """
            Navigation:
              id: nav-tasks
              label: Tasks
              pageId: tasks
              order: 2
            Shortcut:
              id: new-task
              keys: [mod+n]
              action: command
              command: demo.create
        """.trimIndent()

        val ui = YamlUiParser.parse(yaml)
        assertEquals(2, ui.size)
        assertTrue(ui.any { it.componentType == "Navigation" })
        assertTrue(ui.any { it.componentType == "Shortcut" })
    }
}
