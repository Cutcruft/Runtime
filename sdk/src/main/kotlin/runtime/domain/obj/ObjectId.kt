package runtime.domain.obj

import kotlin.jvm.JvmInline
import java.util.UUID

@JvmInline
value class ObjectId(val value: UUID) {
    companion object {
        fun generate(): ObjectId = ObjectId(UUID.randomUUID())

        /** Parses [value]; returns `null` when it is not a valid UUID string. */
        fun fromString(value: String): ObjectId? = runCatching { ObjectId(UUID.fromString(value)) }.getOrNull()
    }

    override fun toString(): String = value.toString()
}
