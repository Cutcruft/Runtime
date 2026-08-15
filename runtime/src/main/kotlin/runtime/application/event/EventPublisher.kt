package runtime.application.event

import runtime.domain.models.RuntimeEvent

interface EventPublisher {
    suspend fun publish(event: RuntimeEvent)
}
