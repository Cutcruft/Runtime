package com.example.demo

import runtime.domain.command.AnalyticalCommand

/**
 * SQL report over the project's tasks (AnalyticalCommand: executed by the
 * runtime's Calcite engine against the auto-derived `demo.task` table).
 */
class TaskReportCommand :
    AnalyticalCommand(
        name = "report",
        sql = "SELECT status, COUNT(*) AS cnt FROM demo.task GROUP BY status ORDER BY status",
        description = "Task counts by status (SQL)",
        group = "Tasks"
    )
