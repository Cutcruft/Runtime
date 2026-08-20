package runtime.domain.plugin.yaml

import org.yaml.snakeyaml.Yaml
import runtime.domain.entity.EntityField
import runtime.domain.entity.EntitySchema
import runtime.domain.entity.EntityType
import runtime.domain.entity.FieldType
import runtime.domain.entity.SchemaEntityDefinition

/**
 * Parses `entities/` files into [SchemaEntityDefinition]s.
 *
 * File shape:
 * ```yaml
 * type: demo.task            # <pluginId>.<name>
 * titleField: title          # optional
 * idField: id                # optional
 * fields:
 *   - name: title
 *     type: string           # string|text|number|integer|boolean|uuid|enum|date|reference|array|object
 *     required: true
 *     description: Task title
 *     min: 3                 # string length / numeric min
 *     max: 100
 *     pattern: '^[a-z]'
 *     enum:
 *       - open
 *       - done
 *     reference: demo.board  # target entity type (type: reference)
 *     default: open          # default value on create
 * ```
 */
object YamlEntityParser {

    private val yaml = Yaml()

    fun parse(content: String): SchemaEntityDefinition {
        @Suppress("UNCHECKED_CAST")
        val root = yaml.load<Any>(content) as? Map<String, Any?>
            ?: throw IllegalArgumentException("Entity YAML must be a mapping")
        return parse(root)
    }

    @Suppress("UNCHECKED_CAST")
    fun parse(root: Map<String, Any?>): SchemaEntityDefinition {
        val type = EntityType(requireString(root, "type"))
        val titleField = root["titleField"] as? String ?: "title"
        val idField = root["idField"] as? String ?: "id"

        val rawFields = root["fields"] as? List<Any?>
            ?: throw IllegalArgumentException("Entity '$type' requires a 'fields' list")
        val fields = rawFields.map { raw ->
            val map = raw as? Map<String, Any?> ?: throw IllegalArgumentException("Each field must be a mapping")
            parseField(map)
        }

        val schema = EntitySchema(
            entityType = type,
            titleField = titleField,
            idField = idField,
            fields = fields
        )
        return SchemaEntityDefinition(type, schema)
    }

    @Suppress("UNCHECKED_CAST")
    private fun parseField(map: Map<String, Any?>): EntityField {
        val name = requireString(map, "name")
        val type = parseFieldType(map["type"] as? String ?: "string")
        val enumRaw = map["enum"] as? List<Any?> ?: map["enumValues"] as? List<Any?>
        val enumValues = enumRaw?.filterIsInstance<String>() ?: emptyList()
        val reference = (map["reference"] as? String)?.let { EntityType(it) }

        return EntityField(
            name = name,
            type = type,
            required = map["required"] as? Boolean ?: false,
            description = map["description"] as? String ?: "",
            enumValues = enumValues,
            min = (map["min"] as? Number)?.toDouble(),
            max = (map["max"] as? Number)?.toDouble(),
            pattern = map["pattern"] as? String,
            reference = reference,
            defaultValue = map["default"]
        )
    }

    private fun parseFieldType(raw: String): FieldType = when (raw.lowercase()) {
        "string", "text" -> if (raw.equals("text", true)) FieldType.TEXT else FieldType.STRING
        "number", "double", "float" -> FieldType.NUMBER
        "integer", "int", "long" -> FieldType.INTEGER
        "boolean", "bool" -> FieldType.BOOLEAN
        "uuid", "id" -> FieldType.UUID
        "enum" -> FieldType.ENUM
        "date", "datetime", "timestamp" -> FieldType.DATE
        "reference", "ref", "objectid" -> FieldType.REFERENCE
        "array", "list" -> FieldType.ARRAY
        "object", "map" -> FieldType.OBJECT
        else -> throw IllegalArgumentException("Unknown field type '$raw'")
    }

    private fun requireString(map: Map<String, Any?>, key: String): String =
        map[key] as? String ?: throw IllegalArgumentException("Missing string field '$key'")
}
