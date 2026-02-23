package co.shyara.bitex.mainweb.billing.dto

data class SubscriptionResponse(
    val id: String,
    val razorpaySubscriptionId: String?,
    val razorpayPlanId: String?,
    val status: String,
    val currentPeriodStart: String?,
    val currentPeriodEnd: String?,
    val tier: Int,
    val billingCycle: String
)

data class ChangePlanRequest(
    val tier: Int,
    val billingCycle: String = "monthly"
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
    val type: String,
    val last4: String?,
    val label: String?,
    val razorpayTokenId: String?
)
