package co.shyara.bitex.mainweb.repository

import co.shyara.bitex.mainweb.model.Subscription
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface SubscriptionRepository : JpaRepository<Subscription, UUID> {
    fun findByTenantId(tenantId: UUID): Subscription?
    fun findByRazorpaySubscriptionId(razorpaySubscriptionId: String): Subscription?
}
