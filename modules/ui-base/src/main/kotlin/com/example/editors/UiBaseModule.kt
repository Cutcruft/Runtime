package com.example.editors

import runtime.domain.module.Module
import runtime.domain.module.ModuleContext
import runtime.domain.module.PrimitiveDefinition
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginVersion

/**
 * V8 — базовый UI-модуль. Поставляет переиспользуемые примитивы интерфейса
 * (Button, Table, Form, ...) и их документацию (schema + examples) для
 * автогенерации Storybook-стори ядром. Плагины ссылаются на эти примитивы
 * по `type` в своих UI-конфигах.
 */
class UiBaseModule : Module() {
    override val info = PluginInfo(
        id = PluginId("ui-base"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: ModuleContext) {
        context.registerPrimitive(
            PrimitiveDefinition(
                type = "App",
                name = "AppShell",
                version = "1.0.0",
                bundlePath = "frontend/app.js",
                cssPath = "frontend/style.css",
                host = true,
                capabilities = listOf("shell", "layout")
            )
        )
        components().forEach(context::registerPrimitive)
    }

    private fun components(): List<PrimitiveDefinition> = listOf(
        primitive("Text", "text", examples = listOf(
            mapOf("text" to "Hello, runtime!", "variant" to "body"),
            mapOf("text" to "Section title", "variant" to "title")
        )),
        primitive("Image", "image", capabilities = listOf("media")),
        primitive("Badge", "badge", examples = listOf(
            mapOf("label" to "New", "tone" to "primary"),
            mapOf("label" to "Draft", "tone" to "muted")
        )),
        primitive("Divider", "divider"),
        primitive("Space", "space"),
        primitive("Button", "button", capabilities = listOf("actions"), examples = listOf(
            mapOf("label" to "Save", "variant" to "primary"),
            mapOf("label" to "Delete", "variant" to "ghost", "danger" to true)
        )),
        primitive("Tabs", "tabs", examples = listOf(
            mapOf("tabs" to listOf(mapOf("key" to "a", "label" to "Overview"), mapOf("key" to "b", "label" to "Details")))
        )),
        primitive("Stat", "stat", examples = listOf(
            mapOf("label" to "Tasks", "value" to "42")
        )),
        primitive("List", "list", capabilities = listOf("data"), examples = listOf(
            mapOf("entityType" to "task")
        )),
        primitive("Table", "table", capabilities = listOf("data"), examples = listOf(
            mapOf("entityType" to "task")
        )),
        primitive("Form", "form", capabilities = listOf("data", "actions")),
        primitive("Input", "input", capabilities = listOf("interactive")),
        primitive("Select", "select", capabilities = listOf("interactive")),
        primitive("Textarea", "textarea", capabilities = listOf("interactive")),
        primitive("Checkbox", "checkbox", capabilities = listOf("interactive")),
        primitive("Avatar", "avatar"),
        primitive("Progress", "progress"),
        primitive("Accordion", "accordion"),
        primitive("Frame", "frame", host = true)
    )

    private fun primitive(
        type: String,
        bundle: String,
        host: Boolean = false,
        capabilities: List<String> = emptyList(),
        examples: List<Map<String, Any>> = emptyList()
    ) = PrimitiveDefinition(
        type = type,
        name = type,
        version = "1.0.0",
        bundlePath = "frontend/$bundle.js",
        cssPath = "frontend/builtin.css",
        examples = examples,
        capabilities = capabilities,
        host = host
    )
}
