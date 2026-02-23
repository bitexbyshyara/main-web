package co.shyara.bitex.mainweb.repository

import co.shyara.bitex.mainweb.model.BillingInfo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface BillingInfoRepository : JpaRepository<BillingInfo, UUID> {
    fun findByTenantId(tenantId: UUID): BillingInfo?
}
