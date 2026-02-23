package co.shyara.bitex.mainweb.support.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateTicketRequest(
    @field:NotBlank @field:Size(max = 255) val subject: String,
    @field:NotBlank @field:Size(max = 30) val category: String,
    @field:Size(max = 20) val priority: String = "medium",
    @field:NotBlank @field:Size(max = 5000) val description: String
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
    @field:NotBlank @field:Size(max = 100) val name: String,
    @field:Email @field:NotBlank @field:Size(max = 255) val email: String,
    @field:Size(max = 20) val phone: String? = null,
    @field:Size(max = 100) val restaurant: String? = null,
    @field:NotBlank @field:Size(max = 255) val subject: String,
    @field:NotBlank @field:Size(max = 5000) val message: String
)

data class ContactResponse(
    val id: String,
    val message: String = "Thank you for contacting us. We'll get back to you soon."
)
