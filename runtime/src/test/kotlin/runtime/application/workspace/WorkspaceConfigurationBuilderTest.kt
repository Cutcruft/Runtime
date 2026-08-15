package runtime.application.workspace

import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull
import org.junit.jupiter.api.Test
import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType
import runtime.domain.models.AppConfig
import runtime.domain.models.AppFields
import runtime.domain.models.AppConfiguration
import runtime.domain.models.ComponentDefinition
import runtime.domain.models.NavigationEntry
import runtime.domain.models.NavigationFields
import runtime.domain.models.PageDefinition
import runtime.domain.models.PageFields
import runtime.domain.models.RegisteredUi
import runtime.domain.models.SectionDefinition
import runtime.domain.models.ThemeConfig
import runtime.domain.models.UiConfig
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.UIDefinition
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry

class WorkspaceConfigurationBuilderTest {

    private val uiConfig = UiConfig(
        mainPlugin = null,
        landingPage = null,
        navigationComponentType = "Navigation",
        pageComponentType = "Page",
        appComponentType = "App",
        shortcutComponentType = "Shortcut",
        subscriptionComponentType = "EventSubscription",
        app = AppConfig(title = "Runtime", logo = null, layout = "topbar"),
        navigationFields = NavigationFields(id = "id", label = "label", pageId = "pageId", order = "order"),
        pageFields = PageFields(id = "id", title = "title", sections = "sections"),
        appFields = AppFields(title = "title", logo = "logo", layout = "layout"),
        theme = ThemeConfig(mode = "light", tokens = emptyMap())
    )

    private fun ui(pluginId: String, componentType: String, config: Map<String, Any>): RegisteredUi =
        RegisteredUi(PluginId(pluginId), object : UIDefinition {
            override val componentType = componentType
            override val config = config
        })

    @Test
    fun `build groups ui definitions and aggregates registries`() {
        val builder = WorkspaceConfigurationBuilder(uiConfig)

        val navigation = ui(
            "demo",
            "Navigation",
            mapOf("id" to "nav", "label" to "Main", "pageId" to "boards", "order" to 1)
        )
        val page = ui(
            "demo",
            "Page",
            mapOf(
                "id" to "boards",
                "title" to "Boards",
                "sections" to listOf(
                    mapOf(
                        "id" to "boards-list",
                        "layout" to "stack",
                        "columns" to 1,
                        "components" to listOf(
                            mapOf("type" to "Table", "config" to mapOf("entityType" to "demo.board"))
                        )
                    )
                )
            )
        )
        val custom = ui("demo", "TaskGrid", mapOf("x" to "y"))

        val commandRegistry = InMemoryCommandRegistry()
        commandRegistry.register(
            PluginId("demo"),
            object : Command("create", "Create something") {
                override suspend fun execute(context: CommandContext, params: Any?): CommandResult =
                    CommandResult.success()
            }
        )

        val entityRegistry = InMemoryEntityRegistry()
        entityRegistry.register(object : EntityDefinition {
            override val type = EntityType("demo.task")
            override val modelClass = String::class.java
        })

        val config = builder.build(
            listOf(navigation, page, custom),
            commandRegistry,
            entityRegistry,
            loadedPluginIds = setOf(PluginId("demo"))
        )

        assertEquals(
            listOf(NavigationEntry("nav", "Main", "boards", 1, "demo")),
            config.navigation
        )
        assertEquals(
            listOf(
                PageDefinition(
                    id = "boards",
                    title = "Boards",
                    sections = listOf(
                        SectionDefinition(
                            id = "boards-list",
                            layout = "stack",
                            columns = 1,
                            components = listOf(ComponentDefinition("Table", mapOf("entityType" to "demo.board")))
                        )
                    )
                )
            ),
            config.pages
        )
        assertEquals(listOf("demo.create"), config.commands.map { it.id })
        assertEquals(listOf("demo.task"), config.entities.map { it.type })
        assertEquals(AppConfiguration("Runtime", null, "topbar", "boards", uiConfig.theme), config.app)
    }

