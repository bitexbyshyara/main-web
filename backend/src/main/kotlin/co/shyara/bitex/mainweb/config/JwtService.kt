package co.shyara.bitex.mainweb.config

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.util.*
import javax.crypto.SecretKey

@Service
class JwtService(
    @Value("\${app.jwt.secret}") private val secret: String,
    @Value("\${app.jwt.access-expiration-ms:900000}") private val accessExpirationMs: Long,
    @Value("\${app.jwt.refresh-expiration-ms:604800000}") private val refreshExpirationMs: Long
) {
    private lateinit var signingKey: SecretKey

    @PostConstruct
    fun init() {
        require(secret.isNotBlank() && secret != "CHANGE_ME") {
            "JWT_SECRET must be set to a strong, unique value. Application cannot start without it."
        }
        signingKey = Keys.hmacShaKeyFor(secret.toByteArray(StandardCharsets.UTF_8))
    }

    fun generateAccessToken(userId: UUID, tenantId: UUID, role: String, tenantSlug: String): String {
        val now = Date()
        val expiry = Date(now.time + accessExpirationMs)

        return Jwts.builder()
            .id(UUID.randomUUID().toString())
            .issuer("bitex-main-web")
            .audience().add("bitex").and()
            .subject(userId.toString())
            .claim("tenantId", tenantId.toString())
            .claim("role", role)
            .claim("tenantSlug", tenantSlug)
            .claim("type", "access")
            .issuedAt(now)
            .expiration(expiry)
            .signWith(signingKey)
            .compact()
    }

    fun generateRefreshToken(): String = UUID.randomUUID().toString()

    fun getRefreshTokenExpirationMs(): Long = refreshExpirationMs

    fun hashRefreshToken(rawToken: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(rawToken.toByteArray(StandardCharsets.UTF_8))
        return hashBytes.joinToString("") { "%02x".format(it) }
    }

    fun validateToken(token: String): Boolean =
        try {
            val claims = getClaims(token)
            claims["type"] == "access"
        } catch (_: Exception) {
            false
        }

    fun getUserId(token: String): UUID =
        UUID.fromString(getClaims(token).subject)

    fun getTenantId(token: String): UUID =
        UUID.fromString(getClaims(token)["tenantId"] as String)

    fun getRole(token: String): String =
        getClaims(token)["role"] as String

    fun getTenantSlug(token: String): String =
        getClaims(token)["tenantSlug"] as String

    fun getClaims(token: String): Claims =
        Jwts.parser()
            .requireIssuer("bitex-main-web")
            .requireAudience("bitex")
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .payload
}
