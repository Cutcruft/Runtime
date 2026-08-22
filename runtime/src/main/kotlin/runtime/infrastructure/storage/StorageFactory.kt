package runtime.infrastructure.storage

import java.io.File
import runtime.RuntimeMode
import runtime.domain.models.StorageConfig
import runtime.domain.repositories.EntityRegistry
import runtime.domain.storage.EntityStore

/**
 * Builds the [EntityStore] for the configured `storage` section and validates it.
 *
 * - `enabled: false` → pure in-memory (current behavior), regardless of backend.
 * - `memory` → in-memory with optional per-entity LRU cap (`storage.memory.maxEntities`).
 * - `files` → in-memory hot layer + atomic JSON files (write-behind flush).
 * - `hybrid` → capped hot LRU layer + files as the cold layer (load-on-miss).
 * - `redis` → in-memory hot layer + Redis as the cold layer (JVM only).
 * - `db` → in-memory hot layer + JDBC/H2 as the cold layer (JVM only).
 */
data class StorageResult(
    val store: EntityStore,
    val coldStore: ColdStore?
)

class StorageFactory {

    fun create(config: StorageConfig, entityRegistry: EntityRegistry): StorageResult {
        if (config.backend == "redis") {
            if (RuntimeMode.isNative) {
                throw IllegalArgumentException("Redis backend is not supported in native mode")
            }
            val url = config.redisUrl
                ?: throw IllegalArgumentException("storage.redis.url must be set for 'redis' backend")
            val cold = createRedisColdStore(url, entityRegistry)
            return StorageResult(
                store = DefaultEntityStore(cold = cold, maxEntities = config.maxEntities),
                coldStore = cold
            )
        }
        if (config.backend == "db") {
            if (RuntimeMode.isNative) {
                throw IllegalArgumentException("DB backend is not supported in native mode")
            }
            val url = config.dbUrl
                ?: throw IllegalArgumentException("storage.db.url must be set for 'db' backend")
            val cold = createDbColdStore(url, entityRegistry)
            return StorageResult(
                store = DefaultEntityStore(cold = cold, maxEntities = config.maxEntities),
                coldStore = cold
            )
        }
        val supported = setOf("memory", "files", "hybrid")
        if (config.backend !in supported) {
            throw IllegalArgumentException(
                "Unknown storage backend '${config.backend}' (supported: $supported)"
            )
        }
        if (config.maxEntities == 0) {
            throw IllegalArgumentException("storage.memory.maxEntities must be -1 (unlimited) or positive, got 0")
        }
        if (config.eviction != "lru") {
            throw IllegalArgumentException("unsupported storage.eviction '${config.eviction}' (supported: lru)")
        }

        val cold = if (config.enabled && config.backend != "memory") {
            FileColdStore(File(config.directory), entityRegistry)
        } else {
            null
        }
        val cap = when {
            !config.enabled -> config.maxEntities
            config.backend == "memory" -> config.maxEntities
            config.backend == "files" -> -1
            else -> config.maxEntities
        }
        return StorageResult(
            store = DefaultEntityStore(cold = cold, maxEntities = cap),
            coldStore = cold
        )
    }

    private fun createRedisColdStore(url: String, entityRegistry: EntityRegistry): ColdStore {
        val clazz = Class.forName("runtime.infrastructure.storage.RedisColdStore")
        val ctor = clazz.getDeclaredConstructor(String::class.java, EntityRegistry::class.java)
        return ctor.newInstance(url, entityRegistry) as ColdStore
    }

    private fun createDbColdStore(url: String, entityRegistry: EntityRegistry): ColdStore {
        val clazz = Class.forName("runtime.infrastructure.storage.DbColdStore")
        val ctor = clazz.getDeclaredConstructor(String::class.java, EntityRegistry::class.java)
        return ctor.newInstance(url, entityRegistry) as ColdStore
    }
}
