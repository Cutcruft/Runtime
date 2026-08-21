package com.example.demo

import runtime.domain.connector.RestDataSource

/**
 * Demo external endpoint. The WS smoke test runs a tiny HTTP echo server on this
 * port (see runtime tests); the demo command echoes any JSON payload back.
 */
class EchoDataSource :
    RestDataSource(
        id = "echo",
        baseUrl = "http://127.0.0.1:18889",
        path = "/echo",
        method = "POST",
        description = "Local HTTP echo endpoint (InfrastructureCommand demo)"
    )
