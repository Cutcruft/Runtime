package runtime.infrastructure.inmem

import java.util.concurrent.ConcurrentHashMap
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.repositories.ProjectRepository

class InMemoryProjectRepository : ProjectRepository {
    private val projects = ConcurrentHashMap<ProjectId, Project>()

    override fun register(project: Project) {
        val previous = projects.putIfAbsent(project.id, project)
        require(previous == null) { "Project ${project.id} already registered" }
    }

    override fun get(id: ProjectId): Project? = projects[id]

    override fun list(): Set<ProjectId> = projects.keys.toSet()

    override fun remove(id: ProjectId): Project? = projects.remove(id)

    override fun replace(project: Project) {
        projects[project.id] = project
    }
}
