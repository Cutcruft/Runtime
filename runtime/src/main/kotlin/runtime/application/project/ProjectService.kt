package runtime.application.project

import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.repositories.ProjectRepository

class ProjectService(
    private val projectRepository: ProjectRepository,
    private val projectFactory: ProjectFactory,
    private val serializer: ProjectSerializer
) {
    fun createProject(id: ProjectId): Project {
        val project = projectFactory.create(id)
        projectRepository.register(project)
        return project
    }

    fun getProject(id: ProjectId): Project? = projectRepository.get(id)

    fun listProjects(): Set<ProjectId> = projectRepository.list()

    fun removeProject(id: ProjectId): Project? = projectRepository.remove(id)

    fun saveProject(project: Project): String = serializer.serialize(project)

    fun loadProject(id: ProjectId, data: String): Project {
        val project = serializer.deserialize(id, data)
        projectRepository.replace(project)
        return project
    }
}
