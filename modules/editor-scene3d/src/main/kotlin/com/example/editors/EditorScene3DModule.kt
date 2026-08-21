package com.example.editors

import runtime.domain.module.Module
import runtime.domain.module.ModuleContext
import runtime.domain.module.PrimitiveDefinition
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

class EditorScene3DModule : Module() {
    override val info = PluginInfo(
        id = PluginId("editor-scene3d"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: ModuleContext) {
        context.registerPrimitive(
            PrimitiveDefinition(
                type = "Scene3D",
                name = "Scene3D Editor",
                version = "1.0.0",
                bundlePath = "frontend/scene3d.js",
                cssPath = "frontend/style.css",
                capabilities = listOf("toolbar", "readonly", "pan", "zoom", "select"),
                examples = listOf(
                    mapOf("camera" to mapOf("position" to listOf(5, 5, 5)), "toolbar" to listOf("select", "move")),
                    mapOf("readonly" to true)
                )
            )
        )
    }
}
