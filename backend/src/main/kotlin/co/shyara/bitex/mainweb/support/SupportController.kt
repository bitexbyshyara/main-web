package co.shyara.bitex.mainweb.support

import co.shyara.bitex.mainweb.support.dto.*
import jakarta.validation.Valid
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
class SupportController(
    private val supportService: SupportService
) {

    private fun principal(): Map<String, Any> {
        @Suppress("UNCHECKED_CAST")
        return SecurityContextHolder.getContext().authentication.principal as Map<String, Any>
    }

    @PostMapping("/api/support/tickets")
    fun createTicket(@Valid @RequestBody request: CreateTicketRequest): ResponseEntity<TicketResponse> {
        val p = principal()
        val tenantId = p["tenantId"] as UUID
        val userId = p["userId"] as UUID
        return ResponseEntity.ok(supportService.createTicket(tenantId, userId, request))
    }

    @GetMapping("/api/support/tickets")
    fun getTickets(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<List<TicketResponse>> {
        val tenantId = principal()["tenantId"] as UUID
        val clampedSize = size.coerceIn(1, 100)
        val pageable = PageRequest.of(page, clampedSize, Sort.by(Sort.Direction.DESC, "createdAt"))
        return ResponseEntity.ok(supportService.getTicketsPaged(tenantId, pageable))
    }

    @PostMapping("/api/contact")
    fun submitContact(@Valid @RequestBody request: ContactRequest): ResponseEntity<ContactResponse> {
        return ResponseEntity.ok(supportService.submitContact(request))
    }
}
