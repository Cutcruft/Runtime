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

        context.registerUi(UiComponent("Page", mapOf("id" to "boards", "title" to "Boards")))
        context.registerUi(UiComponent("Navigation", mapOf("id" to "nav-boards", "label" to "Boards", "pageId" to "boards")))
        context.registerUi(UiComponent("Table", mapOf("pageId" to "boards", "entityType" to "demo.board")))
        context.registerUi(UiComponent("Button", mapOf("label" to "New Board", "command" to "demo.createboard")))

        context.registerUi(UiComponent("Page", mapOf("id" to "tasks", "title" to "Tasks")))
        context.registerUi(UiComponent("Navigation", mapOf("id" to "nav-tasks", "label" to "Tasks", "pageId" to "tasks")))
        context.registerUi(UiComponent("Table", mapOf("pageId" to "tasks", "entityType" to "demo.task")))
        context.registerUi(UiComponent("Button", mapOf("label" to "New Task", "command" to "demo.create")))
    }
}
