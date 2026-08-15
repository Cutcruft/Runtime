package runtime.application.session

import kotlin.test.assertEquals
import kotlin.test.assertNotSame
import org.junit.jupiter.api.Test
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.models.Session
import runtime.infrastructure.inmem.InMemoryProjectRepository
import runtime.infrastructure.inmem.InMemorySessionRepository

class SessionManagerTest {

    @Test
    fun `bindProject binds session to project`() {
        val projectRepository = InMemoryProjectRepository()
        val sessionRepository = InMemorySessionRepository()
        val manager = SessionManager(sessionRepository, projectRepository)

        val project = Project(ProjectId.generate(), emptyMap())
        projectRepository.register(project)
        val session = Session("s1")
        sessionRepository.register(session)

        manager.bindProject("s1", project)
        assertEquals(project, session.project)
    }

    @Test
    fun `rebindIfChanged updates the project instance after replace`() {
        val projectRepository = InMemoryProjectRepository()
        val sessionRepository = InMemorySessionRepository()
        val manager = SessionManager(sessionRepository, projectRepository)

        val original = Project(ProjectId.generate(), emptyMap())
        projectRepository.register(original)
        val session = Session("s1")
        sessionRepository.register(session)
        manager.bindProject("s1", original)

        val replacement = Project(original.id, emptyMap())
        projectRepository.replace(replacement)
        manager.rebindIfChanged("s1")

        assertNotSame(original, session.project)
        assertEquals(replacement, session.project)
    }

    @Test
    fun `rebindIfChanged does nothing when instance is unchanged`() {
        val projectRepository = InMemoryProjectRepository()
        val sessionRepository = InMemorySessionRepository()
        val manager = SessionManager(sessionRepository, projectRepository)

        val project = Project(ProjectId.generate(), emptyMap())
        projectRepository.register(project)
        val session = Session("s1")
        sessionRepository.register(session)
        manager.bindProject("s1", project)

        manager.rebindIfChanged("s1")
        assertEquals(project, session.project)
    }

    @Test
    fun `removeSession drops the session`() {
        val projectRepository = InMemoryProjectRepository()
        val sessionRepository = InMemorySessionRepository()
        val manager = SessionManager(sessionRepository, projectRepository)

        sessionRepository.register(Session("s1"))
        manager.removeSession("s1")
        assertEquals(null, sessionRepository.get("s1"))
    }
}
