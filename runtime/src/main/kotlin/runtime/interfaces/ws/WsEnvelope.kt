package runtime.interfaces.ws

import kotlinx.serialization.json.JsonElement

data class WsEnvelope(
    val type: String,
    val requestId: String? = null,
    val payload: Map<String, Any?> = emptyMap()
)
