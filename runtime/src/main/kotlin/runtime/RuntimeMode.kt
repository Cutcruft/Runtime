package runtime

/**
 * Detects whether the application is running as a GraalVM native image or on a standard JVM.
 *
 * In native mode, dynamic code generation features (KTS scripts, Calcite SQL, H2, gRPC) are
 * unavailable. Plugins must be embedded at build time.
 */
object RuntimeMode {
    private val _isNative: Boolean by lazy {
        System.getProperty("org.graalvm.nativeimage.imagecode") != null
    }

    /** `true` when running inside a GraalVM native image. */
    val isNative: Boolean get() = _isNative

    /** `true` when running on a standard JVM (full feature set). */
    val isJvm: Boolean get() = !_isNative

    /**
     * Throws [UnsupportedOperationException] if called inside a native image.
     * Use to guard JVM-only features (KTS, Calcite, H2, gRPC).
     */
    fun requireJvm(feature: String) {
        if (isNative) {
            throw UnsupportedOperationException(
                "$feature is not available in native (GraalVM) mode. " +
                    "Use JVM mode (make dev) for this feature."
            )
        }
    }
}
