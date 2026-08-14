package runtime.domain.command

import runtime.domain.project.Project

interface ProjectBoundCommandContext : CommandContext {
    val project: Project
}
