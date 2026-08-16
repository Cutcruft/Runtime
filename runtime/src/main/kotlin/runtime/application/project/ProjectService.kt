package runtime.application.project

import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.repositories.ProjectRepository
import runtime.domain.storage.EntityStore

class ProjectService(
    private val projectRepository: ProjectRepository,
    private val projectFactory: ProjectFactory,
    private val serializer: ProjectSerializer,
    private val store: EntityStore
) {
    fun createProject(id: ProjectId): Project {
        val project = projectFactory.create(id)
        projectRepository.register(project)
        return project
    }

    fun getProject(id: ProjectId): Project? = projectRepository.get(id) ?: reopen(id)

    /** Rehydrates a project from the cold backend (e.g. after a restart). */
    private fun reopen(id: ProjectId): Project? {
        if (!store.exists(id)) return null
        val project = projectFactory.create(id)
        projectRepository.register(project)
        return project
    }

    fun listProjects(): Set<ProjectId> = projectRepository.list()

    fun removeProject(id: ProjectId): Project? {
        store.close(id)
        return projectRepository.remove(id)
    }

    fun saveProject(project: Project): String = serializer.serialize(project)

    fun loadProject(id: ProjectId, data: String): Project {
        val project = serializer.deserialize(id, data)
        projectRepository.replace(project)
        return project
    }
}
