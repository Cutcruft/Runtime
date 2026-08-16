package com.example.demo

import runtime.domain.command.CommandParameter
import runtime.domain.command.InfrastructureCommand

/**
 * InfrastructureCommand that calls the registered `demo.echo` REST data source
 * and returns the response (the request payload echoed back by the server).
 */
class EchoCommand :
    InfrastructureCommand(
        name = "echo",
        endpoint = "demo.echo",
        description = "Echoes the payload via the demo REST data source",
        group = "Tasks",
        parameters = listOf(
            CommandParameter("msg", "string", required = false, description = "Message to echo"),
            CommandParameter("n", "number", required = false, description = "Numeric payload")
        )
    ) {
    override fun request(params: Any?): Any? = params
}
