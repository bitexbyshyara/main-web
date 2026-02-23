package co.shyara.bitex.mainweb.auth

import co.shyara.bitex.mainweb.auth.dto.*
import co.shyara.bitex.mainweb.common.ApiException
import co.shyara.bitex.mainweb.config.JwtService
import co.shyara.bitex.mainweb.model.*
import co.shyara.bitex.mainweb.repository.*
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val tenantRepository: TenantRepository,
    private val subscriptionRepository: SubscriptionRepository,
    private val passwordResetTokenRepository: PasswordResetTokenRepository,
    private val jwtService: JwtService,
    private val passwordEncoder: PasswordEncoder
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw ApiException(HttpStatus.CONFLICT, "DUPLICATE_EMAIL", "Email already registered")
        }

        val slug = generateUniqueSlug(request.restaurantName)
        val tier = request.tier.coerceIn(1, 2)

        val tenant = tenantRepository.save(
            Tenant(
                name = request.restaurantName,
                slug = slug,
                tier = tier
            )
        )

        val user = userRepository.save(
            User(
                tenant = tenant,
                email = request.email,
                phone = request.phone,
                passwordHash = passwordEncoder.encode(request.password),
                role = "MANAGER"
            )
        )

        subscriptionRepository.save(
            Subscription(
                tenantId = tenant.id,
                status = "CREATED"
            )
        )

        val token = jwtService.generateToken(user.id!!, tenant.id!!, user.role, tenant.slug)

        return AuthResponse(
            token = token,
            userId = user.id.toString(),
            tenantId = tenant.id.toString(),
            tenantSlug = tenant.slug,
            role = user.role,
            email = user.email
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmailOrPhone(request.identifier, request.identifier)
            ?: throw ApiException(HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS", "Invalid credentials")

        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw ApiException(HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS", "Invalid credentials")
        }

        val tenant = user.tenant
            ?: throw ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "NO_TENANT", "User has no tenant")

        val token = jwtService.generateToken(user.id!!, tenant.id!!, user.role, tenant.slug)

        return AuthResponse(
            token = token,
            userId = user.id.toString(),
            tenantId = tenant.id.toString(),
            tenantSlug = tenant.slug,
            role = user.role,
            email = user.email
        )
    }

    @Transactional
    fun forgotPassword(request: ForgotPasswordRequest): MessageResponse {
        val user = userRepository.findByEmail(request.email)

        if (user != null) {
            val resetToken = PasswordResetToken(
                userId = user.id,
                token = UUID.randomUUID().toString(),
                expiresAt = Instant.now().plus(1, ChronoUnit.HOURS)
            )
            passwordResetTokenRepository.save(resetToken)
        }

        return MessageResponse("If an account with that email exists, a password reset link has been sent.")
    }

    @Transactional
    fun resetPassword(request: ResetPasswordRequest): MessageResponse {
        val resetToken = passwordResetTokenRepository.findByToken(request.token)
            ?: throw ApiException(HttpStatus.BAD_REQUEST, "INVALID_TOKEN", "Invalid or expired reset token")

        if (resetToken.used) {
            throw ApiException(HttpStatus.BAD_REQUEST, "TOKEN_USED", "This reset token has already been used")
        }

        if (resetToken.expiresAt.isBefore(Instant.now())) {
            throw ApiException(HttpStatus.BAD_REQUEST, "TOKEN_EXPIRED", "This reset token has expired")
        }

        val user = userRepository.findById(resetToken.userId!!)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found") }

        user.passwordHash = passwordEncoder.encode(request.newPassword)
        user.updatedAt = Instant.now()
        userRepository.save(user)

        resetToken.used = true
        passwordResetTokenRepository.save(resetToken)

        return MessageResponse("Password has been reset successfully.")
    }

    private fun generateUniqueSlug(restaurantName: String): String {
        val base = restaurantName
            .lowercase()
            .replace(Regex("[^a-z0-9]+"), "-")
            .trim('-')

        var slug: String
        do {
            val suffix = (1..4)
                .map { "abcdefghijklmnopqrstuvwxyz0123456789".random() }
                .joinToString("")
            slug = "$base-$suffix"
        } while (tenantRepository.findBySlug(slug) != null)

        return slug
    }
}
