package co.shyara.bitex.mainweb.tenant

import co.shyara.bitex.mainweb.tenant.dto.*
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
@RequestMapping("/api/tenant")
class TenantController(private val tenantService: TenantService) {

    @GetMapping("/settings")
    fun getSettings(): ResponseEntity<TenantSettingsResponse> =
        ResponseEntity.ok(tenantService.getSettings(currentTenantId()))

    @PutMapping("/settings")
    fun updateSettings(@RequestBody request: UpdateTenantSettingsRequest): ResponseEntity<TenantSettingsResponse> =
        ResponseEntity.ok(tenantService.updateSettings(currentTenantId(), request))

    @GetMapping("/billing-info")
    fun getBillingInfo(): ResponseEntity<BillingInfoResponse> =
        ResponseEntity.ok(tenantService.getBillingInfo(currentTenantId()))

    @PutMapping("/billing-info")
    fun updateBillingInfo(@RequestBody request: UpdateBillingInfoRequest): ResponseEntity<BillingInfoResponse> =
        ResponseEntity.ok(tenantService.updateBillingInfo(currentTenantId(), request))

    @PostMapping("/logo")
    fun uploadLogo(@RequestParam("file") file: MultipartFile): ResponseEntity<TenantSettingsResponse> =
        ResponseEntity.ok(tenantService.uploadLogo(currentTenantId(), file))

    private fun currentTenantId(): UUID {
        val auth = SecurityContextHolder.getContext().authentication
        val claims = auth.principal as Map<*, *>
        return claims["tenantId"] as UUID
    }
}
