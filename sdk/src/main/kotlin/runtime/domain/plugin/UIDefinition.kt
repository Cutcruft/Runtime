package runtime.domain.plugin

interface UIDefinition {
    val componentType: String
    val config: Map<String, Any>
}
