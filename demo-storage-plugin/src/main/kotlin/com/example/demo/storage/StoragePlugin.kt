package com.example.demo.storage

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion
import runtime.domain.plugin.UIDefinition

object DemoJsonMapper {
    val mapper: ObjectMapper = ObjectMapper().registerModule(KotlinModule.Builder().build())
}

data class UiComponent(
    override val componentType: String,
    override val config: Map<String, Any>
) : UIDefinition

class StoragePlugin : Plugin() {
    override val info = PluginInfo(
        id = PluginId("demo-storage"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: PluginContext) {
        context.registerCommand(ExportCommand())
        context.registerCommand(CountsCommand())

        context.registerUi(UiComponent("Page", mapOf("id" to "export", "title" to "Export")))
        context.registerUi(UiComponent("Navigation", mapOf("id" to "nav-export", "label" to "Export", "pageId" to "export")))
        context.registerUi(UiComponent("Button", mapOf("label" to "Export JSON", "command" to "demo-storage.export")))
    }
}
