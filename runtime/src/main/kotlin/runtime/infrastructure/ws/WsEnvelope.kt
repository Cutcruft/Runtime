package runtime.infrastructure.ws

data class WsEnvelope(
    val type: String,
    val requestId: String? = null,
    val payload: Map<String, Any?> = emptyMap()
)
