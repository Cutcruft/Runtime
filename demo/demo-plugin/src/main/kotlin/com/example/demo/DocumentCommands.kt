package com.example.demo

import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandParameter
import runtime.domain.command.CommandResult
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectRef

class CreateDocumentCommand : Command(
    "createdocument",
    "Create a document",
    "Documents",
    parameters = listOf(
        CommandParameter("title", "string", required = true, description = "Document title"),
        CommandParameter("content", "string", required = false, description = "Initial content"),
        CommandParameter("id", "uuid", required = false, description = "Explicit document id")
    )
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val p = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val title = p["title"] as? String ?: return CommandResult.error("Missing title")
        val content = p["content"] as? String ?: ""
        return context.withProjectLock {
            val list = context.objectList<Document>(DOCUMENT_TYPE)
            val objectId = (p["id"] as? String)?.let(::parseObjectId) ?: ObjectId.generate()
            val ref = ObjectRef(DOCUMENT_TYPE, objectId)
            if (list.create(objectId, Document(title, content))) {
                CommandResult.success(
                    value = mapOf("id" to objectId.value.toString(), "title" to title),
                    references = listOf(ref)
                )
            } else {
                CommandResult.error("Document already exists")
            }
        }
    }
}

class ListDocumentsCommand : Command("listdocuments", "List documents", "Documents") {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val list = context.objectList<Document>(DOCUMENT_TYPE)
        val rows = list.list().mapNotNull { ref ->
            val doc = list.get(ref.objectId) ?: return@mapNotNull null
            mapOf(
                "id" to ref.objectId.value.toString(),
                "title" to doc.title
            )
        }
        return CommandResult.success(value = rows)
    }
}

class LoadDocumentCommand : Command(
    "loaddocument",
    "Load a document",
    "Documents",
    parameters = listOf(CommandParameter("id", "uuid", required = true, description = "Document id"))
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val p = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val id = parseId(p) ?: return CommandResult.error("Missing or invalid id")
        return context.withProjectLock {
            val list = context.objectList<Document>(DOCUMENT_TYPE)
            val doc = list.get(id) ?: run {
                val defaultContent = demoDocumentDefault(id) ?: return@withProjectLock CommandResult.error("Document not found")
                list.create(id, Document("Untitled", defaultContent))
                list.get(id)!!
            }
            CommandResult.success(value = doc.content)
        }
    }
}

class SaveDocumentCommand : Command(
    "savedocument",
    "Save a document",
    "Documents",
    parameters = listOf(
        CommandParameter("id", "uuid", required = true, description = "Document id"),
        CommandParameter("content", "string", required = true, description = "Document content"),
        CommandParameter("title", "string", required = false, description = "New title")
    )
) {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val p = params as? Map<*, *> ?: return CommandResult.error("Missing parameters")
        val id = parseId(p) ?: return CommandResult.error("Missing or invalid id")
        val content = p["content"] as? String ?: return CommandResult.error("Missing content")
        val title = p["title"] as? String
        return context.withProjectLock {
            val list = context.objectList<Document>(DOCUMENT_TYPE)
            val ref = ObjectRef(DOCUMENT_TYPE, id)
            val existing = list.get(id)
            if (existing != null) {
                list.update(id, existing.copy(content = content, title = title ?: existing.title))
            } else {
                list.create(id, Document(title ?: "Untitled", content))
            }
            CommandResult.success(
                value = mapOf("id" to id.value.toString(), "saved" to true),
                references = listOf(ref)
            )
        }
    }
}
