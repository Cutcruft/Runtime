package runtime.domain.entity

interface EntityDefinition {
    val type: EntityType
    val modelClass: Class<*>
}
