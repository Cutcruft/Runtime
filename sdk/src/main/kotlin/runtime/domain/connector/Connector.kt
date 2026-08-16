package runtime.domain.connector

/**
 * Transport kind of an external connector ([DataSource]/[DataSink]).
 */
enum class ConnectorKind {
    REST,
    GRPC
}

/**
 * A registered external endpoint (REST or gRPC) that plugins reference from
 * [runtime.domain.command.InfrastructureCommand]s by id.
 */
abstract class Connector(
    val id: String,
    val kind: ConnectorKind,
    val description: String = ""
) {
    init {
        require(id.isNotBlank()) { "Connector id must not be blank" }
    }
}

/**
 * External data source: the runtime reads data from it
 * ([CommandContext.invokeDataSource]).
 */
abstract class DataSource @JvmOverloads constructor(
    id: String,
    kind: ConnectorKind,
    description: String = ""
) : Connector(id, kind, description)

/**
 * External data sink: the runtime writes data to it
 * ([CommandContext.writeDataSink]).
 */
abstract class DataSink @JvmOverloads constructor(
    id: String,
    kind: ConnectorKind,
    description: String = ""
) : Connector(id, kind, description)

/** HTTP(S) data source. Requests are sent as JSON; responses are parsed back into the plugin model. */
open class RestDataSource @JvmOverloads constructor(
    id: String,
    val baseUrl: String,
    val path: String = "",
    val method: String = "POST",
    val headers: Map<String, String> = emptyMap(),
    description: String = ""
) : DataSource(id, ConnectorKind.REST, description) {
    init {
        require(baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
            "baseUrl must start with http:// or https://"
        }
        require(method.uppercase() in HTTP_METHODS) { "unsupported HTTP method: $method" }
    }

    fun effectiveMethod(): String = method.uppercase()

    companion object {
        val HTTP_METHODS = setOf("GET", "POST", "PUT", "DELETE", "PATCH")
    }
}

/**
 * gRPC data source (unary call).
 *
 * [descriptorSet] is a serialized protobuf [com.google.protobuf.DescriptorProtos.FileDescriptorSet]
 * describing [service]/[method]; the runtime maps the plugin model to the request/response
 * messages via JSON. When null, the runtime tries to resolve the descriptor from the
 * plugin's own descriptors (or requires a registered descriptor provider).
 */
open class GrpcDataSource @JvmOverloads constructor(
    id: String,
    val target: String,
    val service: String,
    val method: String,
    val requestMessage: String,
    val responseMessage: String,
    val descriptorSet: ByteArray? = null,
    description: String = ""
) : DataSource(id, ConnectorKind.GRPC, description) {
    init {
        require(service.isNotBlank()) { "service must not be blank" }
        require(method.isNotBlank()) { "method must not be blank" }
    }
}

/** HTTP(S) data sink. Payloads are sent as JSON. */
open class RestSink @JvmOverloads constructor(
    id: String,
    val baseUrl: String,
    val path: String = "",
    val method: String = "POST",
    val headers: Map<String, String> = emptyMap(),
    description: String = ""
) : DataSink(id, ConnectorKind.REST, description) {
    init {
        require(baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
            "baseUrl must start with http:// or https://"
        }
        require(method.uppercase() in RestDataSource.HTTP_METHODS) { "unsupported HTTP method: $method" }
    }

    fun effectiveMethod(): String = method.uppercase()
}

/** gRPC data sink (unary call, response is ignored). */
open class GrpcSink @JvmOverloads constructor(
    id: String,
    val target: String,
    val service: String,
    val method: String,
    val requestMessage: String,
    val descriptorSet: ByteArray? = null,
    description: String = ""
) : DataSink(id, ConnectorKind.GRPC, description) {
    init {
        require(service.isNotBlank()) { "service must not be blank" }
        require(method.isNotBlank()) { "method must not be blank" }
    }
}
