package runtime.application.workspace

import runtime.application.session.CommandDispatchService
import runtime.application.session.SessionManager

/**
 * V5 — all services that belong to one isolated workspace. The WS handler and
 * HTTP endpoints look a workspace up by its id (from the URL) and route
 * commands/sessions to this slice.
 */
class WorkspaceServices(
    val runtime: WorkspaceRuntime,
    val dispatchService: CommandDispatchService,
    val sessionManager: SessionManager,
    val projectService: runtime.application.project.ProjectService,
    val eventPublisher: runtime.infrastructure.ws.WsEventPublisher,
    val presenceManager: runtime.infrastructure.ws.PresenceManager,
    val activeSessions: MutableMap<String, io.ktor.websocket.DefaultWebSocketSession>
)
