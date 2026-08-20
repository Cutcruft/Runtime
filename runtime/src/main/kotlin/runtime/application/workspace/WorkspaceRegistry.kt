package runtime.application.workspace

import java.util.concurrent.ConcurrentHashMap

/**
 * V5 — registry of isolated workspaces. The default workspace (id "default") is
 * created from the main application.yaml. Additional workspaces can be registered
 * (e.g. from `workspaces/<id>/application.yaml`).
 */
class WorkspaceRegistry {

    private val byId = ConcurrentHashMap<String, WorkspaceServices>()

    /** Registers (or replaces) a workspace runtime + services. */
    fun register(services: WorkspaceServices) {
        byId[services.runtime.workspaceId] = services
    }

    /** Returns the workspace services by id, or `null` when unknown. */
    fun get(workspaceId: String?): WorkspaceServices? = workspaceId?.let { byId[it] }

    /** Ids of all registered workspaces. */
    fun ids(): Set<String> = byId.keys.toSet()

    /** All registered workspace services. */
    fun all(): Collection<WorkspaceServices> = byId.values

    /** The primary/default workspace (used for legacy single-workspace paths). */
    fun default(): WorkspaceServices = byId["default"] ?: byId.values.first()

    fun remove(workspaceId: String): WorkspaceServices? = byId.remove(workspaceId)
}
