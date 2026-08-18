package com.example.editors

import runtime.domain.plugin.FrontendComponentDefinition
import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

class EditorScene3DPlugin : Plugin() {
    override val info = PluginInfo(
        id = PluginId("editor-scene3d"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: PluginContext) {
        context.registerFrontendComponent(
            FrontendComponentDefinition(
                type = "Scene3D",
                name = "Scene3D Editor",
                version = "1.0.0",
                bundlePath = "frontend/scene3d.js",
                cssPath = "frontend/style.css",
                capabilities = listOf("toolbar", "readonly", "pan", "zoom", "select")
            )
        )
    }
}
