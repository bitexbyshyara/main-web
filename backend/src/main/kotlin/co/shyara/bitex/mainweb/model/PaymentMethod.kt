package co.shyara.bitex.mainweb.model

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "payment_methods")
class PaymentMethod(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Column(name = "tenant_id", nullable = false)
    var tenantId: UUID? = null,

    @Column(name = "type", nullable = false, length = 20)
    var type: String = "",

    @Column(name = "last4", length = 10)
    var last4: String? = null,

    @Column(name = "label", length = 100)
    var label: String? = null,

    @Column(name = "razorpay_token_id", length = 100)
    var razorpayTokenId: String? = null,

    @Column(name = "is_default", nullable = false)
    var isDefault: Boolean = false,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now()
)
