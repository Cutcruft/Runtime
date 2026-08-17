package runtime.infrastructure.storage

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.lettuce.core.RedisClient
import io.lettuce.core.api.StatefulRedisConnection
import io.lettuce.core.api.sync.RedisCommands
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.domain.repositories.EntityRegistry

/**
 * Redis-backed cold layer.
 *
 * Key schema:
 *   cc:projects                             SET  of project IDs
 *   cc:types:{projectId}                    SET  of entity type strings
 *   cc:entity:{projectId}:{entityType}      HASH objectId → JSON value
 */
class RedisColdStore(
    redisUrl: String,
    private val entityRegistry: EntityRegistry
) : ColdStore {

    private val mapper = ObjectMapper().registerModule(KotlinModule.Builder().build())
    private val client = RedisClient.create(redisUrl)
    private val connection: StatefulRedisConnection<String, String> = client.connect()
    private val sync: RedisCommands<String, String> = connection.sync()
    private val typesByProject = ConcurrentHashMap<ProjectId, MutableSet<EntityType>>()

    override fun load(projectId: ProjectId, entityType: EntityType): List<Pair<ObjectId, Any>> {
        val hashKey = entityHashKey(projectId, entityType)
        val entries = sync.hgetall(hashKey)
        if (entries.isNullOrEmpty()) return emptyList()
        val result = mutableListOf<Pair<ObjectId, Any>>()
        for ((idStr, json) in entries) {
            val objectId = try { ObjectId(UUID.fromString(idStr)) } catch (_: Exception) { continue }
            val definition = entityRegistry.get(entityType) ?: continue
            val value = runCatching {
                mapper.readValue(json, definition.modelClass)
            }.getOrNull() ?: continue
            result += objectId to value
        }
        return result
    }

    override fun persist(projectId: ProjectId, entityType: EntityType, objects: List<Pair<ObjectId, Any>>) {
        val hashKey = entityHashKey(projectId, entityType)
        if (objects.isEmpty()) {
            sync.del(hashKey)
        } else {
            val entries = LinkedHashMap<String, String>()
            for ((objectId, value) in objects) {
                entries[objectId.value.toString()] = mapper.writeValueAsString(value)
            }
            sync.del(hashKey)
            sync.hset(hashKey, entries)
        }
        sync.sadd(projectsKey(), projectId.value.toString())
        sync.sadd(typesKey(projectId), entityType.value)
        typesByProject.computeIfAbsent(projectId) { ConcurrentHashMap.newKeySet() }.add(entityType)
    }

    override fun hasType(projectId: ProjectId, entityType: EntityType): Boolean =
        sync.sismember(typesKey(projectId), entityType.value)

    override fun exists(projectId: ProjectId): Boolean =
        sync.sismember(projectsKey(), projectId.value.toString())

    override fun availableTypes(projectId: ProjectId): Set<EntityType> {
        val cached = typesByProject[projectId]
        if (cached != null) return cached
        val members = sync.smembers(typesKey(projectId)) ?: emptySet()
        return members.map { EntityType(it) }.toSet().also { typesByProject[projectId] = it.toMutableSet() }
    }

    override fun listPersistedProjects(): Set<ProjectId> {
        val members = sync.smembers(projectsKey()) ?: emptySet()
        return members.mapNotNull {
            runCatching { ProjectId(UUID.fromString(it)) }.getOrNull()
        }.toSet()
    }

    override fun close(projectId: ProjectId) {
        typesByProject.remove(projectId)
    }

    override fun closeAll() {
        typesByProject.clear()
    }

    fun shutdown() {
        connection.close()
        client.shutdown()
    }

    private fun projectsKey() = "cc:projects"
    private fun typesKey(projectId: ProjectId) = "cc:types:${projectId.value}"
    private fun entityHashKey(projectId: ProjectId, entityType: EntityType) =
        "cc:entity:${projectId.value}:${entityType.value}"
}
