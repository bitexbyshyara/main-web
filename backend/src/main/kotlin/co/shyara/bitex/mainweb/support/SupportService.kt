package co.shyara.bitex.mainweb.support

import co.shyara.bitex.mainweb.model.ContactMessage
import co.shyara.bitex.mainweb.model.SupportTicket
import co.shyara.bitex.mainweb.repository.ContactMessageRepository
import co.shyara.bitex.mainweb.repository.SupportTicketRepository
import co.shyara.bitex.mainweb.support.dto.*
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class SupportService(
    private val supportTicketRepository: SupportTicketRepository,
    private val contactMessageRepository: ContactMessageRepository
) {

    @Transactional
    fun createTicket(tenantId: UUID, userId: UUID, request: CreateTicketRequest): TicketResponse {
        val validCategories = setOf("billing", "technical", "general", "feature", "bug")
        val validPriorities = setOf("low", "medium", "high", "urgent")

        val category = if (request.category.lowercase() in validCategories) request.category.lowercase() else "general"
        val priority = if (request.priority.lowercase() in validPriorities) request.priority.lowercase() else "medium"

        val ticket = SupportTicket(
            tenantId = tenantId,
            userId = userId,
            subject = request.subject,
            category = category,
            priority = priority,
            description = request.description
        )
        val saved = supportTicketRepository.save(ticket)
        return toResponse(saved)
    }

    @Transactional(readOnly = true)
    fun getTickets(tenantId: UUID): List<TicketResponse> {
        return supportTicketRepository.findAllByTenantIdOrderByCreatedAtDesc(tenantId)
            .map { toResponse(it) }
    }

    @Transactional(readOnly = true)
    fun getTicketsPaged(tenantId: UUID, pageable: Pageable): List<TicketResponse> {
        return supportTicketRepository.findAllByTenantId(tenantId, pageable)
            .content
            .map { toResponse(it) }
    }

    @Transactional
    fun submitContact(request: ContactRequest): ContactResponse {
        val msg = ContactMessage(
            name = request.name,
            email = request.email,
            phone = request.phone,
            restaurant = request.restaurant,
            subject = request.subject,
            message = request.message
        )
        val saved = contactMessageRepository.save(msg)
        return ContactResponse(id = saved.id.toString())
    }

    private fun toResponse(ticket: SupportTicket) = TicketResponse(
        id = ticket.id.toString(),
        subject = ticket.subject,
        category = ticket.category,
        priority = ticket.priority,
        description = ticket.description,
        status = ticket.status,
        createdAt = ticket.createdAt.toString(),
        updatedAt = ticket.updatedAt.toString()
    )
}
