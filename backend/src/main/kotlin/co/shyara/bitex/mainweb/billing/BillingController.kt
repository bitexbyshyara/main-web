package co.shyara.bitex.mainweb.billing

import co.shyara.bitex.mainweb.auth.dto.MessageResponse
import co.shyara.bitex.mainweb.billing.dto.*
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/billing")
class BillingController(
    private val billingService: BillingService
) {

    private fun tenantId(): UUID {
        @Suppress("UNCHECKED_CAST")
        val principal = SecurityContextHolder.getContext().authentication.principal as Map<String, Any>
        return principal["tenantId"] as UUID
    }

    @GetMapping("/subscription")
    fun getSubscription(): ResponseEntity<SubscriptionResponse> {
        return ResponseEntity.ok(billingService.getSubscription(tenantId()))
    }

    @PutMapping("/plan")
    fun changePlan(@RequestBody request: ChangePlanRequest): ResponseEntity<SubscriptionResponse> {
        return ResponseEntity.ok(billingService.changePlan(tenantId(), request))
    }

    @PostMapping("/cancel")
    fun cancelSubscription(): ResponseEntity<MessageResponse> {
        return ResponseEntity.ok(billingService.cancelSubscription(tenantId()))
    }

    @GetMapping("/invoices")
    fun getInvoices(): ResponseEntity<List<InvoiceResponse>> {
        return ResponseEntity.ok(billingService.getInvoices(tenantId()))
    }

    @GetMapping("/payment-methods")
    fun getPaymentMethods(): ResponseEntity<List<PaymentMethodResponse>> {
        return ResponseEntity.ok(billingService.getPaymentMethods(tenantId()))
    }

    @PostMapping("/payment-methods")
    fun addPaymentMethod(@RequestBody request: AddPaymentMethodRequest): ResponseEntity<PaymentMethodResponse> {
        return ResponseEntity.ok(billingService.addPaymentMethod(tenantId(), request))
    }

    @DeleteMapping("/payment-methods/{id}")
    fun removePaymentMethod(@PathVariable id: UUID): ResponseEntity<Void> {
        billingService.removePaymentMethod(id, tenantId())
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/webhook")
    fun handleWebhook(
        @RequestBody payload: String,
        @RequestHeader("X-Razorpay-Signature") signature: String
    ): ResponseEntity<Void> {
        billingService.handleWebhook(payload, signature)
        return ResponseEntity.ok().build()
    }
}
