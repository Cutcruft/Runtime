package runtime.domain.plugin

import kotlin.jvm.JvmInline

@JvmInline
value class PluginId(val value: String) {
    init {
        require(value.isNotBlank()) { "PluginId value must not be blank" }
        require(value.matches(Regex("^[a-z][a-z0-9-]*$"))) {
            "PluginId must match pattern [a-z][a-z0-9-]*"
        }
    }

    override fun toString(): String = value
}
