package com.example.editors

import runtime.domain.module.Module
import runtime.domain.module.ModuleContext
import runtime.domain.module.PrimitiveDefinition
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

class EditorCanvasModule : Module() {
    override val info = PluginInfo(
        id = PluginId("editor-canvas"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: ModuleContext) {
        context.registerPrimitive(
            PrimitiveDefinition(
                type = "Canvas",
                name = "Canvas Editor",
                version = "1.0.0",
                bundlePath = "frontend/canvas.js",
                cssPath = "frontend/style.css",
                capabilities = listOf("toolbar", "layers", "undo", "redo", "readonly", "pan", "zoom", "select", "draw", "resize"),
                examples = listOf(
                    mapOf("tool" to "select", "toolbar" to listOf("select", "rect", "line")),
                    mapOf("readonly" to true)
                )
            )
        )
    }
}
