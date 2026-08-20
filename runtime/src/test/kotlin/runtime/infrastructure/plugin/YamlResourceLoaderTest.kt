package runtime.infrastructure.plugin

import java.io.File
import java.util.jar.JarEntry
import java.util.jar.JarOutputStream
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.domain.entity.SchemaEntityDefinition
import runtime.domain.plugin.yaml.YamlMessagesParser
import runtime.domain.plugin.yaml.YamlPluginLoader
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry

class YamlResourceLoaderTest {

    /** Builds an in-memory JAR with the given resource paths → content. */
    private fun buildJar(entries: Map<String, String>): File {
        val file = File.createTempFile("yaml-plugin", ".jar")
        file.deleteOnExit()
        JarOutputStream(file.outputStream()).use { out ->
            for ((path, content) in entries) {
                out.putNextEntry(JarEntry(path))
                out.write(content.toByteArray())
                out.closeEntry()
            }
        }
        return file
    }

    private val entitiesYaml = """
        type: demo.note
        titleField: title
        fields:
          - name: title
            type: string
            required: true
            min: 3
          - name: body
            type: text
          - name: status
            type: enum
            enum: [draft, published]
            default: draft
    """.trimIndent()

    private val commandsYaml = """
        script:
          name: ping
          description: Ping command
          group: Utils
          code: |
            fun run(context: runtime.domain.command.CommandContext, params: Any?): Any? {
                return mapOf("pong" to true)
            }
    """.trimIndent()

    private val uiYaml = """
        Page:
          id: notes
          title: Notes
          sections:
            - id: list
              layout: grid
              columns: 1
              components:
                - type: Table
                  config:
                    data:
                      command: demo.notelist
                      entityType: demo.note
        Navigation:
          id: nav-notes
          label: Notes
          pageId: notes
          order: 1
          group: Overview
    """.trimIndent()

    private val messagesYaml = """
        locale: en
        messages:
          demo.note.title: Note
          demo.page.notes: Notes
    """.trimIndent()

    @Test
    fun `loader registers entities commands and ui from jar`() {
        val jar = buildJar(
            mapOf(
                "yaml/plugin.yaml" to "id: yaml-demo\nversion: 1.0.0\napiVersion: 1\n",
                "yaml/entities/note.yaml" to entitiesYaml,
                "yaml/commands/note.yaml" to commandsYaml,
                "yaml/ui/pages.yaml" to uiYaml,
                "yaml/messages/en.yaml" to messagesYaml
            )
        )
        val resourceLoader = YamlResourceLoader()
        val entries = resourceLoader.listYamlEntries(jar.absolutePath)
        assertEquals(5, entries.size)

        val entityRegistry: EntityRegistry = InMemoryEntityRegistry()
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()

        // Mirror PluginBootstrap wiring: YAML CRUD delegates to SchemaCrudCommands.
        runtime.domain.plugin.yaml.YamlCommandParser.crudFactory = { entity, prefix, group ->
            val schema = entityRegistry.get(entity)?.schema
                ?: throw IllegalArgumentException("Auto-CRUD for '$entity' requires a registered schema entity")
            listOf(
                runtime.domain.script.SchemaCrudCommands.create(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.update(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.delete(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.list(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.validate(schema, prefix, group)
            )
        }

        // Manual bootstrap mimicking PluginBootstrap YAML loading.
        var entityCount = 0
        var commandCount = 0
        var uiCount = 0
        for (entry in entries) {
            val content = resourceLoader.readEntry(jar.absolutePath, entry) ?: continue
            when {
                entry.contains("/entities/") -> {
                    val entity = runtime.domain.plugin.yaml.YamlEntityParser.parse(content)
                    entityRegistry.register(entity)
                    entityCount++
                }
                entry.contains("/commands/") -> {
                    val resolver: (String) -> String? = { resourceLoader.readEntry(jar.absolutePath, it) }
                    val commands = runtime.domain.plugin.yaml.YamlCommandParser.parse(content, "yaml-demo", resolver)
                    commands.forEach { commandRegistry.register(runtime.domain.plugin.PluginId("yaml-demo"), it) }
                    commandCount += commands.size
                }
                entry.contains("/ui/") -> {
                    val ui = runtime.domain.plugin.yaml.YamlUiParser.parse(content)
                    uiCount += ui.size
                }
                entry.contains("/messages/") -> {
                    val catalog = YamlMessagesParser.parse(content)
                    assertEquals("Note", catalog["en"]?.get("demo.note.title"))
                }
            }
        }

        assertEquals(1, entityCount)
        assertEquals(1, commandCount)
        assertEquals(2, uiCount)

        val entity = entityRegistry.get(runtime.domain.entity.EntityType("demo.note"))
        assertTrue(entity is SchemaEntityDefinition)
        assertEquals(3, (entity as SchemaEntityDefinition).schema.fields.size)
        assertTrue(commandRegistry.get("yaml-demo.ping") != null)
    }

    @Test
    fun `auto crud commands are generated from yaml entity`() {
        val jar = buildJar(
            mapOf(
                "yaml/entities/note.yaml" to entitiesYaml,
                "yaml/commands/note.yaml" to "crud:\n  entity: demo.note\n  prefix: note\n"
            )
        )
        val resourceLoader = YamlResourceLoader()
        val entries = resourceLoader.listYamlEntries(jar.absolutePath)

        val entityRegistry: EntityRegistry = InMemoryEntityRegistry()
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()

        runtime.domain.plugin.yaml.YamlCommandParser.crudFactory = { entity, prefix, group ->
            val schema = entityRegistry.get(entity)?.schema
                ?: throw IllegalArgumentException("Auto-CRUD for '$entity' requires a registered schema entity")
            listOf(
                runtime.domain.script.SchemaCrudCommands.create(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.update(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.delete(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.list(schema, prefix, group),
                runtime.domain.script.SchemaCrudCommands.validate(schema, prefix, group)
            )
        }

        var commandCount = 0
        // Entities first (CRUD generation depends on registered schemas), then commands.
        for (entry in entries) {
            val content = resourceLoader.readEntry(jar.absolutePath, entry) ?: continue
            if (entry.contains("/entities/")) {
                entityRegistry.register(runtime.domain.plugin.yaml.YamlEntityParser.parse(content))
            }
        }
        for (entry in entries) {
            val content = resourceLoader.readEntry(jar.absolutePath, entry) ?: continue
            if (entry.contains("/commands/")) {
                val resolver: (String) -> String? = { resourceLoader.readEntry(jar.absolutePath, it) }
                val commands = runtime.domain.plugin.yaml.YamlCommandParser.parse(content, "yaml-demo", resolver)
                commands.forEach { commandRegistry.register(runtime.domain.plugin.PluginId("yaml-demo"), it) }
                commandCount = commands.size
            }
        }

        assertEquals(5, commandCount)
        listOf("yaml-demo.notecreate", "yaml-demo.noteupdate", "yaml-demo.notedelete", "yaml-demo.notelist", "yaml-demo.notevalidate").forEach {
            assertTrue(commandRegistry.get(it) != null, "missing $it")
        }
    }
}
