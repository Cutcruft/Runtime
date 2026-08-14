package runtime.domain.project

import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectList
import runtime.domain.obj.SynchronizedObjectList
import runtime.domain.project.Project
import runtime.domain.project.ProjectId
import runtime.domain.project.ProjectRegistry
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals

class ProjectRegistryTest {
    @Test
    fun `should register and retrieve project`() {
        val registry = ProjectRegistry()
        val project = Project(
            id = ProjectId.generate(),
            objectLists = mapOf(EntityType("test.entity") to SynchronizedObjectList<Any>(EntityType("test.entity")))
        )
        registry.register(project)
        assertEquals(project, registry.get(project.id))
    }

    @Test
    fun `should throw on duplicate project id`() {
        val registry = ProjectRegistry()
        val project = Project(
            id = ProjectId.generate(),
            objectLists = mapOf(EntityType("test.entity") to SynchronizedObjectList<Any>(EntityType("test.entity")))
        )
        registry.register(project)
        assertThrows<IllegalArgumentException> {
            registry.register(project)
        }
    }
}
