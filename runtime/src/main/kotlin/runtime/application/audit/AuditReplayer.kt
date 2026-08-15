package runtime.application.audit

import runtime.domain.models.AuditEvent
import runtime.domain.models.Project

class AuditReplayer {
    fun replay(project: Project, events: List<AuditEvent>) {
        events.forEach { event -> applyEvent(project, event) }
    }

    private fun applyEvent(project: Project, event: AuditEvent) {
        val result = event.result ?: return
        result.references.forEach { ref ->
            val objectList = project.objectList<Any>(ref.entityType) ?: return@forEach
            val objectId = ref.objectId
            val value = result.value
            if (value == null) {
                objectList.delete(objectId)
            } else if (objectList.get(objectId) != null) {
                objectList.update(objectId, value)
            } else {
                objectList.create(objectId, value)
            }
        }
    }
}
