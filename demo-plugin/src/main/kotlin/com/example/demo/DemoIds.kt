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
        DOC_DIAGRAM -> """
            {"nodes":[
              {"id":"d1","shape":"rect","x":0,"y":0,"label":"Alpha","fill":"#f6f8fb"},
              {"id":"d2","shape":"rect","x":0,"y":120,"label":"Beta","fill":"#eef4ff"},
              {"id":"d3","shape":"ellipse","x":0,"y":240,"label":"Gamma","fill":"#e7f6ec"},
              {"id":"d4","shape":"rect","x":0,"y":360,"label":"Delta","fill":"#fef3c7"}
            ],"edges":[
              {"id":"e1","source":"d1","target":"d2"},
              {"id":"e2","source":"d2","target":"d3"},
              {"id":"e3","source":"d3","target":"d4"}
            ]}
        """.trimIndent()
        DOC_SCENE -> """
            {"objects":[
              {"id":"sc_parent_1","kind":"box","position":[0,0.5,0],"color":"#6b8afd","children":[
                {"id":"sc_child_1","kind":"sphere","position":[0,1.6,0],"color":"#34d399"},
                {"id":"sc_child_2","kind":"sphere","position":[0.9,0.6,0],"color":"#34d399"}
              ]},
              {"id":"sc_2","kind":"cylinder","position":[-2,0.5,1],"color":"#f59e0b"}
            ]}
        """.trimIndent()
        DOC_BOARD -> """{"elements":[]}"""
        else -> null
    }
}
