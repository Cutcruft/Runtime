package com.example.demo

import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

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
    }

}
