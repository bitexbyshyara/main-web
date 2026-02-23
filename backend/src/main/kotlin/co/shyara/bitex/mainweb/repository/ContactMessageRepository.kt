package co.shyara.bitex.mainweb.repository

import co.shyara.bitex.mainweb.model.ContactMessage
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ContactMessageRepository : JpaRepository<ContactMessage, UUID>
