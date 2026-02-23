package co.shyara.bitex.mainweb.common

import java.time.Instant

data class ErrorResponse(
    val error: String,
    val message: String,
    val details: Map<String, String>? = null,
    val timestamp: String = Instant.now().toString()
)
