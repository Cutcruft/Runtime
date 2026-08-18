package com.example.editors

import runtime.domain.plugin.FrontendComponentDefinition
import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

class BuiltinUiPlugin : Plugin() {
    override val info = PluginInfo(
        id = PluginId("builtin-ui"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: PluginContext) {
        val components = listOf(
            Triple("Text", "Text", "text"),
            Triple("Image", "Image", "image"),
            Triple("Badge", "Badge", "badge"),
            Triple("Divider", "Divider", "divider"),
            Triple("Space", "Space", "space"),
            Triple("Button", "Button", "button"),
            Triple("Card", "Card", "card"),
            Triple("Tabs", "Tabs", "tabs"),
            Triple("Grid", "Grid", "grid"),
            Triple("Stat", "Stat", "stat"),
            Triple("List", "List", "list"),
            Triple("Table", "Table", "table"),
            Triple("Form", "Form", "form"),
            Triple("Input", "Input", "input"),
            Triple("Select", "Select", "select"),
            Triple("Textarea", "Textarea", "textarea"),
            Triple("Checkbox", "Checkbox", "checkbox"),
            Triple("Avatar", "Avatar", "avatar"),
            Triple("Progress", "Progress", "progress"),
            Triple("Accordion", "Accordion", "accordion"),
            Triple("Frame", "Frame", "frame")
        )

        for ((type, name, bundle) in components) {
            context.registerFrontendComponent(
                FrontendComponentDefinition(
                    type = type,
                    name = name,
                    version = "1.0.0",
                    bundlePath = "frontend/$bundle.js",
                    cssPath = "frontend/style.css"
                )
            )
        }
    }
}
