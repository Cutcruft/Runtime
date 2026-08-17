package runtime.infrastructure.ws

import java.util.concurrent.ConcurrentHashMap
import runtime.domain.models.ProjectId

data class Participant(
    val sessionId: String,
    val identity: ParticipantIdentity
)

data class ParticipantIdentity(
    val name: String,
    val color: String? = null
)

class PresenceManager {
    private val participantsByProject = ConcurrentHashMap<ProjectId, ConcurrentHashMap<String, Participant>>()
    private val identityBySession = ConcurrentHashMap<String, ParticipantIdentity>()

    fun join(projectId: ProjectId, sessionId: String, identity: ParticipantIdentity) {
        identityBySession[sessionId] = identity
        participantsByProject.getOrPut(projectId) { ConcurrentHashMap() }[sessionId] =
            Participant(sessionId, identity)
    }

    fun leave(projectId: ProjectId, sessionId: String): ParticipantIdentity? {
        val identity = identityBySession.remove(sessionId) ?: return null
        participantsByProject[projectId]?.remove(sessionId)
        if (participantsByProject[projectId]?.isEmpty() == true) {
            participantsByProject.remove(projectId)
        }
        return identity
    }

    fun participants(projectId: ProjectId): List<Participant> {
        return participantsByProject[projectId]?.values?.toList() ?: emptyList()
    }

    fun projects(): Set<ProjectId> = participantsByProject.keys.toSet()
}
