package co.shyara.bitex.mainweb.tenant.dto

data class TenantSettingsResponse(
    val tenantId: String,
    val name: String,
    val slug: String,
    val logoUrl: String?,
    val businessType: String?,
    val phone: String?,
    val businessEmail: String?,
    val website: String?,
    val gstin: String?,
    val address: String?,
    val description: String?,
    val paymentGateway: String?,
    val tier: Int,
    val billingCycle: String,
    val status: String
)

data class UpdateTenantSettingsRequest(
    val name: String? = null,
    val businessType: String? = null,
    val phone: String? = null,
    val businessEmail: String? = null,
    val website: String? = null,
    val gstin: String? = null,
    val address: String? = null,
    val description: String? = null,
    val paymentGateway: String? = null
)

data class BillingInfoResponse(
    val businessName: String?,
    val gstin: String?,
    val address: String?,
    val city: String?,
    val state: String?,
    val pincode: String?
)

data class UpdateBillingInfoRequest(
    val businessName: String? = null,
    val gstin: String? = null,
    val address: String? = null,
    val city: String? = null,
    val state: String? = null,
    val pincode: String? = null
)