    @Test
    fun `build collects shortcuts and event subscriptions`() {
        val builder = WorkspaceConfigurationBuilder(uiConfig, wsPath = "/ws")

        val shortcut = ui(
            "demo",
            "Shortcut",
            mapOf(
                "id" to "new-task",
                "keys" to listOf("mod+n"),
                "action" to "command",
                "command" to "demo.create",
                "params" to mapOf("title" to "Quick task"),
                "scope" to "global"
            )
        )
        val pageShortcut = ui(
            "demo",
            "Shortcut",
            mapOf("id" to "back", "keys" to listOf("escape"), "action" to "navigate", "page" to "boards")
        )
        val subscription = ui(
            "demo",
            "EventSubscription",
            mapOf(
                "id" to "refresh-tasks",
                "event" to "object.changed",
                "filter" to mapOf("entityType" to "demo.task"),
                "action" to "refresh",
                "target" to "demo.task"
            )
        )
        val toastSubscription = ui(
            "demo",
            "EventSubscription",
            mapOf("id" to "toast-boards", "event" to "project.event", "action" to "toast", "params" to mapOf("message" to "changed"))
        )

        val config = builder.build(
            listOf(shortcut, pageShortcut, subscription, toastSubscription),
            InMemoryCommandRegistry(),
            InMemoryEntityRegistry(),
            loadedPluginIds = setOf(PluginId("demo"))
        )

        assertEquals(2, config.shortcuts.size)
        val newTask = config.shortcuts.first { it.id == "new-task" }
        assertEquals(listOf("mod+n"), newTask.keys)
        assertEquals("command", newTask.action)
        assertEquals("demo.create", newTask.command)
        assertEquals(mapOf("title" to "Quick task"), newTask.params)
        assertEquals("global", newTask.scope)
        assertEquals("navigate", config.shortcuts.first { it.id == "back" }.action)

        assertEquals(2, config.subscriptions.size)
        val refresh = config.subscriptions.first { it.id == "refresh-tasks" }
        assertEquals("object.changed", refresh.event)
        assertEquals(mapOf("entityType" to "demo.task"), refresh.filter)
        assertEquals("refresh", refresh.action)
        assertEquals("demo.task", refresh.target)
        assertEquals("toast", config.subscriptions.first { it.id == "toast-boards" }.action)

        assertEquals("/ws", config.transport.wsPath)
    }

    @Test
    fun `transport wsPath defaults to ws when not provided`() {
        val config = WorkspaceConfigurationBuilder(uiConfig).build(
            emptyList(),
            InMemoryCommandRegistry(),
            InMemoryEntityRegistry(),
            loadedPluginIds = emptySet()
        )
        assertEquals("/ws", config.transport.wsPath)
    }

    @Test
    fun `build uses configurable component type names and field keys`() {
        val builder = WorkspaceConfigurationBuilder(
            uiConfig.copy(
                navigationComponentType = "Menu",
                navigationFields = NavigationFields(id = "key", label = "name", pageId = "target", order = "pos")
            )
        )

        val menu = ui("demo", "Menu", mapOf("key" to "m1", "name" to "Menu 1", "target" to "p1", "pos" to 2))

        val config = builder.build(
            listOf(menu),
            InMemoryCommandRegistry(),
            InMemoryEntityRegistry(),
            loadedPluginIds = setOf(PluginId("demo"))
        )
        assertEquals(listOf(NavigationEntry("m1", "Menu 1", "p1", 2, "demo")), config.navigation)
    }

    @Test
    fun `app shell is read from main plugin app definition`() {
        val builder = WorkspaceConfigurationBuilder(
            uiConfig.copy(mainPlugin = "demo")
        )

        val app = ui(
            "demo",
            "App",
            mapOf("title" to "Board App", "logo" to "logo.png", "layout" to "sidebar")
        )
        val page = ui("demo", "Page", mapOf("id" to "boards", "title" to "Boards"))
        val other = ui(
            "other",
            "Navigation",
            mapOf("id" to "nav-other", "label" to "Other", "pageId" to "other", "order" to 0)
        )

        val config = builder.build(
            listOf(app, page, other),
            InMemoryCommandRegistry(),
            InMemoryEntityRegistry(),
            loadedPluginIds = setOf(PluginId("demo"))
        )

        assertEquals(
            AppConfiguration("Board App", "logo.png", "sidebar", "boards", uiConfig.theme),
            config.app
        )
        assertEquals(listOf("other"), config.navigation.map { it.pluginId })
    }

    @Test
    fun `build fails when main plugin is not loaded`() {
        val builder = WorkspaceConfigurationBuilder(uiConfig.copy(mainPlugin = "missing"))

        assertFailsWith<IllegalArgumentException> {
            builder.build(
                emptyList(),
                InMemoryCommandRegistry(),
                InMemoryEntityRegistry(),
                loadedPluginIds = emptySet()
            )
        }
    }

    @Test
    fun `landing page falls back to first main plugin page then first page`() {
        val builder = WorkspaceConfigurationBuilder(uiConfig)

        val config = builder.build(
            listOf(ui("demo", "Page", mapOf("id" to "boards", "title" to "Boards"))),
            InMemoryCommandRegistry(),
            InMemoryEntityRegistry(),
            loadedPluginIds = setOf(PluginId("demo"))
        )
        assertEquals("boards", config.app.landingPageId)

        val empty = builder.build(
            emptyList(),
            InMemoryCommandRegistry(),
            InMemoryEntityRegistry(),
            loadedPluginIds = emptySet()
        )
        assertNull(empty.app.landingPageId)
    }
}
