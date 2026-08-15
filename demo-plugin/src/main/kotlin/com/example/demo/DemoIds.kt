package com.example.demo

import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectId
import java.util.UUID

internal val TASK_TYPE = EntityType("demo.task")
internal val BOARD_TYPE = EntityType("demo.board")
internal val DOCUMENT_TYPE = EntityType("demo.document")

internal const val DOC_NOTES = "11111111-1111-4111-8111-111111111111"
internal const val DOC_DIAGRAM = "22222222-2222-4222-8222-222222222222"
internal const val DOC_SCENE = "33333333-3333-4333-8333-333333333333"
internal const val DOC_BOARD = "44444444-4444-4444-8444-444444444444"

internal fun parseId(params: Map<*, *>, key: String = "id"): ObjectId? {
    val idStr = params[key] as? String ?: return null
    return parseObjectId(idStr)
}

internal fun parseObjectId(idStr: String): ObjectId? {
    return runCatching { ObjectId(UUID.fromString(idStr)) }.getOrNull()
}

internal fun isTaskOfBoard(task: Task, boardId: ObjectId): Boolean {
    return task.board?.objectId == boardId
}

internal fun demoDocumentDefault(id: ObjectId): String? {
    return when (id.value.toString()) {
        DOC_NOTES -> ""
        DOC_DIAGRAM -> """{"nodes":[],"edges":[]}"""
        DOC_SCENE -> """{"objects":[]}"""
        DOC_BOARD -> """{"elements":[]}"""
        else -> null
    }
}
