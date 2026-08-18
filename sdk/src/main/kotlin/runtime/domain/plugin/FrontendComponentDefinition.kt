package runtime.domain.plugin

/**
 * Declares a frontend Vue component provided by a plugin.
 * The component's JS bundle and optional CSS are served from the plugin's JAR
 * via `/plugin-assets/<pluginId>/<bundlePath>`.
 */
data class FrontendComponentDefinition(
    /** Component type name used in UI configs (e.g. "RichText", "Diagram"). */
    val type: String,
    /** Human-readable display name. */
    val name: String,
    /** Semantic version string. */
    val version: String = "1.0.0",
    /** Path to the JS bundle within the plugin JAR (e.g. "frontend/editor-richtext.js"). */
    val bundlePath: String,
    /** Path to the CSS file within the plugin JAR (optional). */
    val cssPath: String? = null,
    /** JSON Schema for the component's config object (optional). */
    val schema: Map<String, Any>? = null,
    /** Capability flags (e.g. ["toolbar", "collaboration", "layers", "readonly"]). */
    val capabilities: List<String> = emptyList()
)
