package co.shyara.bitex.mainweb.repository

import co.shyara.bitex.mainweb.model.PaymentMethod
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PaymentMethodRepository : JpaRepository<PaymentMethod, UUID> {
    fun findAllByTenantId(tenantId: UUID): List<PaymentMethod>
}
