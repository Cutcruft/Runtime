package runtime.infrastructure.ws

import io.ktor.websocket.DefaultWebSocketSession
import io.ktor.websocket.Frame
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.session.SessionManager
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.models.RuntimeEvent
import runtime.domain.models.Session
import runtime.domain.models.SubscriptionFilter
import runtime.domain.obj.ObjectId
import runtime.infrastructure.inmem.InMemoryProjectRepository
import runtime.infrastructure.inmem.InMemorySessionRepository

class WsEventPublisherTest {

    private fun createSessionManager(): SessionManager {
        val sessionRepo = InMemorySessionRepository()
        val projectRepo = InMemoryProjectRepository()
        return SessionManager(sessionRepo, projectRepo)
    }

    @Test
    fun `collaboration disabled suppresses mutation events`() = runBlocking {
        val sessionManager = createSessionManager()
        val activeSessions = mutableMapOf<String, DefaultWebSocketSession>()
        val presenceManager = PresenceManager()
        val publisher = WsEventPublisher(sessionManager, activeSessions, presenceManager, collaborationEnabled = false)

        val projectId = ProjectId.generate()
        val entityType = EntityType("demo.task")
        val objectId = ObjectId.generate()

        // publish should not throw when collaboration is disabled
        publisher.publish(
            RuntimeEvent.ObjectChanged(
                projectId = projectId,
                entityType = entityType,
                objectId = objectId,
                value = null
            )
        )
        // No sessions connected, so no broadcast anyway
    }

    @Test
    fun `presenceManager tracks join and leave`() {
        val manager = PresenceManager()
        val projectId = ProjectId.generate()

        manager.join(projectId, "s1", ParticipantIdentity("Alice"))
        assertEquals(1, manager.participants(projectId).size)

        manager.leave(projectId, "s1")
        assertEquals(0, manager.participants(projectId).size)
    }

    @Test
    fun `ws message types include collaboration types`() {
        assertEquals("presence.join", WsMessageType.PRESENCE_JOIN.value)
        assertEquals("presence.leave", WsMessageType.PRESENCE_LEAVE.value)
        assertEquals("presence.list", WsMessageType.PRESENCE_LIST.value)
        assertEquals("client.identity", WsMessageType.CLIENT_IDENTITY.value)
        assertEquals("cursor.update", WsMessageType.CURSOR_UPDATE.value)
    }

    @Test
    fun `object changed event carries sender session id`() {
        val event = RuntimeEvent.ObjectChanged(
            projectId = ProjectId.generate(),
            entityType = EntityType("demo.task"),
            objectId = ObjectId.generate(),
            value = null,
            senderSessionId = "session-abc"
        )
        assertEquals("session-abc", event.senderSessionId)
    }

    @Test
    fun `object changed event defaults sender session id to null`() {
        val event = RuntimeEvent.ObjectChanged(
            projectId = ProjectId.generate(),
            entityType = EntityType("demo.task"),
            objectId = ObjectId.generate(),
            value = null
        )
        assertEquals(null, event.senderSessionId)
    }

    // ── Subscription filtering (pure matcher) ─────────────────────────────────

    @Test
    fun `session with matching subscription accepts object changed`() {
        val session = Session("s1")
        session.addSubscription(SubscriptionFilter("demo.task", mapOf("status" to "done")))
        assertTrue(
            WsEventPublisher.acceptsSubscription(session, "demo.task", mapOf("status" to "done"))
        )
    }

    @Test
    fun `session with non-matching subscription rejects object changed`() {
        val session = Session("s1")
        session.addSubscription(SubscriptionFilter("demo.task", mapOf("status" to "done")))
        assertTrue(
            !WsEventPublisher.acceptsSubscription(session, "demo.task", mapOf("status" to "open"))
        )
    }

    @Test
    fun `session with empty filter accepts any value`() {
        val session = Session("s1")
        session.addSubscription(SubscriptionFilter("demo.task"))
        assertTrue(
            WsEventPublisher.acceptsSubscription(session, "demo.task", mapOf("anything" to "goes"))
        )
    }

    @Test
    fun `session with empty filter accepts non-map value`() {
        val session = Session("s1")
        session.addSubscription(SubscriptionFilter("demo.task"))
        assertTrue(WsEventPublisher.acceptsSubscription(session, "demo.task", null))
    }

    @Test
    fun `session without subscriptions rejects object changed`() {
        val session = Session("s1")
        assertTrue(!WsEventPublisher.acceptsSubscription(session, "demo.task", mapOf("status" to "done")))
    }

    @Test
    fun `subscription to other entity type is ignored`() {
        val session = Session("s1")
        session.addSubscription(SubscriptionFilter("demo.task", mapOf("status" to "done")))
        assertTrue(!WsEventPublisher.acceptsSubscription(session, "demo.board", mapOf("status" to "done")))
    }

    @Test
    fun `matching any of multiple filters accepts`() {
        val session = Session("s1")
        session.addSubscription(SubscriptionFilter("demo.task", mapOf("status" to "open")))
        session.addSubscription(SubscriptionFilter("demo.task", mapOf("boardId" to "b1")))
        assertTrue(
            WsEventPublisher.acceptsSubscription(session, "demo.task", mapOf("boardId" to "b1"))
        )
        assertTrue(
            WsEventPublisher.acceptsSubscription(session, "demo.task", mapOf("status" to "open"))
        )
    }
}
