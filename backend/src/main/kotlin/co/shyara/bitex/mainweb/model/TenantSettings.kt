package co.shyara.bitex.mainweb.model

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "tenant_settings")
class TenantSettings(
    @Id
    @Column(name = "tenant_id")
    var tenantId: UUID? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "tenant_id")
    var tenant: Tenant? = null,

    @Column(name = "logo_url", length = 500)
    var logoUrl: String? = null,

    @Column(name = "business_type", length = 50)
    var businessType: String? = null,

    @Column(name = "phone", length = 20)
    var phone: String? = null,

    @Column(name = "business_email", length = 255)
    var businessEmail: String? = null,

    @Column(name = "website", length = 255)
    var website: String? = null,

    @Column(name = "gstin", length = 20)
    var gstin: String? = null,

    @Column(name = "address", columnDefinition = "TEXT")
    var address: String? = null,

    @Column(name = "description", columnDefinition = "TEXT")
    var description: String? = null,

    @Column(name = "payment_gateway", length = 30)
    var paymentGateway: String? = null,

    @Column(name = "gateway_credentials_encrypted", columnDefinition = "TEXT")
    var gatewayCredentialsEncrypted: String? = null
)
