package runtime.infrastructure.plugin

import runtime.domain.plugin.PluginId

data class DependencyResult(
    val sorted: List<PluginDescriptor>,
    val cycles: List<List<PluginDescriptor>>
)

class DependencyResolver {

    fun resolve(descriptors: List<PluginDescriptor>): DependencyResult {
        val graph = descriptors.associateBy { it.id }
        val state = mutableMapOf<PluginId, Int>()
        val stack = mutableListOf<PluginDescriptor>()
        val sorted = mutableListOf<PluginDescriptor>()
        val cycles = mutableListOf<List<PluginDescriptor>>()

        fun visit(descriptor: PluginDescriptor) {
            when (state[descriptor.id]) {
                2 -> return
                1 -> {
                    val start = stack.indexOfFirst { it.id == descriptor.id }
                    if (start >= 0) cycles.add(stack.subList(start, stack.size).toList())
                    return
                }
            }
            state[descriptor.id] = 1
            stack.add(descriptor)
            descriptor.dependencies.forEach { dep ->
                graph[dep.pluginId]?.let { visit(it) }
            }
            stack.removeAt(stack.size - 1)
            state[descriptor.id] = 2
            sorted.add(descriptor)
        }

        descriptors.forEach { visit(it) }
        return DependencyResult(sorted, cycles)
    }
}
