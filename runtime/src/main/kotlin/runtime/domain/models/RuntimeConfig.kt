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
    val app: AppConfig,
    val navigationFields: NavigationFields,
    val pageFields: PageFields,
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
    val sections: String
)

data class AppFields(
    val title: String,
    val logo: String,
    val layout: String
)

data class ThemeConfig(
    val mode: String,
    val tokens: Map<String, String>
)

data class DevConfig(
    val enabled: Boolean = false,
    val watchIntervalMs: Long = 1000,
    val watchPaths: List<String> = emptyList()
)
