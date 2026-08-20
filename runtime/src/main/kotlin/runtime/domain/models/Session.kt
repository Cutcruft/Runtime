package runtime.domain.models

/** A per-field server-side subscription filter for an entity model. */
data class SubscriptionFilter(
    val entityType: String,
    /** Key-value equality filter applied server-side before broadcasting object.changed. */
    val filter: Map<String, Any?> = emptyMap()
)

class Session(
    val sessionId: String,
    var workspaceId: String? = null,
    var project: Project? = null
) {
    val projectId: ProjectId? get() = project?.id
    val activeProjectId: ProjectId? get() = project?.id

    /** Per-session entity subscriptions (entityType → filters). */
    val subscriptions = LinkedHashMap<String, MutableList<SubscriptionFilter>>()

    fun addSubscription(filter: SubscriptionFilter) {
        subscriptions.getOrPut(filter.entityType) { mutableListOf() }
            .apply { if (none { it.filter == filter.filter }) add(filter) }
    }

    fun removeSubscription(entityType: String, filter: Map<String, Any?>): Boolean {
        val list = subscriptions[entityType] ?: return false
        val removed = list.removeAll { it.filter == filter }
        if (list.isEmpty()) subscriptions.remove(entityType)
        return removed
    }

    fun clearSubscriptions() {
        subscriptions.clear()
    }
}
