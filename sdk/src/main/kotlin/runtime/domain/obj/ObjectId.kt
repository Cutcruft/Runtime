package runtime.domain.obj

import kotlin.jvm.JvmInline
import java.util.UUID

@JvmInline
value class ObjectId(val value: UUID) {
    companion object {
        fun generate(): ObjectId = ObjectId(UUID.randomUUID())
    }

    override fun toString(): String = value.toString()
}
