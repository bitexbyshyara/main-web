package co.shyara.bitex.mainweb.common

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import javax.sql.DataSource

@RestController
class HealthController(private val dataSource: DataSource) {

    @GetMapping("/healthz")
    fun health(): ResponseEntity<Map<String, String>> {
        return try {
            dataSource.connection.use { it.isValid(2) }
            ResponseEntity.ok(mapOf("status" to "ok"))
        } catch (e: Exception) {
            ResponseEntity.status(503).body(mapOf("status" to "unhealthy"))
        }
    }
}
