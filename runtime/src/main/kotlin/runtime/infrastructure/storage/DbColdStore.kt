package runtime.infrastructure.storage

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import java.sql.Connection
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import runtime.domain.entity.EntityType
import runtime.domain.models.ProjectId
import runtime.domain.obj.ObjectId
import runtime.domain.repositories.EntityRegistry

/**
 * JDBC/H2-backed cold layer.
 *
 * Schema:
 *   projects   (project_id TEXT PK)
 *   entities   (project_id TEXT, entity_type TEXT, object_id TEXT, value TEXT, PK(project_id, entity_type, object_id))
 *
 * Connection string format: JDBC URL, e.g. "jdbc:h2:mem:cutcruft" or "jdbc:postgresql://host/db"
 */
class DbColdStore(
    jdbcUrl: String,
    private val entityRegistry: EntityRegistry
) : ColdStore {

    private val mapper = ObjectMapper().registerModule(KotlinModule.Builder().build())

    private val ds: HikariDataSource = HikariConfig().apply {
        setJdbcUrl(jdbcUrl)
        maximumPoolSize = 8
        minimumIdle = 2
        isAutoCommit = true
    }.let { HikariDataSource(it) }

    init {
        ensureSchema()
    }

    override fun load(projectId: ProjectId, entityType: EntityType): List<Pair<ObjectId, Any>> {
        val result = mutableListOf<Pair<ObjectId, Any>>()
        ds.connection.use { conn ->
            val ps = conn.prepareStatement(
                "SELECT object_id, \"value\" FROM entities WHERE project_id = ? AND entity_type = ?"
            )
            ps.setString(1, projectId.value.toString())
            ps.setString(2, entityType.value)
            val rs = ps.executeQuery()
            val definition = entityRegistry.get(entityType)
            while (rs.next()) {
                val objectId = try {
                    ObjectId(UUID.fromString(rs.getString("object_id")))
                } catch (_: Exception) { continue }
                val json = rs.getString("value")
                val value = if (definition != null && json != null) {
                    runCatching { mapper.readValue(json, definition.modelClass) }.getOrNull()
                } else null
                if (value != null) result += objectId to value
            }
        }
        return result
    }

    override fun persist(projectId: ProjectId, entityType: EntityType, objects: List<Pair<ObjectId, Any>>) {
        ds.connection.use { conn ->
            conn.autoCommit = false
            try {
                val delete = conn.prepareStatement(
                    "DELETE FROM entities WHERE project_id = ? AND entity_type = ?"
                )
                delete.setString(1, projectId.value.toString())
                delete.setString(2, entityType.value)
                delete.executeUpdate()

                if (objects.isNotEmpty()) {
                    val insert = conn.prepareStatement(
                        "INSERT INTO entities (project_id, entity_type, object_id, \"value\") VALUES (?, ?, ?, ?)"
                    )
                    for ((objectId, value) in objects) {
                        insert.setString(1, projectId.value.toString())
                        insert.setString(2, entityType.value)
                        insert.setString(3, objectId.value.toString())
                        insert.setString(4, mapper.writeValueAsString(value))
                        insert.addBatch()
                    }
                    insert.executeBatch()
                }

                val upsertProject = conn.prepareStatement(
                    "MERGE INTO projects (project_id) KEY (project_id) VALUES (?)"
                )
                upsertProject.setString(1, projectId.value.toString())
                upsertProject.executeUpdate()

                conn.commit()
            } catch (e: Exception) {
                conn.rollback()
                throw e
            }
        }
    }

    override fun hasType(projectId: ProjectId, entityType: EntityType): Boolean {
        ds.connection.use { conn ->
            val ps = conn.prepareStatement(
                "SELECT 1 FROM entities WHERE project_id = ? AND entity_type = ? LIMIT 1"
            )
            ps.setString(1, projectId.value.toString())
            ps.setString(2, entityType.value)
            return ps.executeQuery().next()
        }
    }

    override fun exists(projectId: ProjectId): Boolean {
        ds.connection.use { conn ->
            val ps = conn.prepareStatement("SELECT 1 FROM projects WHERE project_id = ?")
            ps.setString(1, projectId.value.toString())
            return ps.executeQuery().next()
        }
    }

    override fun availableTypes(projectId: ProjectId): Set<EntityType> {
        val types = mutableSetOf<EntityType>()
        ds.connection.use { conn ->
            val ps = conn.prepareStatement(
                "SELECT DISTINCT entity_type FROM entities WHERE project_id = ?"
            )
            ps.setString(1, projectId.value.toString())
            val rs = ps.executeQuery()
            while (rs.next()) {
                types += EntityType(rs.getString("entity_type"))
            }
        }
        return types
    }

    override fun listPersistedProjects(): Set<ProjectId> {
        val projects = mutableSetOf<ProjectId>()
        ds.connection.use { conn ->
            val rs = conn.prepareStatement("SELECT project_id FROM projects").executeQuery()
            while (rs.next()) {
                val id = rs.getString("project_id")
                runCatching { ProjectId(UUID.fromString(id)) }.getOrNull()?.let { projects += it }
            }
        }
        return projects
    }

    override fun close(projectId: ProjectId) {
        // No in-memory cache to clear for DB backend
    }

    override fun closeAll() {
        // Connection pool managed by HikariCP
    }

    fun shutdown() {
        ds.close()
    }

    private fun ensureSchema() {
        ds.connection.use { conn ->
            conn.createStatement().use { stmt ->
                stmt.executeUpdate("""
                    CREATE TABLE IF NOT EXISTS projects (
                        project_id TEXT PRIMARY KEY
                    )
                """.trimIndent())
                stmt.executeUpdate("""
                    CREATE TABLE IF NOT EXISTS entities (
                        project_id TEXT NOT NULL,
                        entity_type TEXT NOT NULL,
                        object_id TEXT NOT NULL,
                        "value" TEXT,
                        PRIMARY KEY (project_id, entity_type, object_id)
                    )
                """.trimIndent())
                stmt.executeUpdate("""
                    CREATE INDEX IF NOT EXISTS idx_entities_project ON entities (project_id)
                """.trimIndent())
            }
        }
    }
}
