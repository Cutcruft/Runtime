package runtime.domain.project

import kotlin.jvm.JvmInline
import java.util.UUID

@JvmInline
value class ProjectId(val value: UUID) {
    companion object {
        fun generate(): ProjectId = ProjectId(UUID.randomUUID())
    }

    override fun toString(): String = value.toString()
}
