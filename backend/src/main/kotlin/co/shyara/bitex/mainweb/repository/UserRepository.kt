package co.shyara.bitex.mainweb.repository

import co.shyara.bitex.mainweb.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface UserRepository : JpaRepository<User, UUID> {
    fun findByEmail(email: String): User?
    fun findByPhone(phone: String): User?
    fun findByEmailOrPhone(email: String, phone: String): User?
    fun findAllByTenantId(tenantId: UUID): List<User>
    fun existsByEmail(email: String): Boolean
}
