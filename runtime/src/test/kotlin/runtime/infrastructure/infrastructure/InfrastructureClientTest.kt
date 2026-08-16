package runtime.infrastructure.infrastructure

import com.google.protobuf.DescriptorProtos
import com.google.protobuf.Descriptors
import com.google.protobuf.DynamicMessage
import io.grpc.MethodDescriptor
import io.grpc.Server
import io.grpc.ServiceDescriptor
import io.grpc.ServerServiceDefinition
import io.grpc.inprocess.InProcessChannelBuilder
import io.grpc.inprocess.InProcessServerBuilder
import io.grpc.protobuf.ProtoUtils
import io.grpc.stub.ServerCalls
import com.sun.net.httpserver.HttpServer
import java.net.InetSocketAddress
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import runtime.application.audit.AuditService
import runtime.application.command.CommandExecutor
import runtime.application.command.ProjectLocks
import runtime.application.project.ProjectFactory
import runtime.domain.command.CommandResult
import runtime.domain.command.InfrastructureCommand
import runtime.domain.connector.GrpcDataSource
import runtime.domain.connector.RestDataSource
import runtime.domain.connector.RestSink
import runtime.domain.entity.EntityDefinition
import runtime.domain.models.Messages
import runtime.domain.models.ProjectId
import runtime.domain.plugin.PluginId
import runtime.domain.repositories.CommandRegistry
import runtime.infrastructure.inmem.InMemoryAuditLog
import runtime.infrastructure.storage.DefaultEntityStore
import runtime.infrastructure.inmem.InMemoryCommandRegistry
import runtime.infrastructure.inmem.InMemoryEntityRegistry
import runtime.infrastructure.inmem.InMemoryInfrastructureRegistry
import runtime.infrastructure.obj.SynchronizedObjectList

class InfrastructureClientTest {

    private fun client() = InfrastructureClientImpl()

