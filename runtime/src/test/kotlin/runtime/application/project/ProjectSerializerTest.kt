package runtime.application.project

import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityRegistry
import runtime.domain.entity.EntityType
import runtime.domain.obj.ObjectList
import runtime.domain.obj.SynchronizedObjectList
import runtime.domain.project.Project
import runtime.domain.project.ProjectId
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

data class TaskModel(val title: String, val status: String)

class ProjectSerializerTest {
    private fun registry(): EntityRegistry {
        val registry = EntityRegistry()
        registry.register(object : EntityDefinition {
            override val type = EntityType("demo.task")
            override val modelClass = TaskModel::class.java
        })
        return registry
    }

    @Test
    fun `should round trip project state with preserved identities`() {
        val registry = registry()
        val type = EntityType("demo.task")
        val project = Project(ProjectId.generate(), mapOf(type to SynchronizedObjectList<TaskModel>(type)))
        val list = project.objectList<TaskModel>(type)!!
        val ref1 = list.create(TaskModel("first", "open"))
        val ref2 = list.create(TaskModel("second", "done"))

        val serializer = ProjectSerializer(registry)
        val data = serializer.serialize(project)
        val restored = serializer.deserialize(project.id, data)

        val restoredList = restored.objectList<TaskModel>(type)!!
        assertEquals(2, restoredList.size())
        assertEquals(TaskModel("first", "open"), restoredList.get(ref1.objectId))
        assertEquals(TaskModel("second", "done"), restoredList.get(ref2.objectId))
    }

    @Test
    fun `should deserialize empty project`() {
        val registry = registry()
        val type = EntityType("demo.task")
        val project = Project(ProjectId.generate(), mapOf(type to SynchronizedObjectList<TaskModel>(type)))

        val serializer = ProjectSerializer(registry)
        val restored = serializer.deserialize(project.id, serializer.serialize(project))

        assertEquals(0, restored.objectList<TaskModel>(type)!!.size())
        assertEquals(project.id, restored.id)
    }
}
