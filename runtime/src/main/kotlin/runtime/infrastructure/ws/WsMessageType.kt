package runtime.infrastructure.ws

enum class WsMessageType(val value: String) {
    COMMAND_EXECUTE("command.execute"),
    COMMAND_RESULT("command.result"),
    PROJECT_EVENT("project.event"),
    OBJECT_CHANGED("object.changed"),
    ERROR("error")
}
