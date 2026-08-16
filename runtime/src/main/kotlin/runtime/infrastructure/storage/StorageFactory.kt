package runtime.infrastructure.storage

import java.io.File
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
 * - `redis` / `db` → rejected until implemented.
 */
class StorageFactory {

    fun create(config: StorageConfig, entityRegistry: EntityRegistry): EntityStore {
        if (config.backend == "redis") {
            throw IllegalStateException("storage backend 'redis' is not implemented yet")
        }
        if (config.backend == "db") {
            throw IllegalStateException("storage backend 'db' is not implemented yet")
        }
        val supported = setOf("memory", "files", "hybrid")
        if (config.backend !in supported) {
            throw IllegalArgumentException(
                "Unknown storage backend '${config.backend}' (supported: $supported; 'redis'/'db' not implemented yet)"
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
        return DefaultEntityStore(cold = cold, maxEntities = cap)
    }
}
