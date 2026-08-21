package runtime.domain.module

/**
 * V8 — a UI primitive provided by a module.
 *
 * A primitive is a reusable interface element (Button, Table, Form, Text, ...)
 * that plugins reference by `type` in their UI configs. The module supplies the
 * frontend bundle, a JSON Schema for its config, and example configs used by the
 * core's Storybook host to auto-generate documentation.
 */
data class PrimitiveDefinition(
    /** Component type used in UI configs (e.g. "Button", "Table"). */
    val type: String,
    /** Human-readable display name. */
    val name: String,
    /** Semantic version. */
    val version: String = "1.0.0",
    /** Path to the JS bundle within the module JAR (e.g. "frontend/button.js"). */
    val bundlePath: String,
    /** Path to the CSS file within the module JAR (optional). */
    val cssPath: String? = null,
    /**
     * JSON Schema describing the primitive's config object. Used for validation
     * and for auto-generating Storybook stories.
     */
    val schema: Map<String, Any>? = null,
    /**
     * Example configs (each a valid `config` map) rendered as individual stories.
     * Example: `[{"label": "Primary", "variant": "primary"}, {"label": "Ghost"}]`.
     */
    val examples: List<Map<String, Any>> = emptyList(),
    /** Capability flags (e.g. ["data", "actions", "interactive"]). */
    val capabilities: List<String> = emptyList(),
    /** Whether this primitive is a structural host (Container/Page/Section). */
    val host: Boolean = false
)
