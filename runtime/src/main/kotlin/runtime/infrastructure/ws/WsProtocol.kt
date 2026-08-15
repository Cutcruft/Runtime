package runtime.infrastructure.ws

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule

object WsProtocol {
    private val mapper = ObjectMapper().registerModule(KotlinModule.Builder().build())

    fun encode(envelope: WsEnvelope): String {
        val message = LinkedHashMap<String, Any?>()
        message["type"] = envelope.type
        envelope.requestId?.let { message["requestId"] = it }
        message["payload"] = envelope.payload
        return mapper.writeValueAsString(message)
    }

    fun decode(message: String): WsEnvelope {
        @Suppress("UNCHECKED_CAST")
        val map = mapper.readValue(message, Map::class.java) as Map<String, Any?>
        return WsEnvelope(
            type = map["type"] as? String ?: "unknown",
            requestId = map["requestId"] as? String,
            payload = (map["payload"] as? Map<String, Any?>) ?: emptyMap()
        )
    }
}
