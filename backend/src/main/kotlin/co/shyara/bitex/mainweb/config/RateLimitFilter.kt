package co.shyara.bitex.mainweb.config

import io.github.bucket4j.Bandwidth
import io.github.bucket4j.Bucket
import io.github.bucket4j.Refill
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.time.Duration
import java.util.concurrent.ConcurrentHashMap

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
class RateLimitFilter : OncePerRequestFilter() {

    private val ipBuckets = ConcurrentHashMap<String, Bucket>()
    private val userBuckets = ConcurrentHashMap<String, Bucket>()

    private data class RateRule(val capacity: Long, val refillTokens: Long, val duration: Duration)

    private val pathRules = listOf(
        Pair("/api/auth/login", RateRule(5, 5, Duration.ofMinutes(1))),
        Pair("/api/auth/register", RateRule(3, 3, Duration.ofMinutes(1))),
        Pair("/api/auth/forgot-password", RateRule(3, 3, Duration.ofMinutes(15))),
        Pair("/api/auth/reset-password", RateRule(5, 5, Duration.ofMinutes(15))),
        Pair("/api/contact", RateRule(5, 5, Duration.ofMinutes(15)))
    )

    private val uploadPaths = setOf("/api/user/avatar", "/api/tenant/logo")
    private val uploadRule = RateRule(5, 5, Duration.ofHours(1))
    private val supportTicketRule = RateRule(10, 10, Duration.ofHours(1))
    private val defaultAuthenticatedRule = RateRule(100, 100, Duration.ofMinutes(1))

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val path = request.servletPath
        val method = request.method

        if (method == "OPTIONS") {
            filterChain.doFilter(request, response)
            return
        }

        val clientIp = resolveClientIp(request)

        val specificRule = pathRules.firstOrNull { path == it.first }
        if (specificRule != null) {
            val bucketKey = "ip:$clientIp:${specificRule.first}"
            val bucket = ipBuckets.computeIfAbsent(bucketKey) { createBucket(specificRule.second) }
            if (!bucket.tryConsume(1)) {
                rejectRequest(response)
                return
            }
            filterChain.doFilter(request, response)
            return
        }

        val auth = org.springframework.security.core.context.SecurityContextHolder.getContext().authentication
        if (auth != null && auth.principal is Map<*, *>) {
            @Suppress("UNCHECKED_CAST")
            val claims = auth.principal as Map<String, Any>
            val userId = claims["userId"]?.toString() ?: clientIp

            val rule = when {
                path in uploadPaths && method == "POST" -> uploadRule
                path == "/api/support/tickets" && method == "POST" -> supportTicketRule
                else -> defaultAuthenticatedRule
            }

            val bucketKey = "user:$userId:${rule.capacity}:${rule.duration.toMillis()}"
            val bucket = userBuckets.computeIfAbsent(bucketKey) { createBucket(rule) }
            if (!bucket.tryConsume(1)) {
                rejectRequest(response)
                return
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun createBucket(rule: RateRule): Bucket {
        val bandwidth = Bandwidth.classic(rule.capacity, Refill.intervally(rule.refillTokens, rule.duration))
        return Bucket.builder().addLimit(bandwidth).build()
    }

    private fun resolveClientIp(request: HttpServletRequest): String {
        val forwarded = request.getHeader("X-Forwarded-For")
        return if (!forwarded.isNullOrBlank()) {
            forwarded.split(",").first().trim()
        } else {
            request.remoteAddr
        }
    }

    private fun rejectRequest(response: HttpServletResponse) {
        response.status = HttpStatus.TOO_MANY_REQUESTS.value()
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        response.writer.write("""{"error":"RATE_LIMITED","message":"Too many requests. Please try again later."}""")
    }
}
