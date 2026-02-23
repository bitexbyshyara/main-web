package co.shyara.bitex.mainweb.auth.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterRequest(
    @field:NotBlank @field:Size(max = 100) val restaurantName: String,
    @field:Email @field:NotBlank @field:Size(max = 255) val email: String,
    @field:Size(max = 20) val phone: String? = null,
    @field:Size(min = 8, max = 72) @field:NotBlank val password: String,
    val tier: Int = 1,
    @field:Size(max = 20) val billingCycle: String = "monthly"
)

data class LoginRequest(
    @field:NotBlank @field:Size(max = 255) val identifier: String,
    @field:NotBlank @field:Size(max = 72) val password: String
)

data class AuthResponse(
    val token: String,
    val refreshToken: String,
    val userId: String,
    val tenantId: String,
    val tenantSlug: String,
    val role: String,
    val email: String
)

data class RefreshRequest(
    @field:NotBlank val refreshToken: String
)

data class RefreshResponse(
    val token: String,
    val refreshToken: String
)

data class ForgotPasswordRequest(
    @field:Email @field:NotBlank @field:Size(max = 255) val email: String
)

data class ResetPasswordRequest(
    @field:NotBlank val token: String,
    @field:Size(min = 8, max = 72) @field:NotBlank val newPassword: String
)

data class MessageResponse(val message: String)
