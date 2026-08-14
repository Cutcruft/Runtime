package runtime.interfaces.ws

internal object SessionRouting {

    sealed interface Outcome {
        data class CreateProject(val projectId: String?) : Outcome
        data class OpenProject(val projectId: String) : Outcome
        data class ExecuteCommand(val commandId: String, val params: Any?) : Outcome
        data class ProtocolError(val message: String) : Outcome
    }

    fun decide(commandId: String, projectBound: Boolean, params: Any?): Outcome {
        val projectId = (params as? Map<*, *>)?.get("projectId") as? String
        return when (commandId) {
            "project.create" -> Outcome.CreateProject(projectId)
            "project.open" ->
                if (projectId != null) Outcome.OpenProject(projectId)
                else Outcome.ProtocolError("Missing projectId")
            else ->
                if (projectBound) Outcome.ExecuteCommand(commandId, params)
                else Outcome.ProtocolError("Session not bound to a project. Send project.create or project.open first.")
        }
    }
}
