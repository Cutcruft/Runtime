package com.example.demo.storage

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import runtime.domain.plugin.Plugin
import runtime.domain.plugin.PluginContext
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

object DemoJsonMapper {
    val mapper: ObjectMapper = ObjectMapper().registerModule(KotlinModule.Builder().build())
}

class StoragePlugin : Plugin() {
    override val info = PluginInfo(
        id = PluginId("demo-storage"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: PluginContext) {
        context.registerCommand(ExportCommand())
        context.registerCommand(CountsCommand())
    }
}
