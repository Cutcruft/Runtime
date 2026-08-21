package com.example.layout

import runtime.domain.module.Module
import runtime.domain.module.ModuleContext
import runtime.domain.module.PrimitiveDefinition
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

/**
 * V10 — configurable layout module. Provides layout primitives (Grid/Stack/Group/
 * Spacer/Card/Section) that render nested children declared in the YAML config.
 */
class UiLayoutModule : Module() {
    override val info = PluginInfo(
        id = PluginId("ui-layout"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: ModuleContext) {
        listOf(
            PrimitiveDefinition(
                type = "Grid", name = "Grid", bundlePath = "frontend/grid.js",
                host = true, capabilities = listOf("layout"),
                examples = listOf(mapOf("columns" to 2, "gap" to 16))
            ),
            PrimitiveDefinition(
                type = "Stack", name = "Stack", bundlePath = "frontend/stack.js",
                host = true, capabilities = listOf("layout"),
                examples = listOf(mapOf("direction" to "vertical", "gap" to 8))
            ),
            PrimitiveDefinition(
                type = "Group", name = "Group", bundlePath = "frontend/group.js",
                host = true, capabilities = listOf("layout")
            ),
            PrimitiveDefinition(
                type = "Spacer", name = "Spacer", bundlePath = "frontend/spacer.js",
                host = true, capabilities = listOf("layout")
            ),
            PrimitiveDefinition(
                type = "Card", name = "Card", bundlePath = "frontend/card.js",
                host = true, capabilities = listOf("layout"),
                examples = listOf(mapOf("title" to "Project", "padding" to 20))
            ),
            PrimitiveDefinition(
                type = "Section", name = "Section", bundlePath = "frontend/section.js",
                host = true, capabilities = listOf("layout"),
                examples = listOf(mapOf("columns" to 2))
            )
        ).forEach(context::registerPrimitive)
    }
}
