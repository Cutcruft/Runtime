package com.example.editors

import runtime.domain.plugin.FrontendComponentDefinition
import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

class EditorDiagramPlugin : Plugin() {
    override val info = PluginInfo(
        id = PluginId("editor-diagram"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: PluginContext) {
        context.registerFrontendComponent(
            FrontendComponentDefinition(
                type = "Diagram",
                name = "Diagram Editor",
                version = "1.0.0",
                bundlePath = "frontend/diagram.js",
                cssPath = "frontend/style.css",
                capabilities = listOf("toolbar", "collaboration", "layers", "readonly", "layout", "undo", "redo", "pan", "zoom", "select", "resize", "snap")
            )
        )
    }
}
