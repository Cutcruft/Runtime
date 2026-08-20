package runtime.infrastructure.ws

enum class WsMessageType(val value: String) {
    COMMAND_EXECUTE("command.execute"),
    COMMAND_RESULT("command.result"),
    PROJECT_EVENT("project.event"),
    PROJECT_BOUND("project.bound"),
    WORKSPACE_STATE("workspace.state"),
    OBJECT_CHANGED("object.changed"),
    ERROR("error"),
    SUBSCRIBE("subscribe"),
    UNSUBSCRIBE("unsubscribe"),
    COMMANDS_RELOADED("commands.reloaded"),
    PRESENCE_JOIN("presence.join"),
    PRESENCE_LEAVE("presence.leave"),
    PRESENCE_LIST("presence.list"),
    CLIENT_IDENTITY("client.identity"),
    CURSOR_UPDATE("cursor.update")
}
