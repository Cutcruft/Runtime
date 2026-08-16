package runtime.application.workspace

import runtime.application.i18n.MessageRegistry
import runtime.domain.models.AppConfiguration
import runtime.domain.models.ComponentDefinition
import runtime.domain.models.CommandEntry
import runtime.domain.models.EntityEntry
import runtime.domain.models.I18nConfiguration
import runtime.domain.models.MenuItemEntry
import runtime.domain.models.NavigationEntry
import runtime.domain.models.OverlayEntry
import runtime.domain.models.OverlayTriggerEntry
import runtime.domain.models.PageDefinition
import runtime.domain.models.RegisteredUi
import runtime.domain.models.RedirectRuleConfiguration
import runtime.domain.models.RoutingConfiguration
import runtime.domain.models.SectionDefinition
import runtime.domain.models.ShortcutEntry
import runtime.domain.models.SubscriptionEntry
import runtime.domain.models.TransportConfig
import runtime.domain.models.UiConfig
import runtime.domain.models.WorkspaceConfiguration
import runtime.domain.command.PipelineCommand
import runtime.domain.plugin.PluginId
import runtime.domain.plugin.UIDefinition
import runtime.domain.repositories.CommandRegistry
import runtime.domain.repositories.EntityRegistry
import runtime.domain.models.RoutingConfig

