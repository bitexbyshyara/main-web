package co.shyara.bitex.mainweb.user

import co.shyara.bitex.mainweb.auth.dto.MessageResponse
import co.shyara.bitex.mainweb.common.ApiException
import co.shyara.bitex.mainweb.model.NotificationPreferences
import co.shyara.bitex.mainweb.repository.NotificationPreferencesRepository
import co.shyara.bitex.mainweb.repository.TenantRepository
import co.shyara.bitex.mainweb.repository.UserRepository
import co.shyara.bitex.mainweb.user.dto.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.time.Instant
import java.util.UUID

@Service
class UserService(
    private val userRepository: UserRepository,
    private val tenantRepository: TenantRepository,
    private val notificationPreferencesRepository: NotificationPreferencesRepository,
    private val passwordEncoder: PasswordEncoder,
    @Value("\${app.upload.dir:uploads}") private val uploadDir: String
) {

    fun getProfile(userId: UUID): UserProfileResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found") }
        val tenant = user.tenant
            ?: throw ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "NO_TENANT", "User has no tenant")

        return UserProfileResponse(
            id = user.id.toString(),
            email = user.email,
            phone = user.phone,
            firstName = user.firstName,
            lastName = user.lastName,
            avatarUrl = user.avatarUrl,
            role = user.role,
            twoFaEnabled = user.twoFaEnabled,
            tenantId = tenant.id.toString(),
            tenantSlug = tenant.slug,
            tenantName = tenant.name
        )
    }

    @Transactional
    fun updateProfile(userId: UUID, request: UpdateProfileRequest): UserProfileResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found") }

        request.firstName?.let { user.firstName = it }
        request.lastName?.let { user.lastName = it }
        request.phone?.let { user.phone = it }
        user.updatedAt = Instant.now()

        userRepository.save(user)

        return getProfile(userId)
    }

    fun changePassword(userId: UUID, request: ChangePasswordRequest): MessageResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found") }

        if (!passwordEncoder.matches(request.currentPassword, user.passwordHash)) {
            throw ApiException(HttpStatus.BAD_REQUEST, "BAD_PASSWORD", "Current password is incorrect")
        }

        user.passwordHash = passwordEncoder.encode(request.newPassword)
        user.updatedAt = Instant.now()
        userRepository.save(user)

        return MessageResponse("Password updated successfully")
    }

    @Transactional
    fun uploadAvatar(userId: UUID, file: MultipartFile): UserProfileResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found") }

        val dir = Paths.get(uploadDir, "avatars")
        Files.createDirectories(dir)

        val extension = file.originalFilename?.substringAfterLast('.', "") ?: "png"
        val filename = "${userId}_${System.currentTimeMillis()}.$extension"
        val filePath = dir.resolve(filename)

        Files.copy(file.inputStream, filePath, StandardCopyOption.REPLACE_EXISTING)

        user.avatarUrl = "/uploads/avatars/$filename"
        user.updatedAt = Instant.now()
        userRepository.save(user)

        return getProfile(userId)
    }

    fun getNotificationPreferences(userId: UUID): NotificationPreferencesResponse {
        val prefs = notificationPreferencesRepository.findByUserId(userId)

        return NotificationPreferencesResponse(
            orderAlerts = prefs?.orderAlerts ?: true,
            staffUpdates = prefs?.staffUpdates ?: true,
            billingReminders = prefs?.billingReminders ?: true,
            promotions = prefs?.promotions ?: false,
            weeklyReports = prefs?.weeklyReports ?: true,
            securityAlerts = prefs?.securityAlerts ?: true
        )
    }

    @Transactional
    fun updateNotificationPreferences(
        userId: UUID,
        request: UpdateNotificationPreferencesRequest
    ): NotificationPreferencesResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found") }

        val prefs = notificationPreferencesRepository.findByUserId(userId)
            ?: NotificationPreferences(userId = userId, user = user)

        request.orderAlerts?.let { prefs.orderAlerts = it }
        request.staffUpdates?.let { prefs.staffUpdates = it }
        request.billingReminders?.let { prefs.billingReminders = it }
        request.promotions?.let { prefs.promotions = it }
        request.weeklyReports?.let { prefs.weeklyReports = it }
        request.securityAlerts?.let { prefs.securityAlerts = it }

        notificationPreferencesRepository.save(prefs)

        return getNotificationPreferences(userId)
    }
}
