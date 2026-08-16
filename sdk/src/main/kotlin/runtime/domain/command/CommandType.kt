package runtime.domain.command

/**
 * Functional classification of a command.
 *
 *  - [LOGICAL] - default; plain imperative logic over project models.
 *  - [ANALYTICAL] - read-only SQL/query over entity types (always treated as read).
 *  - [SYSTEM] - scripts/helpers over project models (SDK templates).
 *  - [INFRASTRUCTURE] - external calls (REST/gRPC) via registered data sources/sinks.
 *  - [PIPELINE] - orchestration of other commands as steps.
 */
enum class CommandType {
    ANALYTICAL,
    SYSTEM,
    INFRASTRUCTURE,
    PIPELINE,
    LOGICAL
}

/** Who may invoke the command. */
enum class CommandVisibility {
    /** Callable from WS/frontend and by the core. */
    PUBLIC,

    /** Internal to the core only (pipelines, scheduler, scripts). Not exposed via WS. */
    PRIVATE
}
