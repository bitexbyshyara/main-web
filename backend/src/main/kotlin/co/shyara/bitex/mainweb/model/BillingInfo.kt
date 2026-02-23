package co.shyara.bitex.mainweb.model

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "billing_info")
class BillingInfo(
    @Id
    @Column(name = "tenant_id")
    var tenantId: UUID? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "tenant_id")
    var tenant: Tenant? = null,

    @Column(name = "business_name", length = 255)
    var businessName: String? = null,

    @Column(name = "gstin", length = 20)
    var gstin: String? = null,

    @Column(name = "address", columnDefinition = "TEXT")
    var address: String? = null,

    @Column(name = "city", length = 100)
    var city: String? = null,

    @Column(name = "state", length = 100)
    var state: String? = null,

    @Column(name = "pincode", length = 10)
    var pincode: String? = null
)
