package co.shyara.bitex.mainweb.repository

import co.shyara.bitex.mainweb.model.NotificationPreferences
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface NotificationPreferencesRepository : JpaRepository<NotificationPreferences, UUID> {
    fun findByUserId(userId: UUID): NotificationPreferences?
}
