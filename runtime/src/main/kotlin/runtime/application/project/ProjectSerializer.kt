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
import runtime.domain.storage.EntityStore
import runtime.infrastructure.obj.StoreObjectList

class ProjectSerializer(
    private val entityRegistry: EntityRegistry,
    private val store: EntityStore
) {
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
        val types = mutableListOf<EntityType>()
        root.get("objects")?.let { objectsNode ->
            val fields = objectsNode.fields()
            while (fields.hasNext()) {
                val (typeStr, _) = fields.next()
                types += EntityType(typeStr)
            }
        }
        store.open(projectId, types.toSet())
        val objectLists = types.associateWith { StoreObjectList<Any>(store, projectId, it) as ObjectList<Any> }
        root.get("objects")?.let { objectsNode ->
            val fields = objectsNode.fields()
            while (fields.hasNext()) {
                val (typeStr, entriesNode) = fields.next()
                val type = EntityType(typeStr)
                val definition = entityRegistry.get(type)
                val objectList = objectLists.getValue(type)
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
            }
        }
        return Project(projectId, objectLists)
    }
}
