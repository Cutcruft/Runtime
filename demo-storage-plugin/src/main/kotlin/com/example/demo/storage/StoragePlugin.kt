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

        context.registerUi(
            UiComponent(
                "Page",
                mapOf(
                    "id" to "export",
                    "title" to "Export",
                    "sections" to listOf(
                        mapOf(
                            "id" to "export-actions",
                            "layout" to "stack",
                            "columns" to 1,
                            "components" to listOf(
                                mapOf(
                                    "type" to "Button",
                                    "config" to mapOf("label" to "Export JSON", "command" to "demo-storage.export")
                                )
                            )
                        )
                    )
                )
            )
        )
        context.registerUi(
            UiComponent(
                "Navigation",
                mapOf("id" to "nav-export", "label" to "Export", "pageId" to "export", "order" to 3)
            )
        )
        context.registerUi(
            UiComponent(
                "Shortcut",
                mapOf(
                    "id" to "export-quick",
                    "keys" to listOf("mod+e"),
                    "action" to "command",
                    "command" to "demo-storage.export"
                )
            )
        )
        context.registerUi(
            UiComponent(
                "EventSubscription",
                mapOf(
                    "id" to "toast-task-changed",
                    "event" to "object.changed",
                    "filter" to mapOf("entityType" to "demo.task"),
                    "action" to "toast",
                    "params" to mapOf("message" to "Task data changed")
                )
            )
        )
    }
}
