package runtime.infrastructure.ws

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test

class WsProtocolTest {

    @Test
    fun `should round trip a simple command envelope`() {
        val envelope = WsEnvelope(
            type = "command.execute",
            requestId = "req-1",
            payload = mapOf("commandId" to "demo.create", "params" to mapOf("title" to "T1"))
        )
        assertEquals(envelope, WsProtocol.decode(WsProtocol.encode(envelope)))
    }

    @Test
    fun `should escape special characters in strings`() {
        val envelope = WsEnvelope(
            type = "command.execute",
            payload = mapOf("params" to mapOf("text" to "line1\nline2\t\"quoted\"\\end\r"))
        )
        val encoded = WsProtocol.encode(envelope)
        val decoded = WsProtocol.decode(encoded)
        val params = decoded.payload["params"] as Map<*, *>
        assertEquals("line1\nline2\t\"quoted\"\\end\r", params["text"])
    }

    @Test
    fun `should preserve numbers and booleans`() {
        val envelope = WsEnvelope(
            type = "command.execute",
            payload = mapOf("params" to mapOf("count" to 42, "ratio" to 1.5, "enabled" to true, "nothing" to null))
        )
        val decoded = WsProtocol.decode(WsProtocol.encode(envelope))
        val params = decoded.payload["params"] as Map<*, *>
        assertEquals(42, (params["count"] as Number).toInt())
        assertEquals(1.5, (params["ratio"] as Number).toDouble())
        assertEquals(true, params["enabled"])
        assertTrue("nothing" in params)
    }

    @Test
    fun `should omit requestId when null`() {
        val encoded = WsProtocol.encode(WsEnvelope(type = "command.result", payload = mapOf("status" to "SUCCESS")))
        assertTrue("requestId" !in encoded)
    }

    @Test
    fun `should serialize command value as typed json`() {
        val envelope = WsEnvelope(
            type = "command.result",
            payload = mapOf(
                "status" to "SUCCESS",
                "value" to mapOf("title" to "T1", "status" to "open"),
                "references" to listOf(mapOf("entityType" to "demo.task", "objectId" to "abc"))
            )
        )
        val encoded = WsProtocol.encode(envelope)
        assertEquals(envelope, WsProtocol.decode(encoded))
    }
}
