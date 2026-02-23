package co.shyara.bitex.mainweb.support.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class CreateTicketRequest(
    @field:NotBlank val subject: String,
    @field:NotBlank val category: String,
    val priority: String = "medium",
    @field:NotBlank val description: String
)

data class TicketResponse(
    val id: String,
    val subject: String,
    val category: String,
    val priority: String,
    val description: String,
    val status: String,
    val createdAt: String,
    val updatedAt: String
)

data class ContactRequest(
    @field:NotBlank val name: String,
    @field:Email @field:NotBlank val email: String,
    val phone: String? = null,
    val restaurant: String? = null,
    @field:NotBlank val subject: String,
    @field:NotBlank val message: String
)

data class ContactResponse(
    val id: String,
    val message: String = "Thank you for contacting us. We'll get back to you soon."
)
