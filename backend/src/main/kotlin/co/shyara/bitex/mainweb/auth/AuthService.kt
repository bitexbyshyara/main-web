package co.shyara.bitex.mainweb.auth

import co.shyara.bitex.mainweb.auth.dto.*
import co.shyara.bitex.mainweb.common.ApiException
import co.shyara.bitex.mainweb.common.PasswordValidator
import co.shyara.bitex.mainweb.config.JwtService
import co.shyara.bitex.mainweb.model.*
import co.shyara.bitex.mainweb.repository.*
import org.slf4j.LoggerFactory
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
    private val refreshTokenRepository: RefreshTokenRepository,
    private val jwtService: JwtService,
    private val passwordEncoder: PasswordEncoder
) {
    private val log = LoggerFactory.getLogger(AuthService::class.java)

    companion object {
        private const val MAX_LOGIN_ATTEMPTS = 5
        private const val LOCKOUT_MINUTES_SHORT = 15L
        private const val LOCKOUT_MINUTES_LONG = 60L
        private const val LONG_LOCKOUT_THRESHOLD = 10
    }

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        PasswordValidator.validate(request.password, request.email)

        if (userRepository.existsByEmail(request.email)) {
            throw ApiException(HttpStatus.CONFLICT, "DUPLICATE_EMAIL", "Email already registered")
        }

        val slug = generateUniqueSlug(request.restaurantName)
        val tier = request.tier.coerceIn(1, 2)

        val cycle = if (request.billingCycle in listOf("monthly", "yearly")) request.billingCycle else "monthly"
        val tenant = tenantRepository.save(
            Tenant(name = request.restaurantName, slug = slug, tier = tier, billingCycle = cycle)
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

        subscriptionRepository.save(Subscription(tenantId = tenant.id, status = "CREATED"))

        log.info("SECURITY: User registered userId={} tenantId={}", user.id, tenant.id)

        return buildAuthResponse(user, tenant)
    }

    @Transactional
    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmailOrPhone(request.identifier, request.identifier)
            ?: throw ApiException(HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS", "Invalid credentials")

        if (user.lockedUntil != null && user.lockedUntil!!.isAfter(Instant.now())) {
            log.warn("SECURITY: Login attempt on locked account userId={}", user.id)
            throw ApiException(HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS", "Invalid credentials")
        }

        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            handleFailedLogin(user)
            throw ApiException(HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS", "Invalid credentials")
        }

        user.loginAttempts = 0
        user.lockedUntil = null
        user.updatedAt = Instant.now()
        userRepository.save(user)

        val tenant = user.tenant
            ?: throw ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "NO_TENANT", "User has no tenant")

        log.info("SECURITY: Login success userId={}", user.id)

        return buildAuthResponse(user, tenant)
    }

    @Transactional
    fun refresh(request: RefreshRequest): RefreshResponse {
        val tokenHash = jwtService.hashRefreshToken(request.refreshToken)
        val storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
            ?: throw ApiException(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "Invalid refresh token")

        if (storedToken.revoked || storedToken.expiresAt.isBefore(Instant.now())) {
            if (!storedToken.revoked) {
                refreshTokenRepository.revokeAllByUserId(storedToken.userId!!)
                log.warn("SECURITY: Expired refresh token used, revoking all for userId={}", storedToken.userId)
            }
            throw ApiException(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "Invalid refresh token")
        }

        storedToken.revoked = true
        refreshTokenRepository.save(storedToken)

        val user = userRepository.findById(storedToken.userId!!)
            .orElseThrow { ApiException(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "Invalid refresh token") }
        val tenant = user.tenant
            ?: throw ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "NO_TENANT", "User has no tenant")

        val newAccessToken = jwtService.generateAccessToken(user.id!!, tenant.id!!, user.role, tenant.slug)
        val newRawRefreshToken = jwtService.generateRefreshToken()
        saveRefreshToken(user.id!!, newRawRefreshToken)

        return RefreshResponse(token = newAccessToken, refreshToken = newRawRefreshToken)
    }

    @Transactional
    fun logout(userId: UUID) {
        refreshTokenRepository.revokeAllByUserId(userId)
        log.info("SECURITY: Logout userId={}, all refresh tokens revoked", userId)
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
            log.info("SECURITY: Password reset requested for userId={}", user.id)
        }

        // Constant-time: always return same message regardless of whether email exists
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

        PasswordValidator.validate(request.newPassword, user.email)

        user.passwordHash = passwordEncoder.encode(request.newPassword)
        user.loginAttempts = 0
        user.lockedUntil = null
        user.updatedAt = Instant.now()
        userRepository.save(user)

        resetToken.used = true
        passwordResetTokenRepository.save(resetToken)

        refreshTokenRepository.revokeAllByUserId(user.id!!)
        log.info("SECURITY: Password reset completed for userId={}, all tokens revoked", user.id)

        return MessageResponse("Password has been reset successfully.")
    }

    private fun buildAuthResponse(user: User, tenant: Tenant): AuthResponse {
        val accessToken = jwtService.generateAccessToken(user.id!!, tenant.id!!, user.role, tenant.slug)
        val rawRefreshToken = jwtService.generateRefreshToken()
        saveRefreshToken(user.id!!, rawRefreshToken)

        return AuthResponse(
            token = accessToken,
            refreshToken = rawRefreshToken,
            userId = user.id.toString(),
            tenantId = tenant.id.toString(),
            tenantSlug = tenant.slug,
            role = user.role,
            email = user.email
        )
    }

    private fun saveRefreshToken(userId: UUID, rawToken: String) {
        val tokenHash = jwtService.hashRefreshToken(rawToken)
        refreshTokenRepository.save(
            RefreshToken(
                userId = userId,
                tokenHash = tokenHash,
                expiresAt = Instant.now().plusMillis(jwtService.getRefreshTokenExpirationMs())
            )
        )
    }

    private fun handleFailedLogin(user: User) {
        user.loginAttempts += 1
        if (user.loginAttempts >= LONG_LOCKOUT_THRESHOLD) {
            user.lockedUntil = Instant.now().plus(LOCKOUT_MINUTES_LONG, ChronoUnit.MINUTES)
            log.warn("SECURITY: Account locked for {} min, userId={}, attempts={}", LOCKOUT_MINUTES_LONG, user.id, user.loginAttempts)
        } else if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            user.lockedUntil = Instant.now().plus(LOCKOUT_MINUTES_SHORT, ChronoUnit.MINUTES)
            log.warn("SECURITY: Account locked for {} min, userId={}, attempts={}", LOCKOUT_MINUTES_SHORT, user.id, user.loginAttempts)
        }
        user.updatedAt = Instant.now()
        userRepository.save(user)
    }

    private fun generateUniqueSlug(restaurantName: String): String {
        val base = restaurantName
            .lowercase()
            .replace(Regex("[^a-z0-9]+"), "-")
            .trim('-')
            .take(50)

        var slug: String
        do {
            val suffix = (1..6)
                .map { "abcdefghijklmnopqrstuvwxyz0123456789".random() }
                .joinToString("")
            slug = "$base-$suffix"
        } while (tenantRepository.findBySlug(slug) != null)

        return slug
    }
}
