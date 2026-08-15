package runtime.application.session

import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.models.Session
import runtime.domain.repositories.ProjectRepository
import runtime.domain.repositories.SessionRepository

class SessionManager(
    private val sessionRepository: SessionRepository,
    private val projectRepository: ProjectRepository
) {
    fun register(session: Session) {
        sessionRepository.register(session)
    }

    fun removeSession(sessionId: String) {
        sessionRepository.remove(sessionId)
    }

    fun getSession(sessionId: String): Session? = sessionRepository.get(sessionId)

    fun bindProject(sessionId: String, project: Project) {
        sessionRepository.get(sessionId)?.let { session ->
            session.project = project
        }
    }

    fun rebindIfChanged(sessionId: String) {
        val session = sessionRepository.get(sessionId) ?: return
        val current = session.project ?: return
        val latest = projectRepository.get(current.id) ?: return
        if (latest !== current) {
            session.project = latest
        }
    }

    fun sessionsForProject(projectId: ProjectId): List<Session> =
        sessionRepository.all().filter { it.project?.id == projectId }
}
