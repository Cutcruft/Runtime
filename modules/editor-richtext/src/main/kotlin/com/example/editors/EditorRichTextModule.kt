package com.example.editors

import runtime.domain.module.Module
import runtime.domain.module.ModuleContext
import runtime.domain.module.PrimitiveDefinition
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.PluginInfo
import runtime.domain.plugin.PluginVersion

/**
 * V8/V9 — RichText editor module. Provides the "RichText" primitive (a rich text
 * editor built on Tiptap + ProseMirror). The frontend bundle is built from
 * `frontend/` (own package.json with tiptap/prosemirror deps) and bundled here.
 */
class EditorRichTextModule : Module() {
    override val info = PluginInfo(
        id = PluginId("editor-richtext"),
        version = PluginVersion("1.0.0"),
        apiVersion = 1
    )

    override fun initialize(context: ModuleContext) {
        context.registerPrimitive(
            PrimitiveDefinition(
                type = "RichText",
                name = "RichText Editor",
                version = "1.0.0",
                bundlePath = "frontend/richtext.js",
                cssPath = "frontend/style.css",
                capabilities = listOf("toolbar", "collaboration", "readonly", "mentions", "undo", "redo"),
                examples = listOf(
                    mapOf("placeholder" to "Write something...", "toolbar" to listOf("bold", "italic", "underline")),
                    mapOf("readonly" to true)
                )
            )
        )
    }
}
