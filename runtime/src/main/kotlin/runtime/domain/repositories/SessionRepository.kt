package runtime.domain.repositories

import runtime.domain.models.Session

interface SessionRepository {
    fun register(session: Session)

    fun get(sessionId: String): Session?

    fun remove(sessionId: String): Session?

    fun list(): Set<String>

    fun all(): Set<Session>
}
