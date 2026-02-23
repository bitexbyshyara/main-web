package co.shyara.bitex.mainweb.repository

import co.shyara.bitex.mainweb.model.SupportTicket
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SupportTicketRepository : JpaRepository<SupportTicket, UUID> {
    fun findAllByTenantIdOrderByCreatedAtDesc(tenantId: UUID): List<SupportTicket>
}
