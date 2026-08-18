package com.example.editors

import runtime.domain.plugin.FrontendComponentDefinition
import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

class EditorCanvasPlugin : Plugin() {
    override val info = PluginInfo(
        id = PluginId("editor-canvas"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: PluginContext) {
        context.registerFrontendComponent(
            FrontendComponentDefinition(
                type = "Canvas",
                name = "Canvas Editor",
                version = "1.0.0",
                bundlePath = "frontend/canvas.js",
                cssPath = "frontend/style.css",
                capabilities = listOf("toolbar", "layers", "undo", "redo", "readonly", "pan", "zoom", "select", "draw", "resize")
            )
        )
    }
}
