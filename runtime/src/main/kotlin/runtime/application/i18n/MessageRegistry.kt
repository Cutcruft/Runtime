package runtime.application.i18n

/**
 * Aggregated message catalogs for the frontend.
 *
 * Keys are namespaced as `<pluginId>.<key>` (core keys use `core.<key>`),
 * preventing collisions between plugins.
 */
class MessageRegistry(
    val defaultLocale: String
) {
    private val catalogs = mutableMapOf<String, MutableMap<String, String>>()

    /** Merges [entries] into the catalog for [locale]. Existing keys are overridden. */
    fun register(locale: String, entries: Map<String, String>) {
        catalogs.getOrPut(locale) { mutableMapOf() }.putAll(entries)
    }

    /** Sorted list of available locales. */
    fun locales(): List<String> = catalogs.keys.sorted()

    /** Snapshot of all catalogs: locale -> (key -> text). */
    fun messages(): Map<String, Map<String, String>> =
        catalogs.mapValues { (_, entries) -> entries.toMap() }
}
