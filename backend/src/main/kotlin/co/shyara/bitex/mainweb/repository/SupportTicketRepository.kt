package co.shyara.bitex.mainweb.repository

import co.shyara.bitex.mainweb.model.SupportTicket
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SupportTicketRepository : JpaRepository<SupportTicket, UUID> {
    fun findAllByTenantIdOrderByCreatedAtDesc(tenantId: UUID): List<SupportTicket>
    fun findAllByTenantId(tenantId: UUID, pageable: Pageable): Page<SupportTicket>
    fun countByTenantId(tenantId: UUID): Long
}
