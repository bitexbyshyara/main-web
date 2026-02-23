package co.shyara.bitex.mainweb.billing

import co.shyara.bitex.mainweb.auth.dto.MessageResponse
import co.shyara.bitex.mainweb.billing.dto.*
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
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
    @PreAuthorize("hasRole('MANAGER')")
    fun getSubscription(): ResponseEntity<SubscriptionResponse> {
        return ResponseEntity.ok(billingService.getSubscription(tenantId()))
    }

    @PutMapping("/plan")
    @PreAuthorize("hasRole('MANAGER')")
    fun changePlan(@Valid @RequestBody request: ChangePlanRequest): ResponseEntity<SubscriptionResponse> {
        return ResponseEntity.ok(billingService.changePlan(tenantId(), request))
    }

    @PostMapping("/cancel")
    @PreAuthorize("hasRole('MANAGER')")
    fun cancelSubscription(): ResponseEntity<MessageResponse> {
        return ResponseEntity.ok(billingService.cancelSubscription(tenantId()))
    }

    @GetMapping("/invoices")
    @PreAuthorize("hasRole('MANAGER')")
    fun getInvoices(): ResponseEntity<List<InvoiceResponse>> {
        return ResponseEntity.ok(billingService.getInvoices(tenantId()))
    }

    @GetMapping("/payment-methods")
    @PreAuthorize("hasRole('MANAGER')")
    fun getPaymentMethods(): ResponseEntity<List<PaymentMethodResponse>> {
        return ResponseEntity.ok(billingService.getPaymentMethods(tenantId()))
    }

    @PostMapping("/payment-methods")
    @PreAuthorize("hasRole('MANAGER')")
    fun addPaymentMethod(@Valid @RequestBody request: AddPaymentMethodRequest): ResponseEntity<PaymentMethodResponse> {
        return ResponseEntity.ok(billingService.addPaymentMethod(tenantId(), request))
    }

    @DeleteMapping("/payment-methods/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    fun removePaymentMethod(@PathVariable id: UUID): ResponseEntity<Void> {
        billingService.removePaymentMethod(id, tenantId())
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('MANAGER')")
    fun initiateCheckout(@Valid @RequestBody request: CheckoutRequest): ResponseEntity<CheckoutResponse> {
        return ResponseEntity.ok(billingService.initiateCheckout(tenantId(), request))
    }

    @PostMapping("/verify-payment")
    @PreAuthorize("hasRole('MANAGER')")
    fun verifyPayment(@Valid @RequestBody request: VerifyPaymentRequest): ResponseEntity<VerifyPaymentResponse> {
        return ResponseEntity.ok(billingService.verifyPayment(tenantId(), request))
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
