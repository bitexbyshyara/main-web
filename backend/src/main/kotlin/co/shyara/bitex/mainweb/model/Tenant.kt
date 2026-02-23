package co.shyara.bitex.mainweb.model

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "tenants")
class Tenant(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Column(name = "slug", nullable = false, unique = true, length = 100)
    var slug: String = "",

    @Column(name = "name", nullable = false, length = 255)
    var name: String = "",

    @Column(name = "tier", nullable = false)
    var tier: Int = 1,

    @Column(name = "billing_cycle", nullable = false, length = 20)
    var billingCycle: String = "monthly",

    @Column(name = "status", nullable = false, length = 20)
    var status: String = "ACTIVE",

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()
)
