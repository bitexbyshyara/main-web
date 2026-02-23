package co.shyara.bitex.mainweb.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class SecurityHeadersFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        response.setHeader("X-Content-Type-Options", "nosniff")
        response.setHeader("X-Frame-Options", "DENY")
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
        response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

        if (request.servletPath.startsWith("/api/")) {
            response.setHeader("Cache-Control", "no-store")
        }

        if (request.servletPath.startsWith("/uploads/")) {
            response.setHeader("Content-Disposition", "attachment")
            response.setHeader("X-Content-Type-Options", "nosniff")
        }

        filterChain.doFilter(request, response)
    }
}
