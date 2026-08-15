package com.example.demo

import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion
import runtime.domain.plugin.UIDefinition

data class UiComponent(
    override val componentType: String,
    override val config: Map<String, Any>
) : UIDefinition

class DemoPlugin : Plugin() {
    override val info = PluginInfo(
        id = PluginId("demo"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: PluginContext) {
        context.registerEntity(BoardDefinition)
        context.registerEntity(TaskDefinition)

        context.registerCommand(CreateBoardCommand())
        context.registerCommand(ListBoardsCommand())
        context.registerCommand(DeleteBoardCommand())
        context.registerCommand(CreateTaskCommand())
        context.registerCommand(ListTasksCommand())
        context.registerCommand(CompleteTaskCommand())
        context.registerCommand(DeleteTaskCommand())
        context.registerCommand(TaskStatsCommand())

        registerUi(context)
    }

    private fun registerUi(context: PluginContext) {
        context.registerUi(
            UiComponent(
                "App",
                mapOf(
                    "title" to "Board App",
                    "logo" to "logo.png",
                    "layout" to "topbar"
                )
            )
        )

        context.registerUi(
            UiComponent(
                "Page",
                mapOf(
                    "id" to "boards",
                    "title" to "Boards",
                    "sections" to listOf(
                        mapOf(
                            "id" to "boards-stats",
                            "layout" to "grid",
                            "columns" to 3,
                            "components" to listOf(
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "Boards",
                                        "data" to mapOf("command" to "demo.listboards", "entityType" to "demo.board"),
                                        "tone" to "blue"
                                    )
                                ),
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "Open tasks",
                                        "data" to mapOf("command" to "demo.stats", "entityType" to "demo.task"),
                                        "valueKey" to "open",
                                        "tone" to "amber"
                                    )
                                ),
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "Done tasks",
                                        "data" to mapOf("command" to "demo.stats", "entityType" to "demo.task"),
                                        "valueKey" to "done",
                                        "tone" to "green"
                                    )
                                )
                            )
                        ),
                        mapOf(
                            "id" to "boards-list",
                            "layout" to "grid",
                            "columns" to 2,
                            "components" to listOf(
                                mapOf(
                                    "type" to "Card",
                                    "config" to mapOf(
                                        "title" to "Boards",
                                        "subtitle" to "Manage your boards",
                                        "headerActions" to listOf(
                                            mapOf("label" to "New Task", "variant" to "primary", "command" to "demo.create", "params" to mapOf("title" to "Quick task"))
                                        ),
                                        "components" to listOf(
                                            mapOf(
                                                "type" to "Table",
                                                "config" to mapOf(
                                                    "data" to mapOf("command" to "demo.listboards", "entityType" to "demo.board"),
                                                    "deleteCommand" to "demo.deleteboard",
                                                    "searchable" to true,
                                                    "sortable" to true,
                                                    "pagination" to mapOf("pageSize" to 5, "pageSizeOptions" to listOf(5, 10, 25)),
                                                    "showRowCount" to true,
                                                    "columns" to listOf(
                                                        mapOf("key" to "name", "label" to "Name", "sortable" to true),
                                                        mapOf("key" to "description", "label" to "Description")
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                mapOf(
                                    "type" to "Card",
                                    "config" to mapOf(
                                        "title" to "Create Board",
                                        "components" to listOf(
                                            mapOf(
                                                "type" to "Form",
                                                "config" to mapOf(
                                                    "command" to "demo.createboard",
                                                    "submitLabel" to "Create Board",
                                                    "fields" to listOf(
                                                        mapOf("name" to "name", "label" to "Name", "type" to "text", "required" to true),
                                                        mapOf("name" to "description", "label" to "Description", "type" to "textarea")
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        ),
                        mapOf(
                            "id" to "boards-bits",
                            "layout" to "grid",
                            "columns" to 1,
                            "components" to listOf(
                                mapOf(
                                    "type" to "Tabs",
                                    "config" to mapOf(
                                        "activeTab" to "labels",
                                        "tabs" to listOf(
                                            mapOf(
                                                "id" to "labels",
                                                "label" to "Badges",
                                                "components" to listOf(
                                                    mapOf(
                                                        "type" to "Space",
                                                        "config" to mapOf(
                                                            "gap" to "0.5rem",
                                                            "wrap" to true,
                                                            "components" to listOf(
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "Default")),
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "Primary", "tone" to "primary")),
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "Success", "tone" to "green")),
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "Warning", "tone" to "amber")),
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "Danger", "tone" to "red"))
                                                            )
                                                        )
                                                    )
                                                )
                                            ),
                                            mapOf(
                                                "id" to "buttons",
                                                "label" to "Buttons",
                                                "components" to listOf(
                                                    mapOf(
                                                        "type" to "Space",
                                                        "config" to mapOf(
                                                            "gap" to "0.5rem",
                                                            "wrap" to true,
                                                            "components" to listOf(
                                                                mapOf("type" to "Button", "config" to mapOf("label" to "Default")),
                                                                mapOf("type" to "Button", "config" to mapOf("label" to "Primary", "variant" to "primary")),
                                                                mapOf("type" to "Button", "config" to mapOf("label" to "Danger", "variant" to "danger")),
                                                                mapOf("type" to "Button", "config" to mapOf("label" to "Ghost", "variant" to "ghost"))
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Navigation",
                mapOf("id" to "nav-boards", "label" to "Boards", "pageId" to "boards", "order" to 1)
            )
        )

        context.registerUi(
            UiComponent(
                "Page",
                mapOf(
                    "id" to "tasks",
                    "title" to "Tasks",
                    "sections" to listOf(
                        mapOf(
                            "id" to "tasks-stats",
                            "layout" to "grid",
                            "columns" to 3,
                            "components" to listOf(
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "Total tasks",
                                        "data" to mapOf("command" to "demo.list", "entityType" to "demo.task"),
                                        "tone" to "blue"
                                    )
                                ),
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "Open",
                                        "data" to mapOf("command" to "demo.stats", "entityType" to "demo.task"),
                                        "valueKey" to "open",
                                        "tone" to "amber"
                                    )
                                ),
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "Done",
                                        "data" to mapOf("command" to "demo.stats", "entityType" to "demo.task"),
                                        "valueKey" to "done",
                                        "tone" to "green"
                                    )
                                )
                            )
                        ),
                        mapOf(
                            "id" to "tasks-list",
                            "layout" to "grid",
                            "columns" to 1,
                            "components" to listOf(
                                mapOf(
                                    "type" to "Table",
                                    "config" to mapOf(
                                        "data" to mapOf("command" to "demo.list", "entityType" to "demo.task"),
                                        "deleteCommand" to "demo.delete",
                                        "searchable" to true,
                                        "sortable" to true,
                                        "pagination" to mapOf("pageSize" to 5, "pageSizeOptions" to listOf(5, 10, 25)),
                                        "showRowCount" to true,
                                        "rowActions" to listOf(
                                            mapOf(
                                                "label" to "Complete",
                                                "command" to "demo.complete",
                                                "params" to mapOf("id" to "\$row.id"),
                                                "confirm" to "Mark this task as done?"
                                            )
                                        ),
                                        "columns" to listOf(
                                            mapOf("key" to "title", "label" to "Title", "sortable" to true),
                                            mapOf("key" to "status", "label" to "Status", "render" to "badge", "badge" to mapOf("tones" to mapOf("open" to "amber", "done" to "green"))),
                                            mapOf("key" to "boardId", "label" to "Board")
                                        )
                                    )
                                ),
                                mapOf(
                                    "type" to "Form",
                                    "config" to mapOf(
                                        "command" to "demo.create",
                                        "submitLabel" to "Create Task",
                                        "fields" to listOf(
                                            mapOf("name" to "title", "label" to "Title", "type" to "text", "required" to true, "minLength" to 3),
                                            mapOf(
                                                "name" to "boardId",
                                                "label" to "Board",
                                                "type" to "select",
                                                "options" to mapOf(
                                                    "command" to "demo.listboards",
                                                    "valueKey" to "id",
                                                    "labelKey" to "name"
                                                )
                                            ),
                                            mapOf("name" to "description", "label" to "Description", "type" to "textarea", "rows" to 3)
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Navigation",
                mapOf("id" to "nav-tasks", "label" to "Tasks", "pageId" to "tasks", "order" to 2)
            )
        )

        context.registerUi(
            UiComponent(
                "Shortcut",
                mapOf(
                    "id" to "new-task",
                    "keys" to listOf("mod+n"),
                    "action" to "command",
                    "command" to "demo.create",
                    "params" to mapOf("title" to "Quick task")
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Shortcut",
                mapOf(
                    "id" to "goto-tasks",
                    "keys" to listOf("mod+1"),
                    "action" to "navigate",
                    "page" to "tasks"
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Shortcut",
                mapOf(
                    "id" to "goto-boards",
                    "keys" to listOf("mod+2"),
                    "action" to "navigate",
                    "page" to "boards"
                )
            )
        )

        context.registerUi(
            UiComponent(
                "EventSubscription",
                mapOf(
                    "id" to "refresh-boards",
                    "event" to "object.changed",
                    "filter" to mapOf("entityType" to "demo.board"),
                    "action" to "refresh",
                    "target" to "demo.board"
                )
            )
        )
        context.registerUi(
            UiComponent(
                "EventSubscription",
                mapOf(
                    "id" to "refresh-tasks",
                    "event" to "object.changed",
                    "filter" to mapOf("entityType" to "demo.task"),
                    "action" to "refresh",
                    "target" to "demo.task"
                )
            )
        )
        context.registerUi(
            UiComponent(
                "EventSubscription",
                mapOf(
                    "id" to "toast-board-created",
                    "event" to "object.changed",
                    "filter" to mapOf("entityType" to "demo.board"),
                    "action" to "toast",
                    "params" to mapOf("message" to "Board data changed")
                )
            )
        )
        context.registerUi(
            UiComponent(
                "EventSubscription",
                mapOf(
                    "id" to "toast-project-opened",
                    "event" to "project.event",
                    "action" to "toast",
                    "params" to mapOf("message" to "Project opened")
                )
            )
        )
    }
}
