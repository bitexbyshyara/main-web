package co.shyara.bitex.mainweb.repository

import co.shyara.bitex.mainweb.model.Invoice
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface InvoiceRepository : JpaRepository<Invoice, UUID> {
    fun findAllByTenantIdOrderByCreatedAtDesc(tenantId: UUID): List<Invoice>
    fun findByRazorpayInvoiceId(razorpayInvoiceId: String): Invoice?
    fun findByRazorpayPaymentId(razorpayPaymentId: String): Invoice?
    fun countByTenantId(tenantId: UUID): Long
    fun findFirstByTenantIdOrderByCreatedAtDesc(tenantId: UUID): Invoice?
}
