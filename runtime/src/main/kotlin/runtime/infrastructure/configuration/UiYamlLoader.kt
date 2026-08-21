package runtime.infrastructure.configuration

import org.yaml.snakeyaml.Yaml
import runtime.domain.models.RegisteredUi
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.UIDefinition
import java.io.File

/**
 * V11 — loads the workspace UI configuration from `<workspace>/ui.yaml`.
 *
 * The UI YAML is the single source of truth for the interface structure: pages,
 * sections/components (primitives from modules), navigation, buttons with command
 * bindings, overlays, shortcuts, subscriptions and the theme. Plugins only provide
 * commands/entities; `registerUi` has been removed from the Plugin API.
 *
 * The loader produces the same [RegisteredUi] model the configuration builder
 * consumes (App/Page/Navigation/Overlay/Shortcut/Subscription component types),
 * plus the parsed [runtime.domain.models.ThemeConfig].
 */
class UiYamlLoader {

    data class UiResult(
        val uiDefinitions: List<RegisteredUi>,
        val theme: runtime.domain.models.ThemeConfig?,
        val appConfig: Map<String, Any>?
    )

    fun load(uiYamlPath: String): UiResult {
        val file = File(uiYamlPath)
        if (!file.isFile) return UiResult(emptyList(), null, null)

        val root = Yaml().load(file.readText()) as? Map<String, Any> ?: return UiResult(emptyList(), null, null)
        val pluginId = PluginId("workspace")

        val uiDefinitions = mutableListOf<RegisteredUi>()
        val appRaw = root["app"] as? Map<*, *>
        if (appRaw != null) uiDefinitions += reg(pluginId, "App", appRaw.toMap())

        val themeRaw = root["theme"] as? Map<String, Any>
        val theme = themeRaw?.let { ConfigLoader().parseTheme(it) }

        (root["pages"] as? List<*>).orEmpty().forEach { page ->
            (page as? Map<*, *>)?.let { uiDefinitions += reg(pluginId, "Page", page.toMap()) }
        }
        (root["navigation"] as? List<*>).orEmpty().forEach { nav ->
            (nav as? Map<*, *>)?.let { uiDefinitions += reg(pluginId, "Navigation", it.toMap()) }
        }
        (root["overlays"] as? List<*>).orEmpty().forEach { overlay ->
            (overlay as? Map<*, *>)?.let { uiDefinitions += reg(pluginId, "Overlay", it.toMap()) }
        }
        (root["overlayTriggers"] as? List<*>).orEmpty().forEach { trigger ->
            (trigger as? Map<*, *>)?.let { uiDefinitions += reg(pluginId, "OverlayTrigger", it.toMap()) }
        }
        (root["shortcuts"] as? List<*>).orEmpty().forEach { shortcut ->
            (shortcut as? Map<*, *>)?.let { uiDefinitions += reg(pluginId, "Shortcut", it.toMap()) }
        }
        (root["eventSubscriptions"] as? List<*>).orEmpty().forEach { sub ->
            (sub as? Map<*, *>)?.let { uiDefinitions += reg(pluginId, "EventSubscription", it.toMap()) }
        }
        (root["subscriptions"] as? List<*>).orEmpty().forEach { sub ->
            (sub as? Map<*, *>)?.let { uiDefinitions += reg(pluginId, "Subscription", it.toMap()) }
        }

        return UiResult(uiDefinitions, theme, (root["app"] as? Map<*, *>)?.toMap())
    }

    private fun reg(pluginId: PluginId, componentType: String, config: Map<*, *>): RegisteredUi {
        val clean = config.mapNotNull { (k, v) -> if (v == null) null else k.toString() to v }.toMap()
        return RegisteredUi(
            pluginId = pluginId,
            definition = object : UIDefinition {
                override val componentType: String = componentType
                override val config: Map<String, Any> = clean
            }
        )
    }

    private fun Map<*, *>.toMap(): Map<String, Any> =
        mapNotNull { (k, v) -> if (v == null) null else k.toString() to v }.toMap()
}
