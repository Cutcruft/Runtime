package runtime.domain.models

data class RuntimeConfig(
    val server: ServerConfig,
    val http: HttpConfig,
    val ws: WsConfig,
    val plugins: PluginsConfig,
    val command: CommandConfig,
    val audit: AuditConfig,
    val ui: UiConfig,
    val i18n: I18nConfig,
    val messages: Map<String, String>
)

data class I18nConfig(
    val defaultLocale: String
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
    val executorThreads: Int?
)

data class AuditConfig(
    val enabled: Boolean,
    val maxEventsPerProject: Int
)

data class UiConfig(
    val mainPlugin: String?,
    val landingPage: String?,
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
