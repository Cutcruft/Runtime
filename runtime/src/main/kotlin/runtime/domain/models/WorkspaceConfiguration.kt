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
    val i18n: I18nConfiguration,
    val transport: TransportConfig
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
    val sections: List<SectionDefinition>
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
    val group: String? = null
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
