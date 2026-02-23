package co.shyara.bitex.mainweb.billing.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size

data class SubscriptionResponse(
    val id: String,
    val status: String,
    val currentPeriodStart: String?,
    val currentPeriodEnd: String?,
    val tier: Int,
    val billingCycle: String
)

data class ChangePlanRequest(
    @field:Min(1) @field:Max(2) val tier: Int,
    @field:Size(max = 20) val billingCycle: String = "monthly"
)

data class InvoiceResponse(
    val id: String,
    val invoiceNumber: String?,
    val amount: Int,
    val currency: String,
    val status: String,
    val pdfUrl: String?,
    val createdAt: String
)

data class PaymentMethodResponse(
    val id: String,
    val type: String,
    val last4: String?,
    val label: String?,
    val isDefault: Boolean
)

data class AddPaymentMethodRequest(
    @field:Size(max = 20) val type: String,
    @field:Size(max = 10) val last4: String?,
    @field:Size(max = 100) val label: String?,
    @field:Size(max = 100) val razorpayTokenId: String?
)
