package co.shyara.bitex.mainweb.model

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "contact_messages")
class ContactMessage(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,

    @Column(name = "name", nullable = false, length = 100)
    var name: String = "",

    @Column(name = "email", nullable = false, length = 255)
    var email: String = "",

    @Column(name = "phone", length = 20)
    var phone: String? = null,

    @Column(name = "restaurant", length = 100)
    var restaurant: String? = null,

    @Column(name = "subject", nullable = false, length = 100)
    var subject: String = "",

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    var message: String = "",

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant = Instant.now()
)
