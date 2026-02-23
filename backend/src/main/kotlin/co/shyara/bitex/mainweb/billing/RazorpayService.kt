package co.shyara.bitex.mainweb.billing

import co.shyara.bitex.mainweb.common.ApiException
import com.razorpay.RazorpayClient
import jakarta.annotation.PostConstruct
import org.json.JSONObject
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import java.security.MessageDigest
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

@Service
class RazorpayService(
    @Value("\${app.razorpay.key-id}") private val keyId: String,
    @Value("\${app.razorpay.key-secret}") private val keySecret: String,
    @Value("\${app.razorpay.webhook-secret}") private val webhookSecret: String,
    @Value("\${app.razorpay.plan-1-monthly}") private val plan1Monthly: String,
    @Value("\${app.razorpay.plan-1-yearly}") private val plan1Yearly: String,
    @Value("\${app.razorpay.plan-2-monthly}") private val plan2Monthly: String,
    @Value("\${app.razorpay.plan-2-yearly}") private val plan2Yearly: String
) {
    private val log = LoggerFactory.getLogger(RazorpayService::class.java)

    private lateinit var client: RazorpayClient
    private lateinit var planMap: Map<String, String>

    fun getKeyId(): String = keyId

    @PostConstruct
    fun init() {
        client = RazorpayClient(keyId, keySecret)
        planMap = mapOf(
            "1_monthly" to plan1Monthly,
            "1_yearly" to plan1Yearly,
            "2_monthly" to plan2Monthly,
            "2_yearly" to plan2Yearly
        )
    }

    fun getPlanId(tier: Int, billingCycle: String): String {
        val key = "${tier}_$billingCycle"
        return planMap[key]
            ?: throw ApiException(HttpStatus.BAD_REQUEST, "INVALID_PLAN", "Invalid plan selection")
    }

    fun createSubscription(planId: String, tenantEmail: String): String {
        try {
            val request = JSONObject()
            request.put("plan_id", planId)
            request.put("total_count", 120)
            request.put("quantity", 1)
            val notes = JSONObject()
            notes.put("email", tenantEmail)
            request.put("notes", notes)

            val subscription = client.subscriptions.create(request)
            return subscription.get<String>("id")
        } catch (e: Exception) {
            log.error("Razorpay subscription creation failed", e)
            throw ApiException(
                HttpStatus.BAD_GATEWAY,
                "PAYMENT_ERROR",
                "Payment service unavailable. Please try again."
            )
        }
    }

    fun cancelSubscription(subscriptionId: String) {
        try {
            client.subscriptions.cancel(subscriptionId, JSONObject().put("cancel_at_cycle_end", 1))
        } catch (e: Exception) {
            log.error("Razorpay subscription cancellation failed", e)
            throw ApiException(
                HttpStatus.BAD_GATEWAY,
                "PAYMENT_ERROR",
                "Payment service unavailable. Please try again."
            )
        }
    }

    @Suppress("DefaultLocale")
    fun verifyPaymentSignature(razorpayPaymentId: String, razorpaySubscriptionId: String, signature: String): Boolean {
        return try {
            val payload = "$razorpayPaymentId|$razorpaySubscriptionId"
            val mac = Mac.getInstance("HmacSHA256")
            mac.init(SecretKeySpec(keySecret.toByteArray(), "HmacSHA256"))
            val computed = mac.doFinal(payload.toByteArray())
                .joinToString("") { String.format("%02x", it) }
            MessageDigest.isEqual(computed.toByteArray(), signature.toByteArray())
        } catch (e: Exception) {
            log.error("Payment signature verification error", e)
            false
        }
    }

    @Suppress("DefaultLocale")
    fun verifyWebhookSignature(payload: String, signature: String): Boolean {
        return try {
            val mac = Mac.getInstance("HmacSHA256")
            mac.init(SecretKeySpec(webhookSecret.toByteArray(), "HmacSHA256"))
            val computed = mac.doFinal(payload.toByteArray())
                .joinToString("") { String.format("%02x", it) }
            MessageDigest.isEqual(computed.toByteArray(), signature.toByteArray())
        } catch (e: Exception) {
            log.error("Webhook signature verification error", e)
            false
        }
    }
}
