package co.shyara.bitex.mainweb.tenant

import co.shyara.bitex.mainweb.common.ApiException
import co.shyara.bitex.mainweb.model.BillingInfo
import co.shyara.bitex.mainweb.model.TenantSettings
import co.shyara.bitex.mainweb.repository.BillingInfoRepository
import co.shyara.bitex.mainweb.repository.TenantRepository
import co.shyara.bitex.mainweb.repository.TenantSettingsRepository
import co.shyara.bitex.mainweb.tenant.dto.*
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.time.Instant
import java.util.UUID

@Service
class TenantService(
    private val tenantRepository: TenantRepository,
    private val tenantSettingsRepository: TenantSettingsRepository,
    private val billingInfoRepository: BillingInfoRepository,
    @Value("\${app.upload.dir:uploads}") private val uploadDir: String
) {

    companion object {
        private val ALLOWED_IMAGE_TYPES = setOf("image/jpeg", "image/png", "image/gif", "image/webp")
        private val ALLOWED_EXTENSIONS = setOf("jpg", "jpeg", "png", "gif", "webp")
    }

    @Transactional(readOnly = true)
    fun getSettings(tenantId: UUID): TenantSettingsResponse {
        val tenant = tenantRepository.findById(tenantId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "Tenant not found") }
        val settings = tenantSettingsRepository.findByTenantId(tenantId)

        return TenantSettingsResponse(
            tenantId = tenant.id.toString(),
            name = tenant.name,
            slug = tenant.slug,
            logoUrl = settings?.logoUrl,
            businessType = settings?.businessType,
            phone = settings?.phone,
            businessEmail = settings?.businessEmail,
            website = settings?.website,
            gstin = settings?.gstin,
            address = settings?.address,
            description = settings?.description,
            paymentGateway = settings?.paymentGateway,
            tier = tenant.tier,
            billingCycle = tenant.billingCycle,
            status = tenant.status
        )
    }

    @Transactional
    fun updateSettings(tenantId: UUID, request: UpdateTenantSettingsRequest): TenantSettingsResponse {
        val tenant = tenantRepository.findById(tenantId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "Tenant not found") }

        request.name?.let {
            tenant.name = it
            tenant.updatedAt = Instant.now()
            tenantRepository.save(tenant)
        }

        val settings = tenantSettingsRepository.findByTenantId(tenantId)
            ?: TenantSettings(tenantId = tenantId, tenant = tenant)

        request.businessType?.let { settings.businessType = it }
        request.phone?.let { settings.phone = it }
        request.businessEmail?.let { settings.businessEmail = it }
        request.website?.let { settings.website = it }
        request.gstin?.let { settings.gstin = it }
        request.address?.let { settings.address = it }
        request.description?.let { settings.description = it }
        request.paymentGateway?.let { settings.paymentGateway = it }

        tenantSettingsRepository.save(settings)

        return getSettings(tenantId)
    }

    @Transactional(readOnly = true)
    fun getBillingInfo(tenantId: UUID): BillingInfoResponse {
        val billing = billingInfoRepository.findByTenantId(tenantId)

        return BillingInfoResponse(
            businessName = billing?.businessName,
            gstin = billing?.gstin,
            address = billing?.address,
            city = billing?.city,
            state = billing?.state,
            pincode = billing?.pincode
        )
    }

    @Transactional
    fun updateBillingInfo(tenantId: UUID, request: UpdateBillingInfoRequest): BillingInfoResponse {
        val tenant = tenantRepository.findById(tenantId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "Tenant not found") }

        val billing = billingInfoRepository.findByTenantId(tenantId)
            ?: BillingInfo(tenantId = tenantId, tenant = tenant)

        request.businessName?.let { billing.businessName = it }
        request.gstin?.let { billing.gstin = it }
        request.address?.let { billing.address = it }
        request.city?.let { billing.city = it }
        request.state?.let { billing.state = it }
        request.pincode?.let { billing.pincode = it }

        billingInfoRepository.save(billing)

        return getBillingInfo(tenantId)
    }

    @Transactional
    fun uploadLogo(tenantId: UUID, file: MultipartFile): TenantSettingsResponse {
        validateImageFile(file)

        val tenant = tenantRepository.findById(tenantId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "Tenant not found") }

        val dir = Paths.get(uploadDir, "logos")
        Files.createDirectories(dir)

        val extension = resolveExtension(file)
        val filename = "${tenantId}_${System.currentTimeMillis()}.$extension"
        val filePath = dir.resolve(filename)

        Files.copy(file.inputStream, filePath, StandardCopyOption.REPLACE_EXISTING)

        val settings = tenantSettingsRepository.findByTenantId(tenantId)
            ?: TenantSettings(tenantId = tenantId, tenant = tenant)

        settings.logoUrl = "/uploads/logos/$filename"
        tenantSettingsRepository.save(settings)

        return getSettings(tenantId)
    }

    private fun validateImageFile(file: MultipartFile) {
        if (file.isEmpty) {
            throw ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "File is empty")
        }
        val contentType = file.contentType
        if (contentType == null || contentType !in ALLOWED_IMAGE_TYPES) {
            throw ApiException(HttpStatus.BAD_REQUEST, "INVALID_FILE_TYPE", "Only JPEG, PNG, GIF, and WebP images are allowed")
        }
    }

    private fun resolveExtension(file: MultipartFile): String {
        val fromName = file.originalFilename
            ?.substringAfterLast('.', "")
            ?.lowercase()
            ?.takeIf { it.isNotEmpty() && it in ALLOWED_EXTENSIONS }
        return fromName ?: "png"
    }
}
