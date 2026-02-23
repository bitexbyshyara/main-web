package co.shyara.bitex.mainweb.tenant.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Size

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
    @field:Size(max = 100) val name: String? = null,
    @field:Size(max = 50) val businessType: String? = null,
    @field:Size(max = 20) val phone: String? = null,
    @field:Email @field:Size(max = 255) val businessEmail: String? = null,
    @field:Size(max = 500) val website: String? = null,
    @field:Size(max = 20) val gstin: String? = null,
    @field:Size(max = 5000) val address: String? = null,
    @field:Size(max = 5000) val description: String? = null,
    @field:Size(max = 30) val paymentGateway: String? = null
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
    @field:Size(max = 255) val businessName: String? = null,
    @field:Size(max = 20) val gstin: String? = null,
    @field:Size(max = 5000) val address: String? = null,
    @field:Size(max = 100) val city: String? = null,
    @field:Size(max = 100) val state: String? = null,
    @field:Size(max = 10) val pincode: String? = null
)
