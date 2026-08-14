package runtime.domain.project

import java.util.concurrent.ConcurrentHashMap

class ProjectRegistry {
    private val projects = ConcurrentHashMap<ProjectId, Project>()

    fun register(project: Project) {
        val previous = projects.putIfAbsent(project.id, project)
        require(previous == null) { "Project ${project.id} already registered" }
    }

    fun get(id: ProjectId): Project? = projects[id]

    fun list(): Set<ProjectId> = projects.keys.toSet()

    fun remove(id: ProjectId): Project? = projects.remove(id)

    fun replace(project: Project) {
        projects[project.id] = project
    }
}
