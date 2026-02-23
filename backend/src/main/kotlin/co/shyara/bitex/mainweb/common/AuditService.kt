package co.shyara.bitex.mainweb.common

import org.slf4j.LoggerFactory
import org.slf4j.MarkerFactory
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuditService {

    private val log = LoggerFactory.getLogger("SECURITY_AUDIT")
    private val securityMarker = MarkerFactory.getMarker("SECURITY")

    fun logLoginSuccess(userId: UUID, ip: String, userAgent: String?) {
        log.info(securityMarker, "LOGIN_SUCCESS userId={} ip={} ua={}", userId, ip, maskUserAgent(userAgent))
    }

    fun logLoginFailure(email: String, ip: String, reason: String) {
        log.warn(securityMarker, "LOGIN_FAILURE email={} ip={} reason={}", maskEmail(email), ip, reason)
    }

    fun logRegistration(userId: UUID, tenantId: UUID) {
        log.info(securityMarker, "REGISTRATION userId={} tenantId={}", userId, tenantId)
    }

    fun logPasswordChange(userId: UUID) {
        log.info(securityMarker, "PASSWORD_CHANGE userId={}", userId)
    }

    fun logPasswordResetRequest(email: String) {
        log.info(securityMarker, "PASSWORD_RESET_REQUEST email={}", maskEmail(email))
    }

    fun logPasswordResetComplete(userId: UUID) {
        log.info(securityMarker, "PASSWORD_RESET_COMPLETE userId={}", userId)
    }

    fun logAccountLockout(userId: UUID, ip: String, attempts: Int) {
        log.warn(securityMarker, "ACCOUNT_LOCKOUT userId={} ip={} attempts={}", userId, ip, attempts)
    }

    fun logTokenRefresh(userId: UUID) {
        log.info(securityMarker, "TOKEN_REFRESH userId={}", userId)
    }

    fun logTokenRevocation(userId: UUID, reason: String) {
        log.info(securityMarker, "TOKEN_REVOCATION userId={} reason={}", userId, reason)
    }

    fun logLogout(userId: UUID) {
        log.info(securityMarker, "LOGOUT userId={}", userId)
    }

    fun logFileUpload(userId: UUID, fileType: String, fileSize: Long) {
        log.info(securityMarker, "FILE_UPLOAD userId={} type={} size={}", userId, fileType, fileSize)
    }

    fun logAuthorizationFailure(userId: UUID?, endpoint: String, requiredRole: String) {
        log.warn(securityMarker, "AUTH_FAILURE userId={} endpoint={} required={}", userId, endpoint, requiredRole)
    }

    private fun maskEmail(email: String): String {
        val parts = email.split("@")
        if (parts.size != 2) return "***"
        val local = parts[0]
        val masked = if (local.length > 2) "${local[0]}***${local.last()}" else "***"
        return "$masked@${parts[1]}"
    }

    private fun maskUserAgent(ua: String?): String {
        if (ua.isNullOrBlank()) return "unknown"
        return if (ua.length > 50) ua.substring(0, 50) + "..." else ua
    }
}
