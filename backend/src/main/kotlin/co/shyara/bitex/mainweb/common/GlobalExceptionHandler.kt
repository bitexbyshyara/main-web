package co.shyara.bitex.mainweb.common

import jakarta.persistence.EntityNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.security.access.AccessDeniedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.multipart.MaxUploadSizeExceededException

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val details = ex.bindingResult.fieldErrors.associate { it.field to (it.defaultMessage ?: "invalid") }
        return ResponseEntity.badRequest().body(
            ErrorResponse(
                error = "VALIDATION_ERROR",
                message = "Request validation failed",
                details = details
            )
        )
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(ex: IllegalArgumentException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.badRequest().body(
            ErrorResponse(
                error = "BAD_REQUEST",
                message = ex.message ?: "Invalid argument"
            )
        )
    }

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDenied(ex: AccessDeniedException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            ErrorResponse(
                error = "FORBIDDEN",
                message = ex.message ?: "Access denied"
            )
        )
    }

    @ExceptionHandler(EntityNotFoundException::class, NoSuchElementException::class)
    fun handleNotFound(ex: Exception): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ErrorResponse(
                error = "NOT_FOUND",
                message = ex.message ?: "Resource not found"
            )
        )
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleUnreadable(ex: HttpMessageNotReadableException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.badRequest().body(
            ErrorResponse(
                error = "BAD_REQUEST",
                message = "Malformed request body"
            )
        )
    }

    @ExceptionHandler(MaxUploadSizeExceededException::class)
    fun handleMaxUploadSize(ex: MaxUploadSizeExceededException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(
            ErrorResponse(
                error = "PAYLOAD_TOO_LARGE",
                message = "Upload size exceeds the allowed limit"
            )
        )
    }

    @ExceptionHandler(DataIntegrityViolationException::class)
    fun handleDataIntegrity(ex: DataIntegrityViolationException): ResponseEntity<ErrorResponse> {
        log.warn("Data integrity violation: {}", ex.message)
        val message = when {
            ex.message?.contains("users_email_key", ignoreCase = true) == true -> "Email already registered"
            ex.message?.contains("tenants_slug_key", ignoreCase = true) == true -> "Please try again"
            else -> "A conflict occurred with existing data"
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
            ErrorResponse(error = "CONFLICT", message = message)
        )
    }

    @ExceptionHandler(ApiException::class)
    fun handleApiException(ex: ApiException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(ex.status).body(
            ErrorResponse(
                error = ex.error,
                message = ex.message
            )
        )
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneric(ex: Exception): ResponseEntity<ErrorResponse> {
        log.error("Unhandled exception", ex)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ErrorResponse(
                error = "INTERNAL_SERVER_ERROR",
                message = "An unexpected error occurred"
            )
        )
    }
}
