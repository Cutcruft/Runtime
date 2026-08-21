package com.example.editors

import runtime.domain.module.Module
import runtime.domain.module.ModuleContext
import runtime.domain.module.PrimitiveDefinition
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

class EditorDiagramModule : Module() {
    override val info = PluginInfo(
        id = PluginId("editor-diagram"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: ModuleContext) {
        context.registerPrimitive(
            PrimitiveDefinition(
                type = "Diagram",
                name = "Diagram Editor",
                version = "1.0.0",
                bundlePath = "frontend/diagram.js",
                cssPath = "frontend/style.css",
                capabilities = listOf("toolbar", "collaboration", "layers", "readonly", "layout", "undo", "redo", "pan", "zoom", "select", "resize", "snap"),
                examples = listOf(
                    mapOf("layout" to "dagre", "toolbar" to listOf("select", "edge", "node")),
                    mapOf("readonly" to true)
                )
            )
        )
    }
}
