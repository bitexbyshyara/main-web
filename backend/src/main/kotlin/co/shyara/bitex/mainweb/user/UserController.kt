package co.shyara.bitex.mainweb.user

import co.shyara.bitex.mainweb.auth.dto.MessageResponse
import co.shyara.bitex.mainweb.user.dto.*
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
@RequestMapping("/api/user")
class UserController(private val userService: UserService) {

    @GetMapping("/profile")
    fun getProfile(): ResponseEntity<UserProfileResponse> =
        ResponseEntity.ok(userService.getProfile(currentUserId()))

    @PutMapping("/profile")
    fun updateProfile(@RequestBody request: UpdateProfileRequest): ResponseEntity<UserProfileResponse> =
        ResponseEntity.ok(userService.updateProfile(currentUserId(), request))

    @PutMapping("/password")
    fun changePassword(@Valid @RequestBody request: ChangePasswordRequest): ResponseEntity<MessageResponse> =
        ResponseEntity.ok(userService.changePassword(currentUserId(), request))

    @PostMapping("/avatar")
    fun uploadAvatar(@RequestParam("file") file: MultipartFile): ResponseEntity<UserProfileResponse> =
        ResponseEntity.ok(userService.uploadAvatar(currentUserId(), file))

    @GetMapping("/notifications")
    fun getNotificationPreferences(): ResponseEntity<NotificationPreferencesResponse> =
        ResponseEntity.ok(userService.getNotificationPreferences(currentUserId()))

    @PutMapping("/notifications")
    fun updateNotificationPreferences(
        @RequestBody request: UpdateNotificationPreferencesRequest
    ): ResponseEntity<NotificationPreferencesResponse> =
        ResponseEntity.ok(userService.updateNotificationPreferences(currentUserId(), request))

    private fun currentUserId(): UUID {
        val auth = SecurityContextHolder.getContext().authentication
        val claims = auth.principal as Map<*, *>
        return claims["userId"] as UUID
    }
}
