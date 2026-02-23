package co.shyara.bitex.mainweb.billing

import co.shyara.bitex.mainweb.auth.dto.MessageResponse
import co.shyara.bitex.mainweb.billing.dto.*
import co.shyara.bitex.mainweb.common.ApiException
import co.shyara.bitex.mainweb.model.Invoice
import co.shyara.bitex.mainweb.model.PaymentMethod
import co.shyara.bitex.mainweb.model.Subscription
import co.shyara.bitex.mainweb.repository.*
import org.json.JSONObject
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class BillingService(
    private val subscriptionRepository: SubscriptionRepository,
    private val invoiceRepository: InvoiceRepository,
    private val paymentMethodRepository: PaymentMethodRepository,
    private val tenantRepository: TenantRepository,
    private val razorpayService: RazorpayService
) {

    fun getSubscription(tenantId: UUID): SubscriptionResponse {
        val subscription = subscriptionRepository.findByTenantId(tenantId)
            ?: throw ApiException(HttpStatus.NOT_FOUND, "SUBSCRIPTION_NOT_FOUND", "No subscription found")

        val tenant = tenantRepository.findById(tenantId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "Tenant not found") }

        return SubscriptionResponse(
            id = subscription.id.toString(),
            razorpaySubscriptionId = subscription.razorpaySubscriptionId,
            razorpayPlanId = subscription.razorpayPlanId,
            status = subscription.status,
            currentPeriodStart = subscription.currentPeriodStart?.toString(),
            currentPeriodEnd = subscription.currentPeriodEnd?.toString(),
            tier = tenant.tier,
            billingCycle = tenant.billingCycle
        )
    }

    @Transactional
    fun changePlan(tenantId: UUID, request: ChangePlanRequest): SubscriptionResponse {
        val tenant = tenantRepository.findById(tenantId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "Tenant not found") }

        val subscription = subscriptionRepository.findByTenantId(tenantId)
            ?: throw ApiException(HttpStatus.NOT_FOUND, "SUBSCRIPTION_NOT_FOUND", "No subscription found")

        if (!subscription.razorpaySubscriptionId.isNullOrBlank()) {
            razorpayService.cancelSubscription(subscription.razorpaySubscriptionId!!)
        }

        val newPlanId = razorpayService.getPlanId(request.tier, request.billingCycle)
        val ownerEmail = tenant.name
        val razorpaySubId = razorpayService.createSubscription(newPlanId, ownerEmail)

        subscription.razorpaySubscriptionId = razorpaySubId
        subscription.razorpayPlanId = newPlanId
        subscription.status = "CREATED"
        subscription.updatedAt = Instant.now()
        subscriptionRepository.save(subscription)

        tenant.tier = request.tier
        tenant.billingCycle = request.billingCycle
        tenant.updatedAt = Instant.now()
        tenantRepository.save(tenant)

        return SubscriptionResponse(
            id = subscription.id.toString(),
            razorpaySubscriptionId = razorpaySubId,
            razorpayPlanId = newPlanId,
            status = subscription.status,
            currentPeriodStart = subscription.currentPeriodStart?.toString(),
            currentPeriodEnd = subscription.currentPeriodEnd?.toString(),
            tier = tenant.tier,
            billingCycle = tenant.billingCycle
        )
    }

    @Transactional
    fun cancelSubscription(tenantId: UUID): MessageResponse {
        val subscription = subscriptionRepository.findByTenantId(tenantId)
            ?: throw ApiException(HttpStatus.NOT_FOUND, "SUBSCRIPTION_NOT_FOUND", "No subscription found")

        if (!subscription.razorpaySubscriptionId.isNullOrBlank()) {
            razorpayService.cancelSubscription(subscription.razorpaySubscriptionId!!)
        }

        subscription.status = "CANCELLED"
        subscription.updatedAt = Instant.now()
        subscriptionRepository.save(subscription)

        return MessageResponse("Subscription cancelled successfully.")
    }

    fun getInvoices(tenantId: UUID): List<InvoiceResponse> {
        return invoiceRepository.findAllByTenantIdOrderByCreatedAtDesc(tenantId).map { inv ->
            InvoiceResponse(
                id = inv.id.toString(),
                invoiceNumber = inv.invoiceNumber,
                amount = inv.amount,
                currency = inv.currency,
                status = inv.status,
                pdfUrl = inv.pdfUrl,
                createdAt = inv.createdAt.toString()
            )
        }
    }

    fun getPaymentMethods(tenantId: UUID): List<PaymentMethodResponse> {
        return paymentMethodRepository.findAllByTenantId(tenantId).map { pm ->
            PaymentMethodResponse(
                id = pm.id.toString(),
                type = pm.type,
                last4 = pm.last4,
                label = pm.label,
                isDefault = pm.isDefault
            )
        }
    }

    @Transactional
    fun addPaymentMethod(tenantId: UUID, request: AddPaymentMethodRequest): PaymentMethodResponse {
        val pm = PaymentMethod(
            tenantId = tenantId,
            type = request.type,
            last4 = request.last4,
            label = request.label,
            razorpayTokenId = request.razorpayTokenId,
            isDefault = paymentMethodRepository.findAllByTenantId(tenantId).isEmpty()
        )
        val saved = paymentMethodRepository.save(pm)
        return PaymentMethodResponse(
            id = saved.id.toString(),
            type = saved.type,
            last4 = saved.last4,
            label = saved.label,
            isDefault = saved.isDefault
        )
    }

    @Transactional
    fun removePaymentMethod(methodId: UUID, tenantId: UUID) {
        val pm = paymentMethodRepository.findById(methodId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "PAYMENT_METHOD_NOT_FOUND", "Payment method not found") }

        if (pm.tenantId != tenantId) {
            throw ApiException(HttpStatus.FORBIDDEN, "FORBIDDEN", "You do not own this payment method")
        }

        paymentMethodRepository.delete(pm)
    }

    @Transactional
    fun handleWebhook(payload: String, signature: String) {
        if (!razorpayService.verifyWebhookSignature(payload, signature)) {
            throw ApiException(HttpStatus.BAD_REQUEST, "INVALID_SIGNATURE", "Webhook signature verification failed")
        }

        val json = JSONObject(payload)
        val event = json.getString("event")
        val payloadEntity = json.getJSONObject("payload")

        when (event) {
            "subscription.activated" -> {
                val subData = payloadEntity.getJSONObject("subscription").getJSONObject("entity")
                val razorpaySubId = subData.getString("id")
                val subscription = subscriptionRepository.findByRazorpaySubscriptionId(razorpaySubId) ?: return
                subscription.status = "ACTIVE"
                subscription.currentPeriodStart = Instant.ofEpochSecond(subData.getLong("current_start"))
                subscription.currentPeriodEnd = Instant.ofEpochSecond(subData.getLong("current_end"))
                subscription.updatedAt = Instant.now()
                subscriptionRepository.save(subscription)
            }
            "subscription.charged" -> {
                val subData = payloadEntity.getJSONObject("subscription").getJSONObject("entity")
                val razorpaySubId = subData.getString("id")
                val subscription = subscriptionRepository.findByRazorpaySubscriptionId(razorpaySubId) ?: return
                subscription.currentPeriodStart = Instant.ofEpochSecond(subData.getLong("current_start"))
                subscription.currentPeriodEnd = Instant.ofEpochSecond(subData.getLong("current_end"))
                subscription.updatedAt = Instant.now()
                subscriptionRepository.save(subscription)

                val paymentData = payloadEntity.getJSONObject("payment").getJSONObject("entity")
                val invoice = Invoice(
                    tenantId = subscription.tenantId,
                    razorpayPaymentId = paymentData.getString("id"),
                    amount = paymentData.getInt("amount"),
                    currency = paymentData.getString("currency"),
                    status = "PAID"
                )
                invoiceRepository.save(invoice)
            }
            "subscription.cancelled" -> {
                val subData = payloadEntity.getJSONObject("subscription").getJSONObject("entity")
                val razorpaySubId = subData.getString("id")
                val subscription = subscriptionRepository.findByRazorpaySubscriptionId(razorpaySubId) ?: return
                subscription.status = "CANCELLED"
                subscription.updatedAt = Instant.now()
                subscriptionRepository.save(subscription)
            }
            "payment.captured" -> {
                val paymentData = payloadEntity.getJSONObject("payment").getJSONObject("entity")
                val razorpayPaymentId = paymentData.getString("id")
                val existing = invoiceRepository.findByRazorpayInvoiceId(razorpayPaymentId)
                if (existing != null) {
                    existing.status = "PAID"
                    invoiceRepository.save(existing)
                }
            }
        }
    }
}
