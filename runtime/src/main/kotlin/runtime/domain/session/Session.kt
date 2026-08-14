package runtime.domain.session

import io.ktor.websocket.DefaultWebSocketSession
import runtime.domain.project.Project
import runtime.domain.project.ProjectId
import java.util.concurrent.ConcurrentHashMap

class Session(
    val sessionId: String,
    val webSocket: DefaultWebSocketSession,
    var project: Project? = null
) {
    val projectId: ProjectId? get() = project?.id
}

class SessionRegistry {
    private val sessions = ConcurrentHashMap<String, Session>()
    private val projectSessions = ConcurrentHashMap<ProjectId, MutableSet<String>>()

    fun register(session: Session) {
        sessions[session.sessionId] = session
    }

    fun get(sessionId: String): Session? = sessions[sessionId]

    fun remove(sessionId: String): Session? {
        val session = sessions.remove(sessionId) ?: return null
        session.projectId?.let { projectId ->
            projectSessions[projectId]?.remove(sessionId)
            if (projectSessions[projectId]?.isEmpty() == true) {
                projectSessions.remove(projectId)
            }
        }
        return session
    }

    fun bindProject(sessionId: String, project: Project) {
        val session = sessions[sessionId] ?: return
        session.project = project
        projectSessions.getOrPut(project.id) { ConcurrentHashMap.newKeySet() }.add(sessionId)
    }

    fun getSessionsForProject(projectId: ProjectId): Set<Session> {
        return projectSessions[projectId]?.mapNotNull { sessions[it] }?.toSet() ?: emptySet()
    }

    fun list(): Set<String> = sessions.keys.toSet()
}
