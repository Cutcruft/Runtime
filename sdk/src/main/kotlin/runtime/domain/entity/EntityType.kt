package runtime.domain.entity

import kotlin.jvm.JvmInline

@JvmInline
value class EntityType(val value: String) {
    init {
        require(value.isNotBlank()) { "EntityType value must not be blank" }
        require(value.matches(Regex("^[a-z][a-z0-9]*\\.[a-z][a-z0-9]*$"))) {
            "EntityType must match pattern <pluginId>.<entityName>"
        }
    }

    override fun toString(): String = value
}
