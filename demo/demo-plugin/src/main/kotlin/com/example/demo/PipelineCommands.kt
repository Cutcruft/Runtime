package com.example.demo

import runtime.domain.command.PipelineCommand
import runtime.domain.command.PipelineStep

class SeedTasksPipeline : PipelineCommand(
    name = "seedtasks",
    steps = listOf(
        PipelineStep("demo.create", mapOf("title" to "Seed alpha")),
        PipelineStep("demo.create", mapOf("title" to "Seed beta")),
        PipelineStep("demo.create", mapOf("title" to "Seed gamma")),
        PipelineStep("demo.report")
    ),
    description = "Create three demo tasks and run the task report",
    group = "Tasks"
)

class PipelineWithInput : PipelineCommand(
    name = "pipelineinput",
    steps = listOf(
        PipelineStep(
            command = "demo.create",
            params = mapOf("title" to "From pipeline"),
            output = mapOf("title" to "createdTitle")
        ),
        PipelineStep(
            command = "demo.create",
            params = mapOf("title" to "seed"),
            input = mapOf("title" to "createdTitle"),
            output = mapOf("title" to "duplicateTitle")
        ),
        PipelineStep("demo.report")
    ),
    description = "Shows variable capture (output) and reuse (input) across steps",
    group = "Tasks"
)

class IgnoreErrorPipeline : PipelineCommand(
    name = "pipelineignore",
    steps = listOf(
        PipelineStep("demo.missingStep", ignoreError = true),
        PipelineStep("demo.stats"),
        PipelineStep("demo.report")
    ),
    description = "A failing step with ignoreError does not stop the pipeline",
    group = "Tasks"
)

class FailFastPipeline : PipelineCommand(
    name = "pipelinefail",
    steps = listOf(
        PipelineStep("demo.missingStep"),
        PipelineStep("demo.report")
    ),
    description = "A failing step stops the pipeline with the step index",
    group = "Tasks"
)
