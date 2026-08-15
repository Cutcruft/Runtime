package runtime.application.plugin

import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.domain.models.PluginDependency
import runtime.domain.models.PluginDescriptor
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginVersion

class DependencyResolverTest {

    private fun descriptor(id: String, dependencies: List<String> = emptyList()): PluginDescriptor {
        return PluginDescriptor(
            id = PluginId(id),
            version = PluginVersion("1.0.0"),
            apiVersion = 1,
            mainClass = "Main",
            dependencies = dependencies.map { PluginDependency(PluginId(it), "1.x") },
            jarPath = "$id.jar"
        )
    }

    @Test
    fun `should order dependencies before dependents`() {
        val demo = descriptor("demo")
        val storage = descriptor("demo-storage", listOf("demo"))
        val result = DependencyResolver().resolve(listOf(storage, demo))
        assertEquals(listOf("demo", "demo-storage"), result.sorted.map { it.id.value })
        assertTrue(result.cycles.isEmpty())
    }

    @Test
    fun `should detect a dependency cycle`() {
        val a = descriptor("a", listOf("b"))
        val b = descriptor("b", listOf("a"))
        val result = DependencyResolver().resolve(listOf(a, b))
        assertTrue(result.cycles.isNotEmpty())
        val cycleIds = result.cycles[0].map { it.id.value }
        assertEquals(setOf("a", "b"), cycleIds.toSet())
    }

    @Test
    fun `should ignore dependencies not present in workspace`() {
        val a = descriptor("a", listOf("missing"))
        val result = DependencyResolver().resolve(listOf(a))
        assertEquals(listOf("a"), result.sorted.map { it.id.value })
        assertTrue(result.cycles.isEmpty())
    }
}
