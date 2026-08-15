package runtime.application.project

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.util.UUID
import runtime.domain.entity.EntityType
import runtime.domain.models.Project
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.domain.obj.ObjectList
import runtime.domain.repositories.EntityRegistry
import runtime.infrastructure.obj.SynchronizedObjectList

class ProjectSerializer(private val entityRegistry: EntityRegistry) {
    private val mapper = ObjectMapper().registerModule(KotlinModule.Builder().build())

    fun serialize(project: Project): String {
        val objects = LinkedHashMap<String, List<Map<String, Any?>>>()
        project.registeredEntityTypes().sortedBy { it.value }.forEach { type ->
            val objectList = project.objectList<Any>(type)
            val entries = objectList?.list()?.map { ref ->
                val value = objectList.get(ref.objectId)
                mapOf("id" to ref.objectId.value.toString(), "value" to value)
            } ?: emptyList()
            objects[type.value] = entries
        }
        return mapper.writeValueAsString(mapOf("objects" to objects))
    }

    fun deserialize(projectId: ProjectId, data: String): Project {
        val root = mapper.readTree(data)
        val objectLists = mutableMapOf<EntityType, ObjectList<*>>()
        root.get("objects")?.let { objectsNode ->
            val fields = objectsNode.fields()
            while (fields.hasNext()) {
                val (typeStr, entriesNode) = fields.next()
                val type = EntityType(typeStr)
                val definition = entityRegistry.get(type)
                val objectList = SynchronizedObjectList<Any>(type)
                entriesNode.forEach { entry ->
                    val objectId = ObjectId(UUID.fromString(entry.get("id").asText()))
                    val valueNode = entry.get("value")
                    val value = if (definition != null && valueNode != null && !valueNode.isNull) {
                        mapper.treeToValue(valueNode, definition.modelClass)
                    } else {
                        null
                    }
                    objectList.create(objectId, value as Any)
                }
                objectLists[type] = objectList
            }
        }
        return Project(projectId, objectLists)
    }
}
