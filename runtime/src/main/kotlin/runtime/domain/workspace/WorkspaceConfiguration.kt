package runtime.domain.workspace

data class WorkspaceConfiguration(
    val navigation: List<NavigationEntry>,
    val pages: List<PageDefinition>,
    val components: List<ComponentDefinition>,
    val commands: List<CommandEntry>,
    val entities: List<EntityEntry>
)

data class NavigationEntry(
    val id: String,
    val label: String,
    val pageId: String?
)

data class PageDefinition(
    val id: String,
    val title: String
)

data class ComponentDefinition(
    val type: String,
    val config: Map<String, Any>
)

data class CommandEntry(
    val id: String,
    val description: String
)

data class EntityEntry(
    val type: String
)
