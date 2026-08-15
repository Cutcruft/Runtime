package runtime.infrastructure.inmem

import kotlin.test.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import runtime.domain.entity.EntityType
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.infrastructure.obj.SynchronizedObjectList

class InMemoryProjectRepositoryTest {
    @Test
    fun `should register and retrieve project`() {
        val repository = InMemoryProjectRepository()
        val project = Project(
            id = ProjectId.generate(),
            objectLists = mapOf(EntityType("test.entity") to SynchronizedObjectList<Any>(EntityType("test.entity")))
        )
        repository.register(project)
        assertEquals(project, repository.get(project.id))
    }

    @Test
    fun `should throw on duplicate project id`() {
        val repository = InMemoryProjectRepository()
        val project = Project(
            id = ProjectId.generate(),
            objectLists = mapOf(EntityType("test.entity") to SynchronizedObjectList<Any>(EntityType("test.entity")))
        )
        repository.register(project)
        assertThrows<IllegalArgumentException> {
            repository.register(project)
        }
    }

    @Test
    fun `replace should swap project instance under the same id`() {
        val repository = InMemoryProjectRepository()
        val id = ProjectId.generate()
        val original = Project(id, emptyMap())
        val replacement = Project(id, emptyMap())
        repository.register(original)
        repository.replace(replacement)
        assertEquals(replacement, repository.get(id))
    }
}
