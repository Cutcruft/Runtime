package runtime.domain.models

class Session(
    val sessionId: String,
    var project: Project? = null
) {
    val projectId: ProjectId? get() = project?.id
}