    private fun httpEchoServer(): Pair<HttpServer, Int> {
        val server = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0)
        server.createContext("/echo") { exchange ->
            val body = exchange.requestBody.readBytes().toString(Charsets.UTF_8)
            val response = """{"echo":$body,"status":"ok"}"""
            val bytes = response.toByteArray()
            exchange.responseHeaders.add("Content-Type", "application/json")
            exchange.sendResponseHeaders(200, bytes.size.toLong())
            exchange.responseBody.write(bytes)
            exchange.close()
        }
        server.start()
        return server to server.address.port
    }

    @Test
    fun `rest data source returns parsed response`() {
        val (server, port) = httpEchoServer()
        try {
            val source = RestDataSource(
                id = "echo", baseUrl = "http://127.0.0.1:$port", path = "/echo", method = "POST"
            )
            val response = client().invoke<Map<String, Any?>>(source, mapOf("msg" to "hi"))
            assertEquals("ok", response?.get("status"))
            assertEquals(mapOf("msg" to "hi"), response?.get("echo"))
        } finally {
            server.stop(0)
        }
    }

    @Test
    fun `rest data sink writes payload`() {
        val (server, port) = httpEchoServer()
        try {
            val sink = RestSink(id = "out", baseUrl = "http://127.0.0.1:$port", path = "/echo", method = "POST")
            val response = client().write(sink, mapOf("msg" to "out"))
            assertEquals(mapOf("msg" to "out"), (response as Map<*, *>)["echo"])
        } finally {
            server.stop(0)
        }
    }

    @Test
    fun `http error becomes ioexception`() {
        val (server, port) = httpEchoServer()
        try {
            val source = RestDataSource(id = "bad", baseUrl = "http://127.0.0.1:$port", path = "/missing", method = "POST")
            val error = runCatching { client().invoke<Any?>(source, mapOf("x" to 1)) }.exceptionOrNull()
            assertTrue(error != null && error.message!!.contains("404"))
        } finally {
            server.stop(0)
        }
    }

    @Test
    fun `grpc data source invokes unary method via dynamic messages`() {
        val server = grpcEchoServer()
        try {
            val source = GrpcDataSource(
                id = "count",
                target = "inprocess://infra-test",
                service = "Tasks",
                method = "Count",
                requestMessage = "demo.CountRequest",
                responseMessage = "demo.CountResponse",
                descriptorSet = grpcDescriptorSet()
            )
            val response = client().invoke<Map<String, Any?>>(source, mapOf("prefix" to "hello"))
            assertEquals(5, response?.get("count"))
        } finally {
            server.shutdownNow()
        }
    }

    @Test
    fun `infrastructure command routes through executor`() = runBlocking {
        val (server, port) = httpEchoServer()
        try {
            val infrastructureRegistry = InMemoryInfrastructureRegistry()
            infrastructureRegistry.registerSource(
                PluginId("demo"),
                RestDataSource(id = "echo", baseUrl = "http://127.0.0.1:$port", path = "/echo", method = "POST")
            )
            val service = InfrastructureService(infrastructureRegistry, client())

            val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
            commandRegistry.register(
                PluginId("demo"),
                object : InfrastructureCommand(name = "echo", endpoint = "demo.echo", description = "Echo") {
                    override fun request(params: Any?): Any? = params
                }
            )
            val executor = CommandExecutor(
                commandRegistry,
                AuditService(false, 10000) { InMemoryAuditLog() },
                ProjectLocks(),
                Messages(emptyMap()),
                infrastructure = service
            )
            val project = ProjectFactory(InMemoryEntityRegistry(), DefaultEntityStore())
                .create(ProjectId.generate())

            val result = executor.execute(project, "demo.echo", mapOf("msg" to "hi"), sessionId = null)
            assertEquals(CommandResult.Status.SUCCESS, result.status, result.error)
            assertEquals(mapOf("msg" to "hi"), (result.value as Map<*, *>)["echo"])
        } finally {
            server.stop(0)
        }
    }

    @Test
    fun `unknown data source id fails the command`() = runBlocking {
        val commandRegistry: CommandRegistry = InMemoryCommandRegistry()
        commandRegistry.register(
            PluginId("demo"),
            object : InfrastructureCommand(name = "echo", endpoint = "demo.missing", description = "Echo") {
                override fun request(params: Any?): Any? = params
            }
        )
        val executor = CommandExecutor(
            commandRegistry,
            AuditService(false, 10000) { InMemoryAuditLog() },
            ProjectLocks(),
            Messages(emptyMap()),
            infrastructure = InfrastructureService(InMemoryInfrastructureRegistry(), client())
        )
        val project = ProjectFactory(InMemoryEntityRegistry(), DefaultEntityStore())
            .create(ProjectId.generate())

        val result = executor.execute(project, "demo.echo", mapOf("msg" to "hi"), sessionId = null)
        assertEquals(CommandResult.Status.ERROR, result.status)
        assertTrue(result.error!!.contains("Unknown data source"))
    }

    // ------------------------------------------------------------------
    // helpers
    // ------------------------------------------------------------------

    private fun grpcDescriptorSet(): ByteArray {
        val fileProto = DescriptorProtos.FileDescriptorProto.newBuilder()
            .setName("demo.proto")
            .setPackage("demo")
            .addMessageType(
                DescriptorProtos.DescriptorProto.newBuilder().setName("CountRequest").addField(
                    DescriptorProtos.FieldDescriptorProto.newBuilder()
                        .setName("prefix").setNumber(1)
                        .setType(DescriptorProtos.FieldDescriptorProto.Type.TYPE_STRING)
                )
            )
            .addMessageType(
                DescriptorProtos.DescriptorProto.newBuilder().setName("CountResponse").addField(
                    DescriptorProtos.FieldDescriptorProto.newBuilder()
                        .setName("count").setNumber(1)
                        .setType(DescriptorProtos.FieldDescriptorProto.Type.TYPE_INT32)
                )
            )
            .addService(
                DescriptorProtos.ServiceDescriptorProto.newBuilder().setName("Tasks").addMethod(
                    DescriptorProtos.MethodDescriptorProto.newBuilder()
                        .setName("Count")
                        .setInputType(".demo.CountRequest")
                        .setOutputType(".demo.CountResponse")
                )
            )
            .build()
        return DescriptorProtos.FileDescriptorSet.newBuilder().addFile(fileProto).build().toByteArray()
    }

    private fun grpcEchoServer(): Server {
        val fileSet = DescriptorProtos.FileDescriptorSet.parseFrom(grpcDescriptorSet())
        val fd = Descriptors.FileDescriptor.buildFrom(fileSet.fileList[0], emptyArray())
        val input = fd.findMessageTypeByName("CountRequest")
        val output = fd.findMessageTypeByName("CountResponse")
        val method = MethodDescriptor.newBuilder<DynamicMessage, DynamicMessage>()
            .setType(MethodDescriptor.MethodType.UNARY)
            .setFullMethodName(MethodDescriptor.generateFullMethodName("Tasks", "Count"))
            .setRequestMarshaller(ProtoUtils.marshaller(DynamicMessage.getDefaultInstance(input)))
            .setResponseMarshaller(ProtoUtils.marshaller(DynamicMessage.getDefaultInstance(output)))
            .build()
        val service = ServerServiceDefinition.builder(
            ServiceDescriptor.newBuilder("Tasks").addMethod(method).build()
        ).addMethod(
            method,
            ServerCalls.asyncUnaryCall(ServerCalls.UnaryMethod<DynamicMessage, DynamicMessage> { request, observer ->
                val prefix = request.getField(input.findFieldByName("prefix")) as String
                val response = DynamicMessage.newBuilder(output)
                    .setField(output.findFieldByName("count"), prefix.length)
                    .build()
                observer.onNext(response)
                observer.onCompleted()
            })
        ).build()
        return InProcessServerBuilder.forName("infra-test")
            .directExecutor()
            .addService(service)
            .build()
            .start()
    }
}
