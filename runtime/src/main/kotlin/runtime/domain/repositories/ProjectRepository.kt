package runtime.domain.repositories

import runtime.domain.models.Project
import runtime.domain.models.ProjectId

interface ProjectRepository {
    fun register(project: Project)

    fun get(id: ProjectId): Project?

    fun list(): Set<ProjectId>

    fun remove(id: ProjectId): Project?

    fun replace(project: Project)
}
