package runtime.domain.plugin

import kotlin.jvm.JvmInline

@JvmInline
value class PluginVersion(val value: String) {
    init {
        require(value.isNotBlank()) { "PluginVersion value must not be blank" }
        require(value.matches(Regex("^\\d+(\\.\\d+)*$"))) {
            "PluginVersion must match pattern major.minor.patch"
        }
    }

    override fun toString(): String = value
}
