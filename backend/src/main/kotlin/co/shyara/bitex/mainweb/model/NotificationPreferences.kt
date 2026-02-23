package co.shyara.bitex.mainweb.model

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "notification_preferences")
class NotificationPreferences(
    @Id
    @Column(name = "user_id")
    var userId: UUID? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    var user: User? = null,

    @Column(name = "order_alerts", nullable = false)
    var orderAlerts: Boolean = true,

    @Column(name = "staff_updates", nullable = false)
    var staffUpdates: Boolean = true,

    @Column(name = "billing_reminders", nullable = false)
    var billingReminders: Boolean = true,

    @Column(name = "promotions", nullable = false)
    var promotions: Boolean = false,

    @Column(name = "weekly_reports", nullable = false)
    var weeklyReports: Boolean = true,

    @Column(name = "security_alerts", nullable = false)
    var securityAlerts: Boolean = true
)