class WorkspaceConfigurationBuilder(
    private val uiConfig: UiConfig,
    private val wsPath: String = "/ws",
    private val messageRegistry: MessageRegistry? = null,
    private val routing: RoutingConfig = RoutingConfig("hash", emptyList())
) {
    fun build(
        uiDefinitions: List<RegisteredUi>,
        commandRegistry: CommandRegistry,
        entityRegistry: EntityRegistry,
        loadedPluginIds: Set<PluginId>
    ): WorkspaceConfiguration {
        validatePluginOrder(loadedPluginIds)

        val resolvedUi = uiDefinitions.map { reg ->
            RegisteredUi(
                pluginId = reg.pluginId,
                definition = object : UIDefinition {
                    override val componentType: String = reg.definition.componentType
                    override val config: Map<String, Any> = resolveAssetUrls(reg.definition.config, reg.pluginId.value)
                }
            )
        }

        val navigation = buildNavigation(resolvedUi)
        val pages = buildPages(resolvedUi)
        val app = buildApp(resolvedUi, navigation, pages)
        return WorkspaceConfiguration(
            app = app,
            navigation = navigation,
            pages = pages,
            shortcuts = buildShortcuts(resolvedUi),
            subscriptions = buildSubscriptions(resolvedUi),
            commands = commandRegistry.all().entries.sortedBy { it.key }.map { (id, command) ->
                CommandEntry(
                    id = id,
                    description = command.description,
                    group = command.group,
                    type = command.type.name,
                    visibility = command.visibility.name,
                    steps = if (command is PipelineCommand) command.steps.map { it.command } else emptyList(),
                    parameters = command.parameters.map { p ->
                        CommandParameterEntry(
                            name = p.name,
                            type = p.type,
                            required = p.required,
                            description = p.description
                        )
                    }
                )
            },
            entities = entityRegistry.list().sortedBy { it.value }.map { EntityEntry(type = it.value) },
            overlays = buildOverlays(resolvedUi),
            overlayTriggers = buildOverlayTriggers(resolvedUi),
            i18n = buildI18n(),
            transport = TransportConfig(wsPath = wsPath),
            routing = RoutingConfiguration(
                mode = routing.mode,
                redirects = routing.redirects.map { RedirectRuleConfiguration(from = it.from, to = it.to) }
            ),
            protocol = ProtocolDocsConfiguration()
        )
    }

    private fun resolveAssetUrls(config: Map<String, Any>, pluginId: String): Map<String, Any> {
        return config.mapValues { (_, value) -> resolveAssetValue(value, pluginId) ?: value }
    }

    private fun resolveAssetValue(value: Any?, pluginId: String): Any? {
        return when (value) {
            is String -> {
                val trimmed = value.trim()
                if (trimmed.startsWith("assets/") || trimmed.startsWith("icons/") ||
                    trimmed.startsWith("images/") || trimmed.startsWith("static/")
                ) {
                    "/plugin-assets/$pluginId/$trimmed"
                } else {
                    value
                }
            }
            is Map<*, *> -> value.entries.associate { (k, v) -> k.toString() to resolveAssetValue(v, pluginId) }
            is List<*> -> value.map { resolveAssetValue(it, pluginId) }
            else -> value
        }
    }

    private fun buildI18n(): I18nConfiguration {
        val registry = messageRegistry
            ?: return I18nConfiguration(defaultLocale = "en", locales = listOf("en"), messages = emptyMap())
        return I18nConfiguration(
            defaultLocale = registry.defaultLocale,
            locales = registry.locales(),
            messages = registry.messages()
        )
    }

    private fun buildShortcuts(uiDefinitions: List<RegisteredUi>): List<ShortcutEntry> {
        return uiDefinitions
            .filter { it.definition.componentType.equals(uiConfig.shortcutComponentType, ignoreCase = true) }
            .map { reg ->
                val config = reg.definition.config
                ShortcutEntry(
                    id = config["id"] as? String ?: "shortcut-${reg.pluginId.value}",
                    keys = (config["keys"] as? List<*>)?.filterIsInstance<String>() ?: emptyList(),
                    action = config["action"] as? String ?: "command",
                    command = config["command"] as? String,
                    params = config["params"] as? Map<String, Any>,
                    page = config["page"] as? String,
                    scope = (config["scope"] as? String) ?: "global"
                )
            }
    }

    private fun buildSubscriptions(uiDefinitions: List<RegisteredUi>): List<SubscriptionEntry> {
        return uiDefinitions
            .filter { it.definition.componentType.equals(uiConfig.subscriptionComponentType, ignoreCase = true) }
            .map { reg ->
                val config = reg.definition.config
                SubscriptionEntry(
                    id = config["id"] as? String ?: "subscription-${reg.pluginId.value}",
                    event = config["event"] as? String ?: "object.changed",
                    filter = config["filter"] as? Map<String, Any>,
                    action = config["action"] as? String ?: "refresh",
                    target = config["target"] as? String,
                    command = config["command"] as? String,
                    params = config["params"] as? Map<String, Any>
                )
            }
    }

    private fun buildOverlays(uiDefinitions: List<RegisteredUi>): List<OverlayEntry> {
        return uiDefinitions
            .filter { it.definition.componentType.equals(uiConfig.overlayComponentType, ignoreCase = true) }
            .map { reg ->
                val config = reg.definition.config
                OverlayEntry(
                    id = config["id"] as? String ?: "overlay-${reg.pluginId.value}",
                    kind = config["kind"] as? String ?: "menu",
                    title = config["title"] as? String,
                    content = buildComponent(config["content"]),
                    items = buildMenuItems(config["items"]),
                    width = config["width"] as? String,
                    side = config["side"] as? String,
                    text = config["text"] as? String,
                    placement = config["placement"] as? String
                )
            }
    }

    private fun buildOverlayTriggers(uiDefinitions: List<RegisteredUi>): List<OverlayTriggerEntry> {
        return uiDefinitions
            .filter { it.definition.componentType.equals(uiConfig.overlayTriggerComponentType, ignoreCase = true) }
            .map { reg ->
                val config = reg.definition.config
                OverlayTriggerEntry(
                    event = config["event"] as? String ?: "contextmenu",
                    componentType = config["componentType"] as? String,
                    objectType = config["objectType"] as? String,
                    componentId = config["componentId"] as? String,
                    overlay = config["overlay"] as String,
                    anchor = config["anchor"] as? String
                )
            }
    }

    @Suppress("UNCHECKED_CAST")
    private fun buildComponent(raw: Any?): ComponentDefinition? {
        val map = raw as? Map<*, *> ?: return null
        val type = map["type"] as? String ?: return null
        val cfg = (map["config"] as? Map<*, *>).orEmpty()
            .mapNotNull { (key, value) -> if (value == null) null else key.toString() to value }
            .toMap()
        return ComponentDefinition(type = type, config = cfg)
    }

    @Suppress("UNCHECKED_CAST")
    private fun buildMenuItems(raw: Any?): List<MenuItemEntry>? {
        if (raw !is List<*>) return null
        return raw.mapNotNull { item ->
            val map = item as? Map<*, *> ?: return@mapNotNull null
            MenuItemEntry(
                label = map["label"] as? String ?: "",
                icon = map["icon"] as? String,
                command = map["command"] as? String,
                params = map["params"] as? Map<String, Any>,
                spec = map["spec"] as? Map<String, Any>,
                confirm = map["confirm"] as? String,
                items = buildMenuItems(map["items"]),
                divider = map["divider"] as? Boolean,
                disabled = map["disabled"] as? Boolean,
                danger = map["danger"] as? Boolean,
                shortcut = map["shortcut"] as? String
            )
        }
    }

    private fun pluginOrderIndex(pluginId: String): Int {
        val index = uiConfig.pluginOrder.indexOf(pluginId)
        return if (index >= 0) index else uiConfig.pluginOrder.size
    }

    private fun validatePluginOrder(loadedPluginIds: Set<PluginId>) {
        val missing = uiConfig.pluginOrder.filter { PluginId(it) !in loadedPluginIds }
        if (missing.isNotEmpty()) {
            throw IllegalArgumentException("Plugins in ui.pluginOrder are not loaded: ${missing.joinToString()}")
        }
    }

    private fun buildNavigation(uiDefinitions: List<RegisteredUi>): List<NavigationEntry> {
        val include = uiConfig.navInclude
        val exclude = uiConfig.navExclude
        val nav = uiDefinitions
            .filter { it.definition.componentType.equals(uiConfig.navigationComponentType, ignoreCase = true) }
            .filter { reg ->
                val pluginId = reg.pluginId.value
                if (pluginId in exclude) false
                else include.isEmpty() || pluginId in include
            }
            .map { reg ->
                val fields = uiConfig.navigationFields
                NavigationEntry(
                    id = reg.definition.config[fields.id] as String,
                    label = reg.definition.config[fields.label] as String,
                    pageId = reg.definition.config[fields.pageId] as String?,
                    order = (reg.definition.config[fields.order] as? Number)?.toInt(),
                    pluginId = reg.pluginId.value,
                    group = reg.definition.config[fields.group] as? String,
                    icon = reg.definition.config[fields.icon] as? String
                )
            }
        val indexed = nav.withIndex()
        val sorted = indexed.sortedWith(
            compareBy<IndexedValue<NavigationEntry>> { pluginOrderIndex(it.value.pluginId ?: "") }
                .thenBy { it.value.order ?: Int.MAX_VALUE }
                .thenBy { it.index }
        )
        return sorted.map { it.value }
    }

    private fun buildPages(uiDefinitions: List<RegisteredUi>): List<PageDefinition> {
        return uiDefinitions
            .filter { it.definition.componentType.equals(uiConfig.pageComponentType, ignoreCase = true) }
            .map { reg ->
                val fields = uiConfig.pageFields
                PageDefinition(
                    id = reg.definition.config[fields.id] as String,
                    title = reg.definition.config[fields.title] as String,
                    sections = buildSections(reg.definition.config[fields.sections])
                )
            }
    }

    private fun buildSections(raw: Any?): List<SectionDefinition> {
        if (raw !is List<*>) return emptyList()
        return raw.mapIndexed { index, item ->
            val section = item as? Map<*, *> ?: return@mapIndexed null
            val components = (section["components"] as? List<*>).orEmpty().mapNotNull { comp ->
                val map = comp as? Map<*, *> ?: return@mapNotNull null
                val type = map["type"] as? String ?: return@mapNotNull null
                ComponentDefinition(
                    type = type,
                    config = (map["config"] as? Map<*, *>).orEmpty()
                        .mapNotNull { (key, value) ->
                            if (value == null) null else key.toString() to value
                        }
                        .toMap()
                )
            }
            SectionDefinition(
                id = (section["id"] as? String) ?: "section-${index + 1}",
                layout = (section["layout"] as? String) ?: DEFAULT_SECTION_LAYOUT,
                columns = (section["columns"] as? Number)?.toInt() ?: 1,
                components = components
            )
        }.filterNotNull()
    }

    private fun buildApp(
        uiDefinitions: List<RegisteredUi>,
        navigation: List<NavigationEntry>,
        pages: List<PageDefinition>
    ): AppConfiguration {
        val defaults = uiConfig.app
        val appDef = uiDefinitions
            .filter { it.definition.componentType.equals(uiConfig.appComponentType, ignoreCase = true) }
            .sortedBy { pluginOrderIndex(it.pluginId.value) }
            .map { it.definition.config }
            .firstOrNull()

        val fields = uiConfig.appFields
        val title = appDef?.get(fields.title) as? String ?: defaults.title
        val layout = appDef?.get(fields.layout) as? String ?: defaults.layout
        val logo = appDef?.get(fields.logo) as? String ?: defaults.logo
        val landing = uiConfig.landingPage
            ?: navigation.firstOrNull { it.pageId != null }?.pageId
            ?: pages.firstOrNull()?.id

        return AppConfiguration(
            title = title,
            logo = logo,
            layout = layout,
            landingPageId = landing,
            theme = uiConfig.theme
        )
    }

    companion object {
        const val DEFAULT_SECTION_LAYOUT = "stack"
    }
}
