package co.shyara.bitex.mainweb.common

import co.shyara.bitex.mainweb.repository.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

data class DashboardResponse(
    val subscriptionStatus: String,
    val tier: Int,
    val billingCycle: String,
    val onboardingComplete: Boolean,
    val supportTicketCount: Long,
    val latestInvoice: LatestInvoiceInfo?
)

data class LatestInvoiceInfo(
    val id: String,
    val amount: Int,
    val currency: String,
    val status: String,
    val createdAt: String
)

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(
    private val tenantRepository: TenantRepository,
    private val subscriptionRepository: SubscriptionRepository,
    private val tenantSettingsRepository: TenantSettingsRepository,
    private val supportTicketRepository: SupportTicketRepository,
    private val invoiceRepository: InvoiceRepository
) {

    @GetMapping
    fun getDashboard(): ResponseEntity<DashboardResponse> {
        @Suppress("UNCHECKED_CAST")
        val principal = SecurityContextHolder.getContext().authentication.principal as Map<String, Any>
        val tenantId = principal["tenantId"] as UUID

        val tenant = tenantRepository.findById(tenantId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "Tenant not found") }

        val subscription = subscriptionRepository.findByTenantId(tenantId)

        val settings = tenantSettingsRepository.findByTenantId(tenantId)
        val onboardingComplete = settings != null
                && !settings.businessType.isNullOrBlank()
                && !settings.phone.isNullOrBlank()
                && !settings.businessEmail.isNullOrBlank()

        val ticketCount = supportTicketRepository.countByTenantId(tenantId)

        val latestInvoice = invoiceRepository.findFirstByTenantIdOrderByCreatedAtDesc(tenantId)?.let { inv ->
            LatestInvoiceInfo(
                id = inv.id.toString(),
                amount = inv.amount,
                currency = inv.currency,
                status = inv.status,
                createdAt = inv.createdAt.toString()
            )
        }

        return ResponseEntity.ok(
            DashboardResponse(
                subscriptionStatus = subscription?.status ?: "NONE",
                tier = tenant.tier,
                billingCycle = tenant.billingCycle,
                onboardingComplete = onboardingComplete,
                supportTicketCount = ticketCount,
                latestInvoice = latestInvoice
            )
        )
    }
}
