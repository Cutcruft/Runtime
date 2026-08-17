package runtime.infrastructure.ws

import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.domain.models.ProjectId

class PresenceManagerTest {

    private val manager = PresenceManager()

    @Test
    fun `join adds participant to project`() {
        val projectId = ProjectId.generate()
        manager.join(projectId, "s1", ParticipantIdentity("Alice", "#FF0000"))

        val participants = manager.participants(projectId)
        assertEquals(1, participants.size)
        assertEquals("s1", participants[0].sessionId)
        assertEquals("Alice", participants[0].identity.name)
    }

    @Test
    fun `leave removes participant and returns identity`() {
        val projectId = ProjectId.generate()
        manager.join(projectId, "s1", ParticipantIdentity("Alice"))
        val identity = manager.leave(projectId, "s1")

        assertEquals("Alice", identity?.name)
        assertTrue(manager.participants(projectId).isEmpty())
    }

    @Test
    fun `leave returns null for unknown session`() {
        val projectId = ProjectId.generate()
        val identity = manager.leave(projectId, "unknown")
        assertNull(identity)
    }

    @Test
    fun `multiple participants in same project`() {
        val projectId = ProjectId.generate()
        manager.join(projectId, "s1", ParticipantIdentity("Alice"))
        manager.join(projectId, "s2", ParticipantIdentity("Bob"))

        assertEquals(2, manager.participants(projectId).size)
    }

    @Test
    fun `participants are independent per project`() {
        val p1 = ProjectId.generate()
        val p2 = ProjectId.generate()
        manager.join(p1, "s1", ParticipantIdentity("Alice"))
        manager.join(p2, "s2", ParticipantIdentity("Bob"))

        assertEquals(1, manager.participants(p1).size)
        assertEquals(1, manager.participants(p2).size)
        assertEquals("Alice", manager.participants(p1)[0].identity.name)
        assertEquals("Bob", manager.participants(p2)[0].identity.name)
    }

    @Test
    fun `leave cleans up empty project`() {
        val projectId = ProjectId.generate()
        manager.join(projectId, "s1", ParticipantIdentity("Alice"))
        manager.leave(projectId, "s1")

        assertTrue(manager.projects().isEmpty())
    }

    @Test
    fun `projects returns all active projects`() {
        val p1 = ProjectId.generate()
        val p2 = ProjectId.generate()
        manager.join(p1, "s1", ParticipantIdentity("Alice"))
        manager.join(p2, "s2", ParticipantIdentity("Bob"))

        assertEquals(2, manager.projects().size)
        assertTrue(manager.projects().contains(p1))
        assertTrue(manager.projects().contains(p2))
    }

    @Test
    fun `join with same session overwrites identity`() {
        val projectId = ProjectId.generate()
        manager.join(projectId, "s1", ParticipantIdentity("Alice"))
        manager.join(projectId, "s1", ParticipantIdentity("Alice v2", "#00FF00"))

        val participants = manager.participants(projectId)
        assertEquals(1, participants.size)
        assertEquals("Alice v2", participants[0].identity.name)
    }
}
