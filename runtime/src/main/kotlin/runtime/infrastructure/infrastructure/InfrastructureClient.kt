package runtime.infrastructure.infrastructure

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.google.protobuf.DescriptorProtos
import com.google.protobuf.Descriptors.Descriptor
import com.google.protobuf.DynamicMessage
import com.google.protobuf.util.JsonFormat
import io.grpc.CallOptions
import io.grpc.ManagedChannel
import io.grpc.MethodDescriptor
import io.grpc.inprocess.InProcessChannelBuilder
import io.grpc.netty.shaded.io.grpc.netty.NettyChannelBuilder
import io.grpc.protobuf.ProtoUtils
import io.grpc.stub.ClientCalls
import java.io.IOException
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Duration
import java.util.concurrent.ConcurrentHashMap
import runtime.domain.connector.DataSink
import runtime.domain.connector.DataSource
import runtime.domain.connector.GrpcDataSource
import runtime.domain.connector.GrpcSink
import runtime.domain.connector.RestDataSource
import runtime.domain.connector.RestSink
import runtime.domain.repositories.InfrastructureRegistry

/**
 * Resolves registered [DataSource]/[DataSink]s by id and performs the actual external calls
 * ([InfrastructureClientImpl]). Used by command contexts ([CommandContextImpl]).
 */
class InfrastructureService(
    private val registry: InfrastructureRegistry,
    private val client: InfrastructureClient
) {
    fun <T> invokeDataSource(sourceId: String, request: Any?): T? {
        val source = registry.getSource(sourceId)
            ?: throw IllegalArgumentException("Unknown data source: $sourceId")
        return client.invoke(source, request)
    }

    fun writeDataSink(sinkId: String, payload: Any?): Any? {
        val sink = registry.getSink(sinkId)
            ?: throw IllegalArgumentException("Unknown data sink: $sinkId")
        return client.write(sink, payload)
    }
}

/** Performs external REST/gRPC calls declared by plugins. */
interface InfrastructureClient {
    fun <T> invoke(source: DataSource, request: Any?): T?

    fun write(sink: DataSink, payload: Any?): Any?
}

/** Registry that rejects registrations; default for executors that have no external connectors. */
object EmptyInfrastructureRegistry : InfrastructureRegistry {
    override fun registerSource(pluginId: runtime.domain.plugin.PluginId, source: DataSource) {
        throw UnsupportedOperationException("No infrastructure registry configured")
    }

    override fun registerSink(pluginId: runtime.domain.plugin.PluginId, sink: DataSink) {
        throw UnsupportedOperationException("No infrastructure registry configured")
    }

    override fun getSource(id: String): DataSource? = null

    override fun getSink(id: String): DataSink? = null

    override fun sources(): Map<String, DataSource> = emptyMap()

    override fun sinks(): Map<String, DataSink> = emptyMap()

    override fun clear() {}
}

/** Client that rejects calls; default for executors that have no external connectors. */
object NoopInfrastructureClient : InfrastructureClient {
    override fun <T> invoke(source: DataSource, request: Any?): T? {
        throw UnsupportedOperationException("No infrastructure client configured")
    }

    override fun write(sink: DataSink, payload: Any?): Any? {
        throw UnsupportedOperationException("No infrastructure client configured")
    }
}

class InfrastructureClientImpl(
    private val objectMapper: ObjectMapper = ObjectMapper().registerModule(KotlinModule.Builder().build())
) : InfrastructureClient {
    private val rest = RestInvoker(objectMapper)
    private val grpc = GrpcInvoker(objectMapper)

    override fun <T> invoke(source: DataSource, request: Any?): T? {
        @Suppress("UNCHECKED_CAST")
        return when (source) {
            is RestDataSource ->
                rest.invoke(source.baseUrl, source.path, source.effectiveMethod(), source.headers, request) as T?
            is GrpcDataSource ->
                grpc.invoke(
                    source.target, source.service, source.method, source.requestMessage,
                    source.responseMessage, source.descriptorSet, request
                ) as T?
            else -> throw IllegalArgumentException("Unsupported data source kind: ${source.kind}")
        }
    }

    override fun write(sink: DataSink, payload: Any?): Any? = when (sink) {
        is RestSink ->
            rest.invoke(sink.baseUrl, sink.path, sink.effectiveMethod(), sink.headers, payload)
        is GrpcSink ->
            grpc.invoke(sink.target, sink.service, sink.method, sink.requestMessage, null, sink.descriptorSet, payload)
        else -> throw IllegalArgumentException("Unsupported data sink kind: ${sink.kind}")
    }
}

/** JDK HttpClient-based REST client; request/response bodies are JSON. */
private class RestInvoker(private val objectMapper: ObjectMapper) {
    private val client: HttpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build()

