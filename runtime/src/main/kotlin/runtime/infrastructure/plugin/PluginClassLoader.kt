package runtime.infrastructure.plugin

import java.net.URL
import java.net.URLClassLoader

class PluginClassLoader(
    parent: ClassLoader,
    urls: List<URL>
) : URLClassLoader(urls.toTypedArray(), parent) {

    override fun close() {
        try {
            super.close()
        } catch (e: Exception) {
            // Log but don't throw during shutdown
        }
    }
}
