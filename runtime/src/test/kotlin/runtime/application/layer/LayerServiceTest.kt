package runtime.application.layer

import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import org.junit.jupiter.api.Test
import runtime.domain.models.ProjectId

class LayerServiceTest {

    private val service = LayerService()
    private val projectId = ProjectId.generate()

    @Test
    fun `setVisible stores override and getVisible returns it`() {
        service.setVisible(projectId, "boards:toolbar", false)
        assertFalse(service.getVisible(projectId, "boards:toolbar", configDefault = true))
    }

    @Test
    fun `getVisible returns config default when no override`() {
        assertTrue(service.getVisible(projectId, "boards:toolbar", configDefault = true))
        assertFalse(service.getVisible(projectId, "boards:toolbar", configDefault = false))
    }

    @Test
    fun `toggle flips visibility`() {
        val first = service.toggle(projectId, "boards:toolbar")
        assertFalse(first)
        val second = service.toggle(projectId, "boards:toolbar")
        assertTrue(second)
    }

    @Test
    fun `toggle respects config default for initial state`() {
        service.setVisible(projectId, "boards:toolbar", false)
        val result = service.toggle(projectId, "boards:toolbar")
        assertTrue(result)
    }

    @Test
    fun `getAllOverrides returns all overrides for a project`() {
        service.setVisible(projectId, "a", true)
        service.setVisible(projectId, "b", false)
        val overrides = service.getAllOverrides(projectId)
        assertEquals(2, overrides.size)
        assertTrue(overrides["a"]!!)
        assertFalse(overrides["b"]!!)
    }

    @Test
    fun `getAllOverrides returns empty map for unknown project`() {
        val unknown = ProjectId.generate()
        assertTrue(service.getAllOverrides(unknown).isEmpty())
    }

    @Test
    fun `clear removes all overrides for a project`() {
        service.setVisible(projectId, "a", false)
        service.clear(projectId)
        assertTrue(service.getAllOverrides(projectId).isEmpty())
    }

    @Test
    fun `overrides are isolated per project`() {
        val other = ProjectId.generate()
        service.setVisible(projectId, "toolbar", false)
        service.setVisible(other, "toolbar", true)
        assertFalse(service.getVisible(projectId, "toolbar", configDefault = true))
        assertTrue(service.getVisible(other, "toolbar", configDefault = false))
    }
}