    fun invoke(baseUrl: String, path: String, method: String, headers: Map<String, String>, body: Any?): Any? {
        val url = buildUrl(baseUrl, path)
        val json = body?.let { objectMapper.writeValueAsString(it) }
        val requestBuilder = HttpRequest.newBuilder(URI.create(url))
            .timeout(Duration.ofSeconds(15))
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
        headers.forEach { (k, v) -> requestBuilder.header(k, v) }
        when (method) {
            "GET" -> requestBuilder.GET()
            "DELETE" -> requestBuilder.DELETE()
            else -> requestBuilder.method(method, HttpRequest.BodyPublishers.ofString(json ?: ""))
        }
        val response = client.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofString())
        if (response.statusCode() !in 200..299) {
            throw IOException("HTTP ${response.statusCode()} from $url: ${response.body().take(200)}")
        }
        val text = response.body().trim()
        return if (text.isEmpty()) null else objectMapper.readValue(text, Any::class.java)
    }

    private fun buildUrl(baseUrl: String, path: String): String {
        val base = baseUrl.trimEnd('/')
        val suffix = path.trim('/')
        return if (suffix.isEmpty()) base else "$base/$suffix"
    }
}

/**
 * Dynamic gRPC client: invokes a unary method using the proto [GrpcDataSource.descriptorSet]
 * and maps the plugin model to/from protobuf messages via JSON (protobuf [JsonFormat]).
 */
private class GrpcInvoker(private val objectMapper: ObjectMapper) {
    private val channels = ConcurrentHashMap<String, ManagedChannel>()

    fun invoke(
        target: String,
        service: String,
        method: String,
        requestMessage: String,
        responseMessage: String?,
        descriptorSet: ByteArray?,
        request: Any?
    ): Any? {
        val endpoints = resolveEndpoints(descriptorSet, service, method)
        val requestProto = DynamicMessage.getDefaultInstance(endpoints.input)
        val responseProto = DynamicMessage.getDefaultInstance(endpoints.output)
        val methodDescriptor = MethodDescriptor.newBuilder<DynamicMessage, DynamicMessage>()
            .setType(MethodDescriptor.MethodType.UNARY)
            .setFullMethodName(MethodDescriptor.generateFullMethodName(service, method))
            .setRequestMarshaller(ProtoUtils.marshaller(requestProto))
            .setResponseMarshaller(ProtoUtils.marshaller(responseProto))
            .build()

        val requestJson = if (request == null) "{}" else objectMapper.writeValueAsString(request)
        val requestMessage = DynamicMessage.newBuilder(endpoints.input)
        JsonFormat.parser().ignoringUnknownFields().merge(requestJson, requestMessage)

        val response = ClientCalls.blockingUnaryCall(
            channel(target), methodDescriptor, CallOptions.DEFAULT, requestMessage.build()
        )
        val responseJson = JsonFormat.printer().print(response)
        return if (responseJson.isBlank()) null else objectMapper.readValue(responseJson, Any::class.java)
    }

    private data class Endpoints(val input: Descriptor, val output: Descriptor)

    private fun resolveEndpoints(descriptorSet: ByteArray?, service: String, method: String): Endpoints {
        val bytes = descriptorSet
            ?: throw IllegalArgumentException("gRPC call requires a protobuf FileDescriptorSet in the data source")
        val fileSet = DescriptorProtos.FileDescriptorSet.parseFrom(bytes)
        val built = mutableMapOf<String, com.google.protobuf.Descriptors.FileDescriptor>()
        fileSet.fileList.forEach { fileProto ->
            val deps = fileProto.dependencyList.map { depName ->
                built[depName] ?: throw IllegalArgumentException(
                    "Descriptor dependency '$depName' must precede its dependents in the FileDescriptorSet"
                )
            }
            built[fileProto.name] = com.google.protobuf.Descriptors.FileDescriptor.buildFrom(fileProto, deps.toTypedArray())
        }
        val serviceDescriptor = built.values.asSequence()
            .flatMap { it.services.asSequence() }
            .firstOrNull { it.name == service }
            ?: throw IllegalArgumentException("gRPC service '$service' not found in descriptor set")
        val methodDescriptor = serviceDescriptor.findMethodByName(method)
            ?: throw IllegalArgumentException("gRPC method '$service/$method' not found in descriptor set")
        return Endpoints(methodDescriptor.inputType, methodDescriptor.outputType)
    }

    private fun channel(target: String): ManagedChannel = channels.computeIfAbsent(target) { t ->
        when {
            t.startsWith("inprocess://") ->
                InProcessChannelBuilder.forName(t.removePrefix("inprocess://")).directExecutor().build()
            t.startsWith("dns://") || t.startsWith("unix://") ->
                NettyChannelBuilder.forTarget(t).usePlaintext().build()
            else -> {
                val host = t.substringBeforeLast(':', t)
                val port = t.substringAfterLast(':', "").toIntOrNull() ?: 443
                NettyChannelBuilder.forAddress(host, port).usePlaintext().build()
            }
        }
    }
}
