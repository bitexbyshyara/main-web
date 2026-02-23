package co.shyara.bitex.mainweb.model

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "invoices")
class Invoice(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Column(name = "tenant_id", nullable = false)
    var tenantId: UUID? = null,

    @Column(name = "razorpay_invoice_id", length = 100)
    var razorpayInvoiceId: String? = null,

    @Column(name = "razorpay_payment_id", length = 100)
    var razorpayPaymentId: String? = null,

    @Column(name = "amount", nullable = false)
    var amount: Int = 0,

    @Column(name = "currency", nullable = false, length = 10)
    var currency: String = "INR",

    @Column(name = "status", nullable = false, length = 20)
    var status: String = "PENDING",

    @Column(name = "invoice_number", length = 50)
    var invoiceNumber: String? = null,

    @Column(name = "pdf_url", length = 500)
    var pdfUrl: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now()
)
