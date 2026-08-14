package runtime.interfaces.ws

import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SessionRoutingTest {

    @Test
    fun `project create should bind even when session already bound`() {
        val outcome = SessionRouting.decide("project.create", projectBound = true, params = null)
        assertTrue(outcome is SessionRouting.Outcome.CreateProject)
        assertEquals(null, (outcome as SessionRouting.Outcome.CreateProject).projectId)
    }

    @Test
    fun `project open should rebind session to another project`() {
        val outcome = SessionRouting.decide("project.open", projectBound = true, params = mapOf("projectId" to "pid"))
        assertEquals(SessionRouting.Outcome.OpenProject("pid"), outcome)
    }

    @Test
    fun `project open without projectId should fail`() {
        val outcome = SessionRouting.decide("project.open", projectBound = false, params = emptyMap<String, Any>())
        assertTrue(outcome is SessionRouting.Outcome.ProtocolError)
    }

    @Test
    fun `command on unbound session should fail with guidance`() {
        val outcome = SessionRouting.decide("demo.create", projectBound = false, params = mapOf("title" to "T1"))
        assertTrue(outcome is SessionRouting.Outcome.ProtocolError)
        assertTrue((outcome as SessionRouting.Outcome.ProtocolError).message.contains("project.create"))
    }

    @Test
    fun `command on bound session should execute`() {
        val params = mapOf("title" to "T1")
        val outcome = SessionRouting.decide("demo.create", projectBound = true, params = params)
        assertEquals(SessionRouting.Outcome.ExecuteCommand("demo.create", params), outcome)
    }
}
