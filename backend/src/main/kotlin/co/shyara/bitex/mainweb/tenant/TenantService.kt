package co.shyara.bitex.mainweb.tenant

import co.shyara.bitex.mainweb.common.ApiException
import co.shyara.bitex.mainweb.common.FileUploadUtil
import co.shyara.bitex.mainweb.model.BillingInfo
import co.shyara.bitex.mainweb.model.TenantSettings
import co.shyara.bitex.mainweb.repository.BillingInfoRepository
import co.shyara.bitex.mainweb.repository.TenantRepository
import co.shyara.bitex.mainweb.repository.TenantSettingsRepository
import co.shyara.bitex.mainweb.tenant.dto.*
import org.slf4j.LoggerFactory
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
    private val log = LoggerFactory.getLogger(TenantService::class.java)

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
        FileUploadUtil.validateImageFile(file)

        val tenant = tenantRepository.findById(tenantId)
            .orElseThrow { ApiException(HttpStatus.NOT_FOUND, "TENANT_NOT_FOUND", "Tenant not found") }

        val dir = Paths.get(uploadDir, "logos")
        Files.createDirectories(dir)

        val settings = tenantSettingsRepository.findByTenantId(tenantId)
            ?: TenantSettings(tenantId = tenantId, tenant = tenant)

        deleteOldFile(settings.logoUrl)

        val extension = FileUploadUtil.resolveExtension(file)
        val filename = "${UUID.randomUUID()}.$extension"
        val filePath = dir.resolve(filename)

        Files.copy(file.inputStream, filePath, StandardCopyOption.REPLACE_EXISTING)

        settings.logoUrl = "/uploads/logos/$filename"
        tenantSettingsRepository.save(settings)

        log.info("SECURITY: Logo uploaded for tenantId={}, fileSize={}", tenantId, file.size)

        return getSettings(tenantId)
    }

    private fun deleteOldFile(url: String?) {
        if (url.isNullOrBlank()) return
        try {
            val relativePath = url.removePrefix("/uploads/")
            val oldFile = Paths.get(uploadDir, relativePath)
            Files.deleteIfExists(oldFile)
        } catch (e: Exception) {
            log.warn("Failed to delete old file: {}", url, e)
        }
    }
}
