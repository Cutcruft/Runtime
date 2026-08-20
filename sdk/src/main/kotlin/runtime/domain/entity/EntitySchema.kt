package runtime.domain.entity

/** Field types understood by the declarative schema and the CRUD/validation engine. */
enum class FieldType {
    STRING, TEXT, NUMBER, INTEGER, BOOLEAN, UUID, ENUM, DATE, REFERENCE, ARRAY, OBJECT
}

/**
 * Declarative field definition for a plugin entity model (YAML or code).
 * Used by auto-CRUD commands, the command validator, and surfaced in /config/entities.
 */
data class EntityField(
    val name: String,
    val type: FieldType = FieldType.STRING,
    val required: Boolean = false,
    val description: String = "",
    /** Allowed values for ENUM fields. */
    val enumValues: List<String> = emptyList(),
    /** Numeric min (NUMBER/INTEGER) or string min length (STRING/TEXT/UUID/ENUM). */
    val min: Double? = null,
    /** Numeric max (NUMBER/INTEGER) or string max length (STRING/TEXT/UUID/ENUM). */
    val max: Double? = null,
    /** Regex pattern for STRING/TEXT fields. */
    val pattern: String? = null,
    /** Target entity type for REFERENCE fields, e.g. "demo.board". */
    val reference: EntityType? = null,
    /** Default value applied on create when the field is absent. */
    val defaultValue: Any? = null
)

/**
 * Declarative model schema. Entities declared this way are stored as
 * `Map<String, Any?>` values; the schema drives validation, auto-CRUD commands
 * and the /config/entities endpoint.
 */
data class EntitySchema(
    val entityType: EntityType,
    /** Field used as the display label (list/select rendering). */
    val titleField: String = "title",
    /** Field used as the natural key (defaults to the auto-generated UUID `id`). */
    val idField: String = "id",
    val fields: List<EntityField> = emptyList()
) {
    init {
        require(fields.map { it.name }.toSet().size == fields.size) { "Duplicate field names in schema $entityType" }
    }

    fun field(name: String): EntityField? = fields.firstOrNull { it.name == name }

    fun requiredFields(): List<EntityField> = fields.filter { it.required }

    /** Serializes to the map shape used by /config/entities. */
    fun toConfigMap(): Map<String, Any> = mapOf(
        "type" to entityType.value,
        "titleField" to titleField,
        "idField" to idField,
        "fields" to fields.map { f ->
            mapOf(
                "name" to f.name,
                "type" to f.type.name.lowercase(),
                "required" to f.required,
                "description" to f.description,
                "enumValues" to f.enumValues,
                "min" to f.min,
                "max" to f.max,
                "pattern" to f.pattern,
                "reference" to f.reference?.value,
                "defaultValue" to f.defaultValue
            ).filterValues { it != null && it != emptyList<String>() }
        }
    )
}
