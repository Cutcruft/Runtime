package com.example.demo

import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult
import runtime.domain.obj.ObjectRef
import runtime.domain.obj.ObjectId

class CreateTaskCommand : Command("create", "Create a task", "Tasks") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val p = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val title = p["title"] as? String ?: return CommandResult.error("Missing title")
        return context.withProjectLock {
            val boardRef = when (val boardIdStr = p["boardId"] as? String) {
                null -> null
                else -> {
                    val boardId = runCatching { ObjectId(java.util.UUID.fromString(boardIdStr)) }.getOrNull()
                        ?: return@withProjectLock CommandResult.error("Invalid boardId: $boardIdStr")
                    val board = context.getObject<Board>(BOARD_TYPE, boardId)
                        ?: return@withProjectLock CommandResult.error("Board not found")
                    ObjectRef(BOARD_TYPE, boardId)
                }
            }
            val task = Task(title = title, status = "open", board = boardRef)
            val ref = context.objectList<Task>(TASK_TYPE).create(task)
            val references = listOfNotNull(ref, boardRef)
            CommandResult.success(value = task, references = references)
        }
    }
}

class ListTasksCommand : Command("list", "List tasks", "Tasks") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val p = params as? Map<*, *>
        val boardId = p?.get("boardId") as? String
        val parsedBoard = boardId?.let {
            runCatching { ObjectId(java.util.UUID.fromString(it)) }.getOrNull()
        }
        if (boardId != null && parsedBoard == null) {
            return CommandResult.error("Invalid boardId: $boardId")
        }
        val list = context.objectList<Task>(TASK_TYPE)
        val rows = list.list().mapNotNull { ref ->
            val task = list.get(ref.objectId) ?: return@mapNotNull null
            if (parsedBoard != null && task.board?.objectId != parsedBoard) return@mapNotNull null
            mapOf(
                "id" to ref.objectId.value.toString(),
                "title" to task.title,
                "status" to task.status,
                "boardId" to task.board?.objectId?.value?.toString()
            )
        }
        return CommandResult.success(value = rows)
    }
}

class CompleteTaskCommand : Command("complete", "Mark a task as done", "Tasks") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val p = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val id = parseId(p) ?: return CommandResult.error("Missing or invalid id")
        return context.withProjectLock {
            val list = context.objectList<Task>(TASK_TYPE)
            val current = list.get(id) ?: return@withProjectLock CommandResult.error("Task not found")
            val updated = current.copy(status = "done")
            list.update(id, updated)
            CommandResult.success(
                value = updated,
                references = listOf(ObjectRef(TASK_TYPE, id))
            )
        }
    }
}

class DeleteTaskCommand : Command("delete", "Delete a task", "Tasks") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val p = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val id = parseId(p) ?: return CommandResult.error("Missing or invalid id")
        return context.withProjectLock {
            val list = context.objectList<Task>(TASK_TYPE)
            if (!list.delete(id)) {
                return@withProjectLock CommandResult.error("Task not found")
            }
            CommandResult.success(value = mapOf("deleted" to id.value.toString()))
        }
    }
}

class TaskStatsCommand : Command("stats", "Task statistics", "Tasks") {
    override suspend fun execute(context: CommandContext, params: Any?): CommandResult {
        val tasks = context.objectList<Task>(TASK_TYPE).values()
        return CommandResult.success(
            value = mapOf(
                "total" to tasks.size,
                "open" to tasks.count { it.status == "open" },
                "done" to tasks.count { it.status == "done" }
            )
        )
    }
}
