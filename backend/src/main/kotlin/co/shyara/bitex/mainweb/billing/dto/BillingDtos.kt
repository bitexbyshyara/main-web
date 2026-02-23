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

data class CheckoutRequest(
    @field:Min(1) @field:Max(2) val tier: Int? = null,
    @field:Size(max = 20) val billingCycle: String? = null
)

data class CheckoutResponse(
    val razorpaySubscriptionId: String,
    val razorpayKeyId: String,
    val amount: Int,
    val currency: String,
    val planName: String,
    val tier: Int,
    val billingCycle: String
)

data class VerifyPaymentRequest(
    @field:Size(max = 100) val razorpayPaymentId: String,
    @field:Size(max = 100) val razorpaySubscriptionId: String,
    @field:Size(max = 256) val razorpaySignature: String
)

data class VerifyPaymentResponse(
    val status: String,
    val message: String,
    val subscriptionStatus: String
)
