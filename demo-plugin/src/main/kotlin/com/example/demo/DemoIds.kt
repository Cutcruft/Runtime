package com.example.demo

import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectId
import java.util.UUID

internal val TASK_TYPE = EntityType("demo.task")
internal val BOARD_TYPE = EntityType("demo.board")

internal fun parseId(params: Map<*, *>, key: String = "id"): ObjectId? {
    val idStr = params[key] as? String ?: return null
    return runCatching { ObjectId(UUID.fromString(idStr)) }.getOrNull()
}

internal fun isTaskOfBoard(task: Task, boardId: ObjectId): Boolean {
    return task.board?.objectId == boardId
}
