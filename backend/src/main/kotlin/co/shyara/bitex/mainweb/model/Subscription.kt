package co.shyara.bitex.mainweb.model

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "subscriptions")
class Subscription(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Column(name = "tenant_id", nullable = false)
    var tenantId: UUID? = null,

    @Column(name = "razorpay_subscription_id", length = 100)
    var razorpaySubscriptionId: String? = null,

    @Column(name = "razorpay_plan_id", length = 100)
    var razorpayPlanId: String? = null,

    @Column(name = "status", nullable = false, length = 30)
    var status: String = "CREATED",

    @Column(name = "current_period_start")
    var currentPeriodStart: Instant? = null,

    @Column(name = "current_period_end")
    var currentPeriodEnd: Instant? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()
)
