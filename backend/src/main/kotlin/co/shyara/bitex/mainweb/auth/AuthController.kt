package co.shyara.bitex.mainweb.auth

import co.shyara.bitex.mainweb.auth.dto.*
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> =
        ResponseEntity.ok(authService.register(request))

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> =
        ResponseEntity.ok(authService.login(request))

    @PostMapping("/refresh")
    fun refresh(@Valid @RequestBody request: RefreshRequest): ResponseEntity<RefreshResponse> =
        ResponseEntity.ok(authService.refresh(request))

    @PostMapping("/logout")
    fun logout(): ResponseEntity<MessageResponse> {
        val auth = SecurityContextHolder.getContext().authentication
        if (auth != null && auth.principal is Map<*, *>) {
            @Suppress("UNCHECKED_CAST")
            val claims = auth.principal as Map<String, Any>
            val userId = claims["userId"] as UUID
            authService.logout(userId)
        }
        return ResponseEntity.ok(MessageResponse("Logged out successfully"))
    }

    @PostMapping("/forgot-password")
    fun forgotPassword(@Valid @RequestBody request: ForgotPasswordRequest): ResponseEntity<MessageResponse> =
        ResponseEntity.ok(authService.forgotPassword(request))

    @PostMapping("/reset-password")
    fun resetPassword(@Valid @RequestBody request: ResetPasswordRequest): ResponseEntity<MessageResponse> =
        ResponseEntity.ok(authService.resetPassword(request))
}
