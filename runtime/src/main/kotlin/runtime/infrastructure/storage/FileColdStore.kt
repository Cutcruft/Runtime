package runtime.infrastructure.storage

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import java.io.File
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.domain.repositories.EntityRegistry

/**
 * File-backed cold layer: `<directory>/<projectId>/<entityType>.json` per
 * (project, type) bucket. Each file holds `{"type", "objects": [{"id","value"}]}`.
 * Writes are atomic (tmp file + rename) and idempotent. Values are serialized
 * with Jackson and deserialized back to the registered model class.
 */
class FileColdStore(
    private val root: File,
    private val entityRegistry: EntityRegistry
) : ColdStore {

    private val mapper = ObjectMapper().registerModule(KotlinModule.Builder().build())
    private val typesByProject = ConcurrentHashMap<ProjectId, MutableSet<EntityType>>()

    override fun load(projectId: ProjectId, entityType: EntityType): List<Pair<ObjectId, Any>> {
        val file = typeFile(projectId, entityType)
        if (!file.exists()) return emptyList()
        val rootNode = runCatching { mapper.readTree(file) }.getOrNull() ?: return emptyList()
        val result = mutableListOf<Pair<ObjectId, Any>>()
        rootNode.get("objects")?.forEach { entry ->
            val objectId = ObjectId(UUID.fromString(entry.get("id").asText()))
            val valueNode = entry.get("value")
            val definition = entityRegistry.get(entityType)
            val value = if (definition != null && valueNode != null && !valueNode.isNull) {
                mapper.treeToValue(valueNode, definition.modelClass)
            } else {
                null
            }
            if (value != null) result += objectId to value
        }
        return result
    }

    override fun persist(projectId: ProjectId, entityType: EntityType, objects: List<Pair<ObjectId, Any>>) {
        val dir = projectDir(projectId)
        dir.mkdirs()
        val file = File(dir, "${entityType.value}.json")
        val payload = mapOf(
            "type" to entityType.value,
            "objects" to objects.map { (objectId, value) ->
                mapOf("id" to objectId.value.toString(), "value" to value)
            }
        )
        val tmp = File(dir, "${entityType.value}.json.tmp")
        tmp.writeText(mapper.writeValueAsString(payload))
        try {
            Files.move(tmp.toPath(), file.toPath(), StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE)
        } catch (e: Exception) {
            Files.move(tmp.toPath(), file.toPath(), StandardCopyOption.REPLACE_EXISTING)
        }
        typesByProject.computeIfAbsent(projectId) { ConcurrentHashMap.newKeySet() }
            .add(entityType)
    }

    override fun hasType(projectId: ProjectId, entityType: EntityType): Boolean =
        entityType in availableTypes(projectId)

    override fun exists(projectId: ProjectId): Boolean {
        val dir = projectDir(projectId)
        return dir.isDirectory && listTypeFiles(projectId).isNotEmpty()
    }

    override fun availableTypes(projectId: ProjectId): Set<EntityType> =
        typesByProject[projectId] ?: discoverTypes(projectId).toMutableSet().also { typesByProject[projectId] = it }

    override fun listPersistedProjects(): Set<ProjectId> =
        root.listFiles { f -> f.isDirectory }
            ?.filter { it.isDirectory && it.listFiles()?.any { f -> f.isFile && f.name.endsWith(".json") } == true }
            ?.map { ProjectId(java.util.UUID.fromString(it.name)) }
            ?.toSet()
            ?: emptySet()

    override fun close(projectId: ProjectId) {
        typesByProject.remove(projectId)
    }

    override fun closeAll() {
        typesByProject.clear()
    }

    private fun discoverTypes(projectId: ProjectId): Set<EntityType> =
        listTypeFiles(projectId).map { EntityType(it.name.removeSuffix(".json")) }.toSet()

    private fun listTypeFiles(projectId: ProjectId): List<File> =
        projectDir(projectId).listFiles { file -> file.isFile && file.name.endsWith(".json") }
            .orEmpty().toList()

    private fun projectDir(projectId: ProjectId): File = File(root, projectId.value.toString())

    private fun typeFile(projectId: ProjectId, entityType: EntityType): File =
        File(projectDir(projectId), "${entityType.value}.json")
}
