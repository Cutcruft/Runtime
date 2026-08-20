package runtime.domain.entity

interface EntityDefinition {
    val type: EntityType
    val modelClass: Class<*>
    /** Declarative schema for YAML/code-defined models (drives auto-CRUD + validation). */
    val schema: EntitySchema? get() = null
}

/**
 * A schema-driven entity whose values are stored as `Map<String, Any?>`.
 * Used by the YAML loader and by plugins that prefer declarative models over
 * hand-written data classes. Auto-CRUD commands are generated from [schema].
 */
class SchemaEntityDefinition(
    override val type: EntityType,
    override val schema: EntitySchema
) : EntityDefinition {
    override val modelClass: Class<*> = Map::class.java
}
