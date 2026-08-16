package runtime.infrastructure.storage

import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicLong
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.domain.storage.EntityStore

/**
 * Default [EntityStore] implementation used by the memory / files / hybrid backends.
 *
 * - A single copy-on-write map is the authoritative hot layer: reads grab a
 *   volatile snapshot (lock-free, never block writers), writes copy-on-write
 *   under a monitor.
 * - LRU eviction (when [maxEntities] > 0) is per-entity, keyed by access time;
 *   a bucket is flushed to the cold backend before its entries are evicted.
 * - With a [cold] backend, reads load on miss and writes are write-behind:
 *   dirty (project, type) buckets are flushed by [flush]/[close]/[closeAll] and
 *   before eviction.
 */
class DefaultEntityStore(
    private val cold: ColdStore? = null,
    private val maxEntities: Int = -1
) : EntityStore {

    @Volatile
    private var objects: Map<EntityKey, Any> = emptyMap()

    @Volatile
    private var access: Map<EntityKey, Long> = emptyMap()

    private val clock = AtomicLong()
    private val monitor = Any()
    private val types = ConcurrentHashMap<ProjectId, MutableSet<EntityType>>()
    private val dirty = ConcurrentHashMap<ProjectTypeKey, Unit>()

    override fun <T> get(projectId: ProjectId, entityType: EntityType, objectId: ObjectId): T? {
        var value = read(projectId, entityType, objectId)
        if (value == null && cold != null && cold.hasType(projectId, entityType)) {
            loadTypeIntoHot(projectId, entityType)
            value = read(projectId, entityType, objectId)
        }
        @Suppress("UNCHECKED_CAST")
        return value as T?
    }

    override fun <T> put(projectId: ProjectId, entityType: EntityType, objectId: ObjectId, model: T): Boolean {
        val key = EntityKey.of(projectId, entityType, objectId)
        synchronized(monitor) {
            val current = objects
            if (current.containsKey(key)) return false
            val updated = LinkedHashMap(current)
            updated[key] = model as Any
            objects = updated
            if (maxEntities > 0) touchLocked(key)
            markDirty(projectId, entityType)
            evictIfNeededLocked()
            return true
        }
    }

    override fun <T> update(projectId: ProjectId, entityType: EntityType, objectId: ObjectId, model: T): Boolean {
        val key = EntityKey.of(projectId, entityType, objectId)
        synchronized(monitor) {
            val current = objects
            if (!current.containsKey(key)) return false
            val updated = LinkedHashMap(current)
            updated[key] = model as Any
            objects = updated
            if (maxEntities > 0) touchLocked(key)
            markDirty(projectId, entityType)
            return true
        }
    }

    override fun remove(projectId: ProjectId, entityType: EntityType, objectId: ObjectId): Boolean {
        val key = EntityKey.of(projectId, entityType, objectId)
        synchronized(monitor) {
            val current = objects
            if (!current.containsKey(key)) return false
            val updated = LinkedHashMap(current)
            updated.remove(key)
            objects = updated
            if (maxEntities > 0) access = access - key
            markDirty(projectId, entityType)
            return true
        }
    }

    override fun list(projectId: ProjectId, entityType: EntityType): List<ObjectId> {
        ensureLoaded(projectId, entityType)
        val snapshot = objects
        return snapshot.keys.asSequence()
            .filter { it.projectId == projectId.value && it.type == entityType.value }
            .map { ObjectId(it.objectId) }
            .toList()
    }

    override fun <T> values(projectId: ProjectId, entityType: EntityType): List<T> {
        ensureLoaded(projectId, entityType)
        val snapshot = objects
        @Suppress("UNCHECKED_CAST")
        return snapshot.entries.asSequence()
            .filter { it.key.projectId == projectId.value && it.key.type == entityType.value }
            .map { it.value as T }
            .toList()
    }

    override fun size(projectId: ProjectId, entityType: EntityType): Int {
        ensureLoaded(projectId, entityType)
        val snapshot = objects
        return snapshot.keys.count { it.projectId == projectId.value && it.type == entityType.value }
    }

    override fun registeredEntityTypes(projectId: ProjectId): Set<EntityType> =
        types[projectId]?.toSet() ?: emptySet()

    override fun objectCount(projectId: ProjectId): Int =
        objects.keys.count { it.projectId == projectId.value }

    override fun totalObjectCount(): Int = objects.size

    override fun open(projectId: ProjectId, entityTypes: Set<EntityType>) {
        types.computeIfAbsent(projectId) { ConcurrentHashMap.newKeySet() }.addAll(entityTypes)
    }

    override fun exists(projectId: ProjectId): Boolean = cold?.exists(projectId) ?: false

    override fun availableTypes(projectId: ProjectId): Set<EntityType> =
        cold?.availableTypes(projectId) ?: emptySet()

    override fun close(projectId: ProjectId) {
        flush(projectId)
        types.remove(projectId)
        synchronized(monitor) {
            val snapshot = objects
            val keys = snapshot.keys.filter { it.projectId == projectId.value }
            if (keys.isNotEmpty()) {
                val updated = LinkedHashMap(snapshot)
                keys.forEach { updated.remove(it) }
                objects = updated
                if (maxEntities > 0) access = access.filterKeys { it.projectId != projectId.value }
            }
        }
        cold?.close(projectId)
    }

    override fun closeAll() {
        types.keys.toList().forEach { flush(it) }
        types.clear()
        synchronized(monitor) {
            objects = emptyMap()
            access = emptyMap()
        }
        cold?.closeAll()
    }

    /** Flushes all dirty (project, type) buckets of [projectId] to the cold backend. */
    fun flush(projectId: ProjectId) {
        while (true) {
            val keys = dirty.keys.filter { it.projectId == projectId.value }
            if (keys.isEmpty()) return
            keys.forEach { bucket ->
                flushTypeLocked(projectId, EntityType(bucket.type))
                dirty.remove(bucket)
            }
        }
    }

    fun flushAll() {
        types.keys.toList().forEach { flush(it) }
    }

    private fun read(projectId: ProjectId, entityType: EntityType, objectId: ObjectId): Any? {
        val key = EntityKey.of(projectId, entityType, objectId)
        val snapshot = objects
        val value = snapshot[key]
        if (value != null && maxEntities > 0) touch(key)
        return value
    }

    private fun touch(key: EntityKey) {
        val stamp = clock.incrementAndGet()
        synchronized(monitor) {
            access = LinkedHashMap(access).apply { this[key] = stamp }
        }
    }

    private fun touchLocked(key: EntityKey) {
        access = LinkedHashMap(access).apply { this[key] = clock.incrementAndGet() }
    }

    private fun markDirty(projectId: ProjectId, entityType: EntityType) {
        if (cold != null) dirty[ProjectTypeKey(projectId.value, entityType.value)] = Unit
    }

    private fun ensureLoaded(projectId: ProjectId, entityType: EntityType) {
        if (cold == null) return
        val hasHot = objects.keys.any { it.projectId == projectId.value && it.type == entityType.value }
        if (!hasHot && cold.hasType(projectId, entityType)) loadTypeIntoHot(projectId, entityType)
    }

    private fun loadTypeIntoHot(projectId: ProjectId, entityType: EntityType) {
        synchronized(monitor) {
            var updated = LinkedHashMap(objects)
            var loaded = false
            cold?.load(projectId, entityType)?.forEach { (objectId, value) ->
                val key = EntityKey.of(projectId, entityType, objectId)
                if (!updated.containsKey(key)) {
                    updated[key] = value
                    loaded = true
                    if (maxEntities > 0) access = LinkedHashMap(access).apply { this[key] = clock.incrementAndGet() }
                }
            }
            if (loaded) {
                objects = updated
                evictIfNeededLocked()
            }
        }
    }

    private fun evictIfNeededLocked() {
        if (maxEntities <= 0) return
        while (objects.size > maxEntities) {
            val lruKey = access.minByOrNull { it.value }?.key ?: return
            if (cold != null) flushTypeLocked(ProjectId(lruKey.projectId), EntityType(lruKey.type))
            val updated = LinkedHashMap(objects)
            updated.remove(lruKey)
            objects = updated
            access = LinkedHashMap(access).apply { remove(lruKey) }
        }
    }

    private fun flushTypeLocked(projectId: ProjectId, entityType: EntityType) {
        val snapshot = objects
        val hotEntries = snapshot.entries.asSequence()
            .filter { it.key.projectId == projectId.value && it.key.type == entityType.value }
            .map { ObjectId(it.key.objectId) to it.value }
            .toList()
        if (cold == null) return
        val merged = LinkedHashMap<ObjectId, Any>()
        cold.load(projectId, entityType).forEach { (objectId, value) -> merged[objectId] = value }
        hotEntries.forEach { (objectId, value) -> merged[objectId] = value }
        cold.persist(projectId, entityType, merged.entries.map { it.key to it.value })
    }
}
