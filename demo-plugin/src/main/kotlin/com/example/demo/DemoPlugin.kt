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
        context.registerEntity(DocumentDefinition)
        context.registerEntity(ScriptDefinition)

        context.registerCommand(CreateBoardCommand())
        context.registerCommand(ListBoardsCommand())
        context.registerCommand(DeleteBoardCommand())
        context.registerCommand(CreateTaskCommand())
        context.registerCommand(ListTasksCommand())
        context.registerCommand(CompleteTaskCommand())
        context.registerCommand(ReopenTaskCommand())
        context.registerCommand(DeleteTaskCommand())
        context.registerCommand(TaskStatsCommand())
        context.registerCommand(TaskReportCommand())
        context.registerCommand(ReorderTasksCommand())

        context.registerCommand(TaskScript.createCommand())
        context.registerCommand(TaskScript.updateCommand())
        context.registerCommand(TaskScript.deleteCommand())
        context.registerCommand(TaskScript.validateCommand())

        context.registerDataSource(EchoDataSource())
        context.registerCommand(EchoCommand())
        context.registerCommand(SeedTasksPipeline())
        context.registerCommand(PipelineWithInput())
        context.registerCommand(IgnoreErrorPipeline())
        context.registerCommand(FailFastPipeline())
        context.registerCommand(CreateDocumentCommand())
        context.registerCommand(ListDocumentsCommand())
        context.registerCommand(LoadDocumentCommand())
        context.registerCommand(SaveDocumentCommand())
        context.registerCommand(MentionsCommand())
        context.registerCommand(RunScriptCommand())
        context.registerCommand(CreateScriptCommand())
        context.registerCommand(UpdateScriptCommand())
        context.registerCommand(DeleteScriptCommand())
        context.registerCommand(ListScriptsCommand())
        context.registerCommand(ValidateScriptCommand())

        registerUi(context)
    }

    private fun registerUi(context: PluginContext) {
        context.registerUi(
            UiComponent(
                "App",
                mapOf(
                    "title" to "{{demo.app.title}}",
                    "logo" to "logo.png",
                    "layout" to "sidebar",
                    "shell" to mapOf(
                        "topbar" to mapOf(
                            "brand" to true,
                            "actions" to listOf(
                                mapOf("id" to "nav-tasks", "icon" to "☑", "label" to "{{demo.page.tasks}}", "action" to "navigate", "page" to "tasks"),
                                mapOf("id" to "nav-boards", "icon" to "▦", "label" to "{{demo.page.boards}}", "action" to "navigate", "page" to "boards")
                            )
                        )
                    )
                )
            )
        )

        context.registerUi(
            UiComponent(
                "Page",
                mapOf(
                    "id" to "boards",
                    "title" to "{{demo.page.boards}}",
                    "sections" to listOf(
                        mapOf(
                            "id" to "boards-stats",
                            "layout" to "grid",
                            "columns" to 3,
                            "components" to listOf(
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "{{demo.boards.stat.boards}}",
                                        "data" to mapOf("command" to "demo.listboards", "entityType" to "demo.board"),
                                        "tone" to "blue"
                                    )
                                ),
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "{{demo.boards.stat.open}}",
                                        "data" to mapOf("command" to "demo.stats", "entityType" to "demo.task"),
                                        "valueKey" to "open",
                                        "tone" to "amber"
                                    )
                                ),
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "{{demo.boards.stat.done}}",
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
                                        "title" to "{{demo.boards.card.title}}",
                                        "subtitle" to "{{demo.boards.card.subtitle}} · {{demo.app.edition}}",
                                        "headerActions" to listOf(
                                            mapOf("label" to "{{demo.boards.newTask}}", "variant" to "primary", "command" to "demo.create", "params" to mapOf("title" to "Quick task"))
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
                                                        mapOf("key" to "name", "label" to "{{demo.boards.col.name}}", "sortable" to true),
                                                        mapOf("key" to "description", "label" to "{{demo.boards.col.description}}")
                                                    )
                                                )
                                            )
                                        )
                                    )
                                ),
                                mapOf(
                                    "type" to "Card",
                                    "config" to mapOf(
                                        "title" to "{{demo.boards.create.title}}",
                                        "components" to listOf(
                                            mapOf(
                                                "type" to "Form",
                                                "config" to mapOf(
                                                    "command" to "demo.createboard",
                                                    "submitLabel" to "{{demo.boards.create.submit}}",
                                                    "fields" to listOf(
                                                        mapOf("name" to "name", "label" to "{{demo.boards.create.name}}", "type" to "text", "required" to true),
                                                        mapOf("name" to "description", "label" to "{{demo.boards.create.description}}", "type" to "textarea")
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
                                                "label" to "{{demo.tabs.badges}}",
                                                "components" to listOf(
                                                    mapOf(
                                                        "type" to "Space",
                                                        "config" to mapOf(
                                                            "gap" to "0.5rem",
                                                            "wrap" to true,
                                                            "components" to listOf(
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "{{demo.badge.default}}")),
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "{{demo.badge.primary}}", "tone" to "primary")),
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "{{demo.badge.success}}", "tone" to "green")),
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "{{demo.badge.warning}}", "tone" to "amber")),
                                                                mapOf("type" to "Badge", "config" to mapOf("text" to "{{demo.badge.danger}}", "tone" to "red"))
                                                            )
                                                        )
                                                    )
                                                )
                                            ),
                                            mapOf(
                                                "id" to "buttons",
                                                "label" to "{{demo.tabs.buttons}}",
                                                "components" to listOf(
                                                    mapOf(
                                                        "type" to "Space",
                                                        "config" to mapOf(
                                                            "gap" to "0.5rem",
                                                            "wrap" to true,
                                                            "components" to listOf(
                                                                mapOf("type" to "Button", "config" to mapOf("label" to "{{demo.button.default}}")),
                                                                mapOf("type" to "Button", "config" to mapOf("label" to "{{demo.button.primary}}", "variant" to "primary")),
                                                                mapOf("type" to "Button", "config" to mapOf("label" to "{{demo.button.danger}}", "variant" to "danger")),
                                                                mapOf("type" to "Button", "config" to mapOf("label" to "{{demo.button.ghost}}", "variant" to "ghost"))
                                                            )
                                                        )
                                                    )
                                                )
                                            ),
                                            mapOf(
                                                "id" to "widgets",
                                                "label" to "{{demo.tabs.widgets}}",
                                                "components" to listOf(
                                                    mapOf(
                                                        "type" to "Space",
                                                        "config" to mapOf(
                                                            "gap" to "0.5rem",
                                                            "align" to "center",
                                                            "components" to listOf(
                                                                mapOf("type" to "Avatar", "config" to mapOf("name" to "Alice Chen")),
                                                                mapOf("type" to "Avatar", "config" to mapOf("name" to "Bob Müller", "tone" to "blue")),
                                                                mapOf("type" to "Avatar", "config" to mapOf("src" to "assets/icon-logo.svg", "tone" to "green")),
                                                                mapOf("type" to "Avatar", "config" to mapOf("fallback" to "CK", "tone" to "purple"))
                                                            )
                                                        )
                                                    ),
                                                    mapOf(
                                                        "type" to "Progress",
                                                        "config" to mapOf(
                                                            "value" to 42,
                                                            "showLabel" to true,
                                                            "tone" to "green",
                                                            "data" to mapOf("command" to "demo.stats", "entityType" to "demo.task"),
                                                            "valueKey" to "donePercent"
                                                        )
                                                    ),
                                                    mapOf(
                                                        "type" to "Accordion",
                                                        "config" to mapOf(
                                                            "items" to listOf(
                                                                mapOf(
                                                                    "id" to "faq-1",
                                                                    "label" to "{{demo.acc.q1}}",
                                                                    "open" to true,
                                                                    "components" to listOf(mapOf("type" to "Text", "config" to mapOf("text" to "{{demo.acc.a1}}")))
                                                                ),
                                                                mapOf(
                                                                    "id" to "faq-2",
                                                                    "label" to "{{demo.acc.q2}}",
                                                                    "components" to listOf(mapOf("type" to "Text", "config" to mapOf("text" to "{{demo.acc.a2}}")))
                                                                )
                                                            )
                                                        )
                                                    ),
                                                    mapOf(
                                                        "type" to "List",
                                                        "config" to mapOf(
                                                            "data" to mapOf("command" to "demo.list", "entityType" to "demo.task"),
                                                            "labelField" to "title",
                                                            "valueField" to "status",
                                                            "sortable" to true,
                                                            "actions" to listOf(
                                                                mapOf(
                                                                    "event" to "reorder",
                                                                    "spec" to mapOf("action" to "command", "command" to "demo.reordertasks", "params" to mapOf("ids" to "\$payload.ids"))
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
        )
        context.registerUi(
            UiComponent(
                "Navigation",
                mapOf("id" to "nav-boards", "label" to "{{demo.page.boards}}", "pageId" to "boards", "order" to 1, "group" to "{{demo.nav.group.overview}}", "icon" to "assets/icon-logo.svg")
            )
        )

        context.registerUi(
            UiComponent(
                "Page",
                mapOf(
                    "id" to "tasks",
                    "title" to "{{demo.page.tasks}}",
                    "sections" to listOf(
                        mapOf(
                            "id" to "tasks-stats",
                            "layout" to "grid",
                            "columns" to 3,
                            "components" to listOf(
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "{{demo.tasks.stat.total}}",
                                        "data" to mapOf("command" to "demo.list", "entityType" to "demo.task"),
                                        "tone" to "blue"
                                    )
                                ),
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "{{demo.tasks.stat.open}}",
                                        "data" to mapOf("command" to "demo.stats", "entityType" to "demo.task"),
                                        "valueKey" to "open",
                                        "tone" to "amber"
                                    )
                                ),
                                mapOf(
                                    "type" to "Stat",
                                    "config" to mapOf(
                                        "label" to "{{demo.tasks.stat.done}}",
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
                                                "label" to "{{demo.tasks.complete}}",
                                                "command" to "demo.complete",
                                                "params" to mapOf("id" to "\$row.id"),
                                                "confirm" to "{{demo.tasks.complete.confirm}}"
                                            ),
                                            mapOf(
                                                "label" to "{{demo.tasks.reopen}}",
                                                "command" to "demo.reopentask",
                                                "entityType" to "demo.task",
                                                "fields" to mapOf("id" to "\$row.id"),
                                                "disabledWhen" to mapOf("status" to "open")
                                            )
                                        ),
                                        "columns" to listOf(
                                            mapOf("key" to "title", "label" to "{{demo.tasks.col.title}}", "sortable" to true),
                                            mapOf("key" to "status", "label" to "{{demo.tasks.col.status}}", "render" to "badge", "badge" to mapOf("tones" to mapOf("open" to "amber", "done" to "green"))),
                                            mapOf("key" to "boardId", "label" to "{{demo.tasks.col.board}}")
                                        )
                                    )
                                ),
                                mapOf(
                                    "type" to "Form",
                                    "config" to mapOf(
                                        "command" to "demo.create",
                                        "submitLabel" to "{{demo.tasks.create.submit}}",
                                        "fields" to listOf(
                                            mapOf("name" to "title", "label" to "{{demo.tasks.field.title}}", "type" to "text", "required" to true, "minLength" to 3),
                                            mapOf(
                                                "name" to "boardId",
                                                "label" to "{{demo.tasks.field.board}}",
                                                "type" to "select",
                                                "options" to mapOf(
                                                    "command" to "demo.listboards",
                                                    "valueKey" to "id",
                                                    "labelKey" to "name"
                                                )
                                            ),
                                            mapOf("name" to "description", "label" to "{{demo.tasks.field.description}}", "type" to "textarea", "rows" to 3)
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
                mapOf("id" to "nav-tasks", "label" to "{{demo.page.tasks}}", "pageId" to "tasks", "order" to 2, "group" to "{{demo.nav.group.overview}}", "icon" to "☑")
            )
        )

        registerEditorPages(context)

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
                    "params" to mapOf("message" to "{{demo.toast.boardChanged}}")
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
                    "params" to mapOf("message" to "{{demo.toast.projectOpened}}")
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Overlay",
                mapOf(
                    "id" to "task-row-menu",
                    "kind" to "menu",
                    "items" to listOf(
                        mapOf(
                            "label" to "{{demo.tasks.menu.complete}}",
                            "icon" to "✓",
                            "command" to "demo.complete",
                            "params" to mapOf("id" to "\$row.id"),
                            "confirm" to "{{demo.tasks.complete.confirm}}"
                        ),
                        mapOf(
                            "label" to "{{demo.tasks.menu.delete}}",
                            "icon" to "✕",
                            "command" to "demo.delete",
                            "params" to mapOf("id" to "\$row.id"),
                            "confirm" to "{{demo.tasks.menu.delete.confirm}}",
                            "danger" to true
                        ),
                        mapOf("divider" to true),
                        mapOf(
                            "label" to "{{demo.tasks.menu.copy}}",
                            "icon" to "⧉",
                            "spec" to mapOf("action" to "copyToClipboard", "value" to "\$row.title")
                        ),
                        mapOf(
                            "label" to "{{demo.tasks.menu.modal}}",
                            "icon" to "▣",
                            "spec" to mapOf("action" to "openModal", "overlay" to "task-details-modal")
                        )
                    )
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Overlay",
                mapOf(
                    "id" to "task-details-modal",
                    "kind" to "modal",
                    "title" to "{{demo.tasks.details.title}}",
                    "width" to "min(90vw, 28rem)",
                    "content" to mapOf(
                        "type" to "Text",
                        "config" to mapOf(
                            "text" to "{{demo.tasks.details.text}}"
                        )
                    )
                )
            )
        )
        context.registerUi(
            UiComponent(
                "OverlayTrigger",
                mapOf(
                    "event" to "contextmenu",
                    "componentType" to "Table",
                    "objectType" to "demo.task",
                    "overlay" to "task-row-menu"
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Overlay",
                mapOf(
                    "id" to "diagram-node-menu",
                    "kind" to "menu",
                    "items" to listOf(
                        mapOf(
                            "label" to "{{demo.diagram.menu.duplicate}}",
                            "icon" to "⧉",
                            "spec" to mapOf(
                                "action" to "editor",
                                "editor" to "diagram",
                                "command" to "duplicate",
                                "params" to mapOf("id" to "\$row.id")
                            )
                        ),
                        mapOf("divider" to true),
                        mapOf(
                            "label" to "{{demo.diagram.menu.delete}}",
                            "icon" to "✕",
                            "spec" to mapOf(
                                "action" to "editor",
                                "editor" to "diagram",
                                "command" to "delete",
                                "params" to mapOf("id" to "\$row.id")
                            ),
                            "confirm" to "{{demo.diagram.menu.delete.confirm}}",
                            "danger" to true
                        )
                    )
                )
            )
        )
        context.registerUi(
            UiComponent(
                "OverlayTrigger",
                mapOf(
                    "event" to "contextmenu",
                    "objectType" to "diagram.node",
                    "overlay" to "diagram-node-menu"
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Overlay",
                mapOf(
                    "id" to "canvas-element-menu",
                    "kind" to "menu",
                    "items" to listOf(
                        mapOf(
                            "label" to "{{demo.canvas.menu.front}}",
                            "icon" to "⇡",
                            "spec" to mapOf(
                                "action" to "editor",
                                "editor" to "canvas",
                                "command" to "front",
                                "params" to mapOf("id" to "\$row.id")
                            )
                        ),
                        mapOf(
                            "label" to "{{demo.canvas.menu.back}}",
                            "icon" to "⇣",
                            "spec" to mapOf(
                                "action" to "editor",
                                "editor" to "canvas",
                                "command" to "back",
                                "params" to mapOf("id" to "\$row.id")
                            )
                        ),
                        mapOf(
                            "label" to "{{demo.canvas.menu.duplicate}}",
                            "icon" to "⧉",
                            "spec" to mapOf(
                                "action" to "editor",
                                "editor" to "canvas",
                                "command" to "duplicate",
                                "params" to mapOf("id" to "\$row.id")
                            )
                        ),
                        mapOf("divider" to true),
                        mapOf(
                            "label" to "{{demo.canvas.menu.delete}}",
                            "icon" to "✕",
                            "spec" to mapOf(
                                "action" to "editor",
                                "editor" to "canvas",
                                "command" to "delete",
                                "params" to mapOf("id" to "\$row.id")
                            ),
                            "confirm" to "{{demo.canvas.menu.delete.confirm}}",
                            "danger" to true
                        )
                    )
                )
            )
        )
        context.registerUi(
            UiComponent(
                "OverlayTrigger",
                mapOf(
                    "event" to "contextmenu",
                    "objectType" to "canvas.element",
                    "overlay" to "canvas-element-menu"
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Overlay",
                mapOf(
                    "id" to "scene-object-menu",
                    "kind" to "menu",
                    "items" to listOf(
                        mapOf(
                            "label" to "{{demo.scene.menu.duplicate}}",
                            "icon" to "⧉",
                            "spec" to mapOf(
                                "action" to "editor",
                                "editor" to "scene3d",
                                "command" to "duplicate",
                                "params" to mapOf("id" to "\$row.id")
                            )
                        ),
                        mapOf("divider" to true),
                        mapOf(
                            "label" to "{{demo.scene.menu.delete}}",
                            "icon" to "✕",
                            "spec" to mapOf(
                                "action" to "editor",
                                "editor" to "scene3d",
                                "command" to "delete",
                                "params" to mapOf("id" to "\$row.id")
                            ),
                            "confirm" to "{{demo.scene.menu.delete.confirm}}",
                            "danger" to true
                        )
                    )
                )
            )
        )
        context.registerUi(
            UiComponent(
                "OverlayTrigger",
                mapOf(
                    "event" to "contextmenu",
                    "objectType" to "scene3d.object",
                    "overlay" to "scene-object-menu"
                )
            )
        )
    }

    private fun registerEditorPages(context: PluginContext) {
        context.registerUi(
            UiComponent(
                "Page",
                mapOf(
                    "id" to "docs",
                    "title" to "{{demo.page.docs}}",
                    "sections" to listOf(
                        mapOf(
                            "id" to "docs-editor",
                            "layout" to "grid",
                            "columns" to 1,
                            "components" to listOf(
                                mapOf(
                                    "type" to "richtext",
                                    "config" to mapOf(
                                        "content" to mapOf("command" to "demo.loaddocument", "params" to mapOf("id" to DOC_NOTES)),
                                        "save" to mapOf("command" to "demo.savedocument", "params" to mapOf("id" to DOC_NOTES, "title" to "Notes")),
                                        "height" to "70vh",
                                        "placeholder" to "{{demo.docs.placeholder}}",
                                        "toolbar" to listOf(
                                            "undo", "redo", "heading1", "heading2", "heading3",
                                            "bold", "italic", "underline", "strike", "code",
                                            "bulletList", "orderedList", "taskList",
                                            "blockquote", "codeBlock", "link", "image", "table"
                                        ),
                                        "extensions" to listOf(
                                            mapOf("name" to "placeholder"),
                                            mapOf("name" to "link"),
                                            mapOf("name" to "image"),
                                            mapOf("name" to "task"),
                                            mapOf("name" to "table"),
                                            mapOf("name" to "heading")
                                        ),
                                        "mentions" to mapOf("command" to "demo.mentions")
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
                "Page",
                mapOf(
                    "id" to "diagram",
                    "title" to "{{demo.page.diagram}}",
                    "sections" to listOf(
                        mapOf(
                            "id" to "diagram-editor",
                            "layout" to "grid",
                            "columns" to 1,
                            "components" to listOf(
                                mapOf(
                                    "type" to "diagram",
                                    "config" to mapOf(
                                        "id" to "diagram-editor",
                                        "content" to mapOf("command" to "demo.loaddocument", "params" to mapOf("id" to DOC_DIAGRAM)),
                                        "save" to mapOf("command" to "demo.savedocument", "params" to mapOf("id" to DOC_DIAGRAM, "title" to "Diagram")),
                                        "height" to "70vh",
                                        "grid" to true,
                                        "panning" to true,
                                        "mousewheel" to true,
                                        "layout" to mapOf("type" to "dagre", "gapX" to 40, "gapY" to 60),
                                        "stencil" to mapOf(
                                            "nodes" to listOf(
                                                mapOf("shape" to "rect", "label" to "{{demo.stencil.rect}}", "fill" to "#f6f8fb"),
                                                mapOf("shape" to "ellipse", "label" to "{{demo.stencil.ellipse}}", "fill" to "#eef4ff"),
                                                mapOf("shape" to "rect", "label" to "{{demo.stencil.process}}", "fill" to "#e7f6ec", "stroke" to "#10b981"),
                                                mapOf("shape" to "rect", "label" to "{{demo.stencil.decision}}", "fill" to "#fef3c7", "stroke" to "#f59e0b")
                                            )
                                        ),
                                        "toolbar" to listOf("undo", "redo", "addRect", "addEllipse", "addEdge", "layout", "fit", "delete")
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
                "Page",
                mapOf(
                    "id" to "scene",
                    "title" to "{{demo.page.scene}}",
                    "sections" to listOf(
                        mapOf(
                            "id" to "scene-editor",
                            "layout" to "grid",
                            "columns" to 1,
                            "components" to listOf(
                                mapOf(
                                    "type" to "scene3d",
                                    "config" to mapOf(
                                        "id" to "scene-editor",
                                        "content" to mapOf("command" to "demo.loaddocument", "params" to mapOf("id" to DOC_SCENE)),
                                        "save" to mapOf("command" to "demo.savedocument", "params" to mapOf("id" to DOC_SCENE, "title" to "Scene")),
                                        "height" to "70vh",
                                        "background" to "#eef2f7",
                                        "grid" to true,
                                        "autoRotate" to false,
                                        "camera" to mapOf("fov" to 50, "position" to listOf(4, 3.5, 5), "target" to listOf(0, 0, 0)),
                                        "lights" to mapOf("ambient" to mapOf("intensity" to 0.7), "directional" to mapOf("intensity" to 1.2, "position" to listOf(5, 8, 6))),
                                        "fog" to mapOf("color" to "#eef2f7", "near" to 10, "far" to 26),
                                        "toolbar" to listOf("addBox", "addSphere", "addCylinder", "delete", "resetCamera")
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
                "Page",
                mapOf(
                    "id" to "board",
                    "title" to "{{demo.page.board}}",
                    "sections" to listOf(
                        mapOf(
                            "id" to "board-editor",
                            "layout" to "grid",
                            "columns" to 1,
                            "components" to listOf(
                                mapOf(
                                    "type" to "canvas",
                                    "config" to mapOf(
                                        "id" to "board-editor",
                                        "content" to mapOf("command" to "demo.loaddocument", "params" to mapOf("id" to DOC_BOARD)),
                                        "save" to mapOf("command" to "demo.savedocument", "params" to mapOf("id" to DOC_BOARD, "title" to "Whiteboard")),
                                        "height" to "70vh",
                                        "grid" to true,
                                        "colors" to listOf("#111827", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"),
                                        "widths" to listOf(2, 4, 8),
                                        "tool" to "draw",
                                        "toolbar" to listOf("undo", "redo", "select", "pan", "draw", "erase", "rect", "ellipse", "line", "arrow", "front", "back", "clear")
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
                mapOf("id" to "nav-docs", "label" to "{{demo.page.docs}}", "pageId" to "docs", "order" to 3, "group" to "{{demo.nav.group.editors}}", "icon" to "✎")
            )
        )
        context.registerUi(
            UiComponent(
                "Navigation",
                mapOf("id" to "nav-diagram", "label" to "{{demo.page.diagram}}", "pageId" to "diagram", "order" to 4, "group" to "{{demo.nav.group.editors}}", "icon" to "◫")
            )
        )
        context.registerUi(
            UiComponent(
                "Navigation",
                mapOf("id" to "nav-scene", "label" to "{{demo.page.scene}}", "pageId" to "scene", "order" to 5, "group" to "{{demo.nav.group.editors}}", "icon" to "◈")
            )
        )
        context.registerUi(
            UiComponent(
                "Navigation",
                mapOf("id" to "nav-board", "label" to "{{demo.page.board}}", "pageId" to "board", "order" to 6, "group" to "{{demo.nav.group.editors}}", "icon" to "✏")
            )
        )
    }
}
