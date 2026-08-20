package runtime.domain.models

data class RuntimeConfig(
    val server: ServerConfig,
    val http: HttpConfig,
    val ws: WsConfig,
    val plugins: PluginsConfig,
    val command: CommandConfig,
    val audit: AuditConfig,
    val storage: StorageConfig,
    val routing: RoutingConfig,
    val ui: UiConfig,
    val i18n: I18nConfig,
    val messages: Map<String, String>,
    val dev: DevConfig = DevConfig(),
    val collaboration: CollaborationConfig = CollaborationConfig()
)

data class CollaborationConfig(
    val enabled: Boolean = false,
    val cursorsEnabled: Boolean = false
)

/** URL routing of the shell. `mode`: `hash` (`#/page/<id>`) or `history` (`/page/<id>`). */
data class RoutingConfig(
    val mode: String,
    val redirects: List<RedirectRule>
)

/** `from` matches the requested page id (deep-link, navigation.request, landing); resolves to `to`. */
data class RedirectRule(
    val from: String,
    val to: String
)

data class StorageConfig(
    val backend: String,
    val enabled: Boolean,
    val maxEntities: Int,
    val eviction: String,
    val directory: String,
    val redisUrl: String?,
    val dbUrl: String?
)

data class I18nConfig(
    val defaultLocale: String,
    val locales: List<String>
)

data class ServerConfig(
    val host: String,
    val port: Int
)

data class HttpConfig(
    val configPath: String,
    val staticRoot: String
)

data class WsConfig(
    val path: String
)

data class PluginsConfig(
    val directories: List<String>,
    val configFileName: String,
    val apiVersion: Int
)

data class CommandConfig(
    val executorThreads: Int?,
    val maxConcurrency: Int?,
    val queueWaitMs: Long?,
    val timeoutMs: Long?,
    val wsConcurrency: Int?
)

data class AuditConfig(
    val enabled: Boolean,
    val maxEventsPerProject: Int
)

data class UiConfig(
    val pluginOrder: List<String>,
    val landingPage: String?,
    val navInclude: List<String>,
    val navExclude: List<String>,
    val navigationComponentType: String,
    val pageComponentType: String,
    val appComponentType: String,
    val shortcutComponentType: String,
    val subscriptionComponentType: String,
    val overlayComponentType: String,
    val overlayTriggerComponentType: String,
    val layerComponentType: String,
    val app: AppConfig,
    val navigationFields: NavigationFields,
    val pageFields: PageFields,
    val layerFields: LayerFields,
    val appFields: AppFields,
    val theme: ThemeConfig
)

data class AppConfig(
    val title: String,
    val logo: String?,
    val layout: String
)

data class NavigationFields(
    val id: String,
    val label: String,
    val pageId: String,
    val order: String,
    val group: String,
    val icon: String
)

data class PageFields(
    val id: String,
    val title: String,
    val sections: String,
    val layers: String
)

data class LayerFields(
    val pageId: String,
    val id: String,
    val title: String,
    val order: String,
    val visible: String,
    val opacity: String,
    val positionType: String,
    val pointerEvents: String,
    val className: String,
    val sections: String
)

data class AppFields(
    val title: String,
    val logo: String,
    val layout: String
)

/** Semantic color roles per theme mode. */
data class ThemePalette(
    val bg: String,
    val surface: String,
    val text: String,
    val muted: String,
    val border: String,
    val primary: String,
    val primaryHover: String,
    val danger: String,
    val success: String,
    val warning: String,
    val info: String
)

/** Typography scale: families + base sizes. */
data class ThemeTypography(
    val fontFamily: String = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    val headingFont: String? = null,
    val monospaceFont: String = "'SF Mono', Menlo, monospace",
    val baseSize: String = "14px",
    val scale: Map<String, String> = emptyMap()
)

/** Radii / spacing / motion tokens. */
data class ThemeRadii(
    val sm: String = "6px",
    val md: String = "8px",
    val lg: String = "12px",
    val xl: String = "16px"
)

data class ThemeSpacing(
    val xs: String = "4px",
    val sm: String = "8px",
    val md: String = "12px",
    val lg: String = "20px",
    val xl: String = "32px"
)

data class ThemeMotion(
    val duration: Map<String, String> = emptyMap(),
    val easing: Map<String, String> = emptyMap()
)

/**
 * V7.1 — typed theme. `mode` selects the active palette; `palette` holds semantic
 * color roles for light/dark; typography/radii/spacing/motion are shared tokens.
 * The frontend flattens this into `--rt-*` CSS variables. `tokens` remains as a
 * catch-all for arbitrary overrides.
 */
data class ThemeConfig(
    val mode: String,
    val tokens: Map<String, String>,
    val palette: Map<String, ThemePalette> = emptyMap(),
    val typography: ThemeTypography = ThemeTypography(),
    val radii: ThemeRadii = ThemeRadii(),
    val spacing: ThemeSpacing = ThemeSpacing(),
    val motion: ThemeMotion = ThemeMotion()
)

data class DevConfig(
    val enabled: Boolean = false,
    val watchIntervalMs: Long = 1000,
    val watchPaths: List<String> = emptyList()
)
