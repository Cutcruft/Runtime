package runtime.infrastructure.inmem

import java.util.concurrent.ConcurrentHashMap
import runtime.domain.models.Session
import runtime.domain.repositories.SessionRepository

class InMemorySessionRepository : SessionRepository {
    private val sessions = ConcurrentHashMap<String, Session>()

    override fun register(session: Session) {
        sessions[session.sessionId] = session
    }

    override fun get(sessionId: String): Session? = sessions[sessionId]

    override fun remove(sessionId: String): Session? = sessions.remove(sessionId)

    override fun list(): Set<String> = sessions.keys.toSet()

    override fun all(): Set<Session> = sessions.values.toSet()
}
