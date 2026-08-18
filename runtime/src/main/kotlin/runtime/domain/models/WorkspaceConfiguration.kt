package runtime.domain.models

import runtime.domain.plugin.PluginId
import runtime.domain.plugin.UIDefinition

data class WorkspaceConfiguration(
    val app: AppConfiguration,
    val navigation: List<NavigationEntry>,
    val pages: List<PageDefinition>,
    val shortcuts: List<ShortcutEntry>,
    val subscriptions: List<SubscriptionEntry>,
    val commands: List<CommandEntry>,
    val entities: List<EntityEntry>,
    val overlays: List<OverlayEntry>,
    val overlayTriggers: List<OverlayTriggerEntry>,
    val pluginComponents: List<PluginComponentEntry> = emptyList(),
    val i18n: I18nConfiguration,
    val transport: TransportConfig,
    val routing: RoutingConfiguration,
    val protocol: ProtocolDocsConfiguration = ProtocolDocsConfiguration(),
    val dev: DevModeInfo = DevModeInfo(),
    val collaboration: CollaborationInfo = CollaborationInfo()
)

data class DevModeInfo(
    val enabled: Boolean = false,
    val pollIntervalMs: Long = 0
)

data class CollaborationInfo(
    val enabled: Boolean = false,
    val cursorsEnabled: Boolean = false
)

/** Shell URL routing: `hash` (`#/page/<id>`) or `history` (`/page/<id>`), plus page redirects. */
data class RoutingConfiguration(
    val mode: String,
    val redirects: List<RedirectRuleConfiguration>
)

data class RedirectRuleConfiguration(
    val from: String,
    val to: String
)

/** Locale + aggregated message catalogs (`locale -> key -> text`). */
data class I18nConfiguration(
    val defaultLocale: String,
    val locales: List<String>,
    val messages: Map<String, Map<String, String>>
)

data class AppConfiguration(
    val title: String,
    val logo: String?,
    val layout: String,
    val landingPageId: String?,
    val theme: ThemeConfig
)

data class NavigationEntry(
    val id: String,
    val label: String,
    val pageId: String?,
    val order: Int?,
    val pluginId: String?,
    val group: String? = null,
    val icon: String? = null
)

data class PageDefinition(
    val id: String,
    val title: String,
    val sections: List<SectionDefinition> = emptyList(),
    val layers: List<LayerDefinition> = emptyList()
)

/** A compositing layer within a page — multiple layers stack by [order] with opacity and pointer-event control. */
data class LayerDefinition(
    val id: String,
    val title: String = "",
    val order: Int = 0,
    val visible: Boolean = true,
    val opacity: Double = 1.0,
    val position: LayerPosition = LayerPosition(),
    val pointerEvents: String = "auto",
    val className: String = "",
    val style: Map<String, String> = emptyMap(),
    val sections: List<SectionDefinition> = emptyList()
)

data class LayerPosition(
    val type: String = "relative",
    val top: String? = null,
    val left: String? = null,
    val right: String? = null,
    val bottom: String? = null,
    val width: String? = null,
    val height: String? = null
)

data class SectionDefinition(
    val id: String,
    val layout: String,
    val columns: Int,
    val components: List<ComponentDefinition>
)

data class ComponentDefinition(
    val type: String,
    val config: Map<String, Any>
)

data class ShortcutEntry(
    val id: String,
    val keys: List<String>,
    val action: String,
    val command: String? = null,
    val params: Map<String, Any>? = null,
    val page: String? = null,
    val scope: String = "global"
)

data class SubscriptionEntry(
    val id: String,
    val event: String,
    val filter: Map<String, Any>? = null,
    val action: String,
    val target: String? = null,
    val command: String? = null,
    val params: Map<String, Any>? = null
)

data class CommandEntry(
    val id: String,
    val description: String,
    val group: String? = null,
    val type: String = "LOGICAL",
    val visibility: String = "PUBLIC",
    val steps: List<String> = emptyList(),
    val parameters: List<CommandParameterEntry> = emptyList()
)

/** Declared metadata for one command parameter, surfaced in /docs. */
data class CommandParameterEntry(
    val name: String,
    val type: String = "string",
    val required: Boolean = false,
    val description: String = ""
)

/** Live WebSocket protocol documentation: message types + direction, from the core enum. */
data class ProtocolDocsConfiguration(
    val messages: List<ProtocolMessageDoc> = defaultProtocolMessages()
) {
    companion object {
        fun defaultProtocolMessages(): List<ProtocolMessageDoc> = listOf(
            ProtocolMessageDoc("command.execute", "client", "Execute a command: payload {commandId, params}. Responses are matched by requestId."),
            ProtocolMessageDoc("command.result", "server", "Command outcome: payload {status, value?, references?, error?}. status is SUCCESS or ERROR."),
            ProtocolMessageDoc("project.event", "server", "Project-scoped event broadcast (payload carries the event fields)."),
            ProtocolMessageDoc("object.changed", "server", "Entity mutation: payload {entityType, objectId, value}."),
            ProtocolMessageDoc("error", "server", "Protocol/processing error: payload {message}.")
        )
    }
}

data class ProtocolMessageDoc(
    val type: String,
    val direction: String,
    val description: String = ""
)

data class EntityEntry(
    val type: String
)

/** Declarative overlay: context menu, modal, side panel or tooltip. */
data class OverlayEntry(
    val id: String,
    val kind: String,
    val title: String? = null,
    val content: ComponentDefinition? = null,
    val items: List<MenuItemEntry>? = null,
    val width: String? = null,
    val side: String? = null,
    val text: String? = null,
    val placement: String? = null
)

/** One entry in a menu overlay. */
data class MenuItemEntry(
    val label: String,
    val icon: String? = null,
    val command: String? = null,
    val params: Map<String, Any>? = null,
    val spec: Map<String, Any>? = null,
    val confirm: String? = null,
    val items: List<MenuItemEntry>? = null,
    val divider: Boolean? = null,
    val disabled: Boolean? = null,
    val danger: Boolean? = null,
    val shortcut: String? = null
)

/** Binds a gesture (contextmenu / dblclick / selection / hover / drag) to an overlay. */
data class OverlayTriggerEntry(
    val event: String,
    val componentType: String? = null,
    val objectType: String? = null,
    val componentId: String? = null,
    val overlay: String,
    val anchor: String? = null
)

data class TransportConfig(
    val wsPath: String
)

data class RegisteredUi(
    val pluginId: PluginId,
    val definition: UIDefinition
)

/** A frontend Vue component provided by a plugin, served from its JAR. */
data class PluginComponentEntry(
    val type: String,
    val pluginId: String,
    val name: String,
    val version: String,
    val bundleUrl: String,
    val cssUrl: String? = null,
    val schema: Map<String, Any>? = null,
    val capabilities: List<String> = emptyList()
)
