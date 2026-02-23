package co.shyara.bitex.mainweb.auth.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterRequest(
    @field:NotBlank val restaurantName: String,
    @field:Email @field:NotBlank val email: String,
    val phone: String? = null,
    @field:Size(min = 8) @field:NotBlank val password: String,
    val tier: Int = 1
)

data class LoginRequest(
    @field:NotBlank val identifier: String,
    @field:NotBlank val password: String
)

data class AuthResponse(
    val token: String,
    val userId: String,
    val tenantId: String,
    val tenantSlug: String,
    val role: String
)

data class ForgotPasswordRequest(
    @field:Email @field:NotBlank val email: String
)

data class ResetPasswordRequest(
    @field:NotBlank val token: String,
    @field:Size(min = 8) @field:NotBlank val newPassword: String
)

data class MessageResponse(val message: String)
