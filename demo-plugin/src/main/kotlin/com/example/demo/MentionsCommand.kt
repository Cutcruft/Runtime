package com.example.demo

import runtime.domain.command.Command
import runtime.domain.command.CommandContext
import runtime.domain.command.CommandResult

/** Returns @-mention candidates for the RichText editor. */
class MentionsCommand : Command("mentions", "List mention candidates", "Workspace") {
    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val people = listOf(
            mapOf("id" to "alice", "label" to "Alice"),
            mapOf("id" to "bob", "label" to "Bob"),
            mapOf("id" to "carol", "label" to "Carol"),
            mapOf("id" to "dave", "label" to "Dave"),
            mapOf("id" to "erin", "label" to "Erin"),
            mapOf("id" to "task", "label" to "#task"),
            mapOf("id" to "docs", "label" to "#docs"),
            mapOf("id" to "meeting", "label" to "#meeting")
        )
        return CommandResult.success(value = people)
    }
}
