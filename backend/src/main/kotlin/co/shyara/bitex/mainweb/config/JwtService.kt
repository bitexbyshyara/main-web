package co.shyara.bitex.mainweb.config

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*
import javax.crypto.SecretKey

@Service
class JwtService(
    @Value("\${app.jwt.secret}") private val secret: String,
    @Value("\${app.jwt.expiration-ms}") private val expirationMs: Long
) {
    private val signingKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    fun generateToken(userId: UUID, tenantId: UUID, role: String, tenantSlug: String): String {
        val now = Date()
        val expiry = Date(now.time + expirationMs)

        return Jwts.builder()
            .setSubject(userId.toString())
            .claim("tenantId", tenantId.toString())
            .claim("role", role)
            .claim("tenantSlug", tenantSlug)
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun validateToken(token: String): Boolean =
        try {
            getClaims(token)
            true
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
        Jwts.parserBuilder()
            .setSigningKey(signingKey)
            .build()
            .parseClaimsJws(token)
            .body
}
