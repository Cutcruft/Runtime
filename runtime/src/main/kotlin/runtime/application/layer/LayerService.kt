package runtime.application.layer

import java.util.concurrent.ConcurrentHashMap
import runtime.domain.models.ProjectId

/**
 * Tracks per-project layer visibility overrides.
 * Defaults come from the config; this map stores runtime toggles.
 */
class LayerService {
    /** projectId → (layerId → visible). */
    private val overrides = ConcurrentHashMap<ProjectId, ConcurrentHashMap<String, Boolean>>()

    fun setVisible(projectId: ProjectId, layerId: String, visible: Boolean) {
        overrides.getOrPut(projectId) { ConcurrentHashMap() }[layerId] = visible
    }

    fun toggle(projectId: ProjectId, layerId: String): Boolean {
        val map = overrides.getOrPut(projectId) { ConcurrentHashMap() }
        val current = map[layerId] ?: true
        val next = !current
        map[layerId] = next
        return next
    }

    fun getVisible(projectId: ProjectId, layerId: String, configDefault: Boolean): Boolean {
        return overrides[projectId]?.get(layerId) ?: configDefault
    }

    fun getAllOverrides(projectId: ProjectId): Map<String, Boolean> {
        return overrides[projectId]?.toMap() ?: emptyMap()
    }

    fun clear(projectId: ProjectId) {
        overrides.remove(projectId)
    }
}
