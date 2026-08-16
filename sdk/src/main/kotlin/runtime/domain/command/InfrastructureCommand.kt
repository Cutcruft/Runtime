package runtime.domain.command

import runtime.domain.connector.Connector
import runtime.domain.connector.DataSource
import runtime.domain.connector.DataSink

/**
 * A command that talks to an external endpoint registered as a [DataSource] or
 * [DataSink] via [CommandContext.invokeDataSource]/[CommandContext.writeDataSink].
 *
 *  - the plugin builds the request body in [request] (returns any Jackson-serializable value);
 *  - the runtime performs the external call (REST or gRPC depending on the connector kind);
 *  - the response is deserialized and passed to [parseResponse], which maps it back into a
 *    plugin model (default: identity).
 *
 * External calls do not mutate project state by default, so the command runs under the
 * shared read lock unless [readOnly] is overridden to `false`.
 */
abstract class InfrastructureCommand @JvmOverloads constructor(
    name: String,
    /** Id of the registered [DataSource] (SOURCE mode) or [DataSink] (SINK mode). */
    val endpoint: String,
    description: String = "",
    group: String? = null,
    /** Default mode: read from a [DataSource]. */
    val mode: EndpointMode = EndpointMode.SOURCE,
    /**
     * External IO does not touch project state, so the command is treated as read-only
     * (shared lock). Set `false` when the command also mutates project entities.
     */
    readOnly: Boolean = true,
    parameters: List<CommandParameter> = emptyList()
) : Command(
    name,
    description,
    group,
    readOnly = readOnly,
    type = CommandType.INFRASTRUCTURE,
    parameters = parameters
) {

    enum class EndpointMode { SOURCE, SINK }

    init {
        require(endpoint.isNotBlank()) { "InfrastructureCommand endpoint must not be blank" }
    }

    /** Builds the request body from the command params. */
    abstract fun request(params: Any?): Any?

    /** Maps the raw response into a plugin model (default: identity). */
    open fun parseResponse(response: Any?): Any? = response

    override suspend fun executeInternal(context: CommandContext, params: Any?): CommandResult {
        val body = request(params)
        return try {
            when (mode) {
                EndpointMode.SOURCE -> {
                    val response = context.invokeDataSource<Any?>(endpoint, body)
                    CommandResult.success(parseResponse(response))
                }
                EndpointMode.SINK -> {
                    val response = context.writeDataSink(endpoint, body)
                    CommandResult.success(response)
                }
            }
        } catch (e: Exception) {
            CommandResult.error(e.message ?: "External call to '$endpoint' failed")
        }
    }
}
