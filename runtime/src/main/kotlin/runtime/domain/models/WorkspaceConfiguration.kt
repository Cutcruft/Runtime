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
    val transport: TransportConfig
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
    val pluginId: String?
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
    val description: String
)

data class EntityEntry(
    val type: String
)

data class TransportConfig(
    val wsPath: String
)

data class RegisteredUi(
    val pluginId: PluginId,
    val definition: UIDefinition
)
