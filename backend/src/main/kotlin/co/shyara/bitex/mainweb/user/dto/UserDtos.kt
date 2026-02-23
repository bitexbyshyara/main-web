package co.shyara.bitex.mainweb.user.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class UserProfileResponse(
    val id: String,
    val email: String,
    val phone: String?,
    val firstName: String?,
    val lastName: String?,
    val avatarUrl: String?,
    val role: String,
    val twoFaEnabled: Boolean,
    val tenantId: String,
    val tenantSlug: String,
    val tenantName: String
)

data class UpdateProfileRequest(
    val firstName: String? = null,
    val lastName: String? = null,
    val phone: String? = null
)

data class ChangePasswordRequest(
    @field:NotBlank val currentPassword: String,
    @field:Size(min = 8, message = "Password must be at least 8 characters") @field:NotBlank val newPassword: String
)

data class NotificationPreferencesResponse(
    val orderAlerts: Boolean,
    val staffUpdates: Boolean,
    val billingReminders: Boolean,
    val promotions: Boolean,
    val weeklyReports: Boolean,
    val securityAlerts: Boolean
)

data class UpdateNotificationPreferencesRequest(
    val orderAlerts: Boolean? = null,
    val staffUpdates: Boolean? = null,
    val billingReminders: Boolean? = null,
    val promotions: Boolean? = null,
    val weeklyReports: Boolean? = null,
    val securityAlerts: Boolean? = null
)
