package com.example.demo

import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandParameter
import runtime.domain.command.CommandResult
import runtime.domain.obj.ObjectRef

class CreateBoardCommand : Command(
    "createboard",
    "Create a board",
    "Boards",
    parameters = listOf(
        CommandParameter("name", "string", required = true, description = "Board name"),
        CommandParameter("description", "string", required = false, description = "Board description")
    )
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val p = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val name = p["name"] as? String ?: return CommandResult.error("Missing name")
        val description = p["description"] as? String ?: ""
        return context.withProjectLock {
            val board = Board(name = name, description = description)
            val ref = context.objectList<Board>(BOARD_TYPE).create(board)
            CommandResult.success(value = board, references = listOf(ref))
        }
    }
}

class ListBoardsCommand : Command("listboards", "List all boards", "Boards") {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val list = context.objectList<Board>(BOARD_TYPE)
        val rows = list.list().mapNotNull { ref ->
            val board = list.get(ref.objectId) ?: return@mapNotNull null
            mapOf(
                "id" to ref.objectId.value.toString(),
                "name" to board.name,
                "description" to board.description
            )
        }
        return CommandResult.success(value = rows)
    }
}

class DeleteBoardCommand : Command(
    "deleteboard",
    "Delete a board and its tasks",
    "Boards",
    parameters = listOf(CommandParameter("id", "uuid", required = true, description = "Board id"))
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val p = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val id = parseId(p) ?: return CommandResult.error("Missing or invalid id")
        return context.withProjectLock {
            val boardList = context.objectList<Board>(BOARD_TYPE)
            val taskList = context.objectList<Task>(TASK_TYPE)
            val board = boardList.get(id) ?: return@withProjectLock CommandResult.error("Board not found")

            val affected = mutableListOf<ObjectRef>(ObjectRef(BOARD_TYPE, id))
            var deletedTasks = 0
            taskList.list().forEach { ref ->
                val task = taskList.get(ref.objectId) ?: return@forEach
                if (isTaskOfBoard(task, id)) {
                    taskList.delete(ref.objectId)
                    affected += ref
                    deletedTasks++
                }
            }
            boardList.delete(id)

            CommandResult.success(
                value = mapOf("deleted" to id.value.toString(), "deletedTasks" to deletedTasks),
                references = affected
            )
        }
    }
}
