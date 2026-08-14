package runtime.application.project

import runtime.domain.project.Project
import runtime.domain.project.ProjectId
import runtime.domain.project.ProjectRegistry

class ProjectService(
    private val projectRegistry: ProjectRegistry,
    private val projectFactory: ProjectFactory,
    private val serializer: ProjectSerializer
) {
    fun createProject(id: ProjectId): Project {
        val project = projectFactory.create(id)
        projectRegistry.register(project)
        return project
    }

    fun getProject(id: ProjectId): Project? = projectRegistry.get(id)

    fun listProjects(): Set<ProjectId> = projectRegistry.list()

    fun removeProject(id: ProjectId): Project? = projectRegistry.remove(id)

    fun saveProject(project: Project): String = serializer.serialize(project)

    fun loadProject(id: ProjectId, data: String): Project {
        val project = serializer.deserialize(id, data)
        projectRegistry.replace(project)
        return project
    }
}
