package com.example.demo.storage

import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.entity.EntityType

private val BOARD_TYPE = EntityType("demo.board")
private val TASK_TYPE = EntityType("demo.task")

class ExportCommand : Command("export", "Export demo data as JSON", "Storage") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val boards = context.objectList<Any>(BOARD_TYPE).values()
        val tasks = context.objectList<Any>(TASK_TYPE).values()
        val json = DemoJsonMapper.mapper.writeValueAsString(mapOf("boards" to boards, "tasks" to tasks))
        return CommandResult.success(value = json)
    }
}

class CountsCommand : Command("counts", "Count objects per entity type", "Storage") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val boards = context.objectList<Any>(BOARD_TYPE).size()
        val tasks = context.objectList<Any>(TASK_TYPE).size()
        return CommandResult.success(value = mapOf("boards" to boards, "tasks" to tasks))
    }
}
