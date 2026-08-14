package runtime.infrastructure.configuration

data class RuntimeConfig(
    val pluginDirectories: List<String> = emptyList(),
    val host: String = "0.0.0.0",
    val port: Int = 8080
)
