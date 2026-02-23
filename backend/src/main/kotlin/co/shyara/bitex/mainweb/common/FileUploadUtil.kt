package co.shyara.bitex.mainweb.common

import org.springframework.http.HttpStatus
import org.springframework.web.multipart.MultipartFile

object FileUploadUtil {

    private val ALLOWED_IMAGE_TYPES = setOf("image/jpeg", "image/png", "image/gif", "image/webp")
    private val ALLOWED_EXTENSIONS = setOf("jpg", "jpeg", "png", "gif", "webp")

    private const val MAX_FILE_SIZE = 2L * 1024 * 1024 // 2MB

    fun validateImageFile(file: MultipartFile) {
        if (file.isEmpty) {
            throw ApiException(HttpStatus.BAD_REQUEST, "EMPTY_FILE", "File is empty")
        }
        if (file.size > MAX_FILE_SIZE) {
            throw ApiException(HttpStatus.BAD_REQUEST, "FILE_TOO_LARGE", "File must be smaller than 2MB")
        }
        val contentType = file.contentType
        if (contentType == null || contentType !in ALLOWED_IMAGE_TYPES) {
            throw ApiException(HttpStatus.BAD_REQUEST, "INVALID_FILE_TYPE", "Only JPEG, PNG, GIF, and WebP images are allowed")
        }
        verifyMagicBytes(file)
    }

    fun resolveExtension(file: MultipartFile): String {
        val fromName = file.originalFilename
            ?.substringAfterLast('.', "")
            ?.lowercase()
            ?.takeIf { it.isNotEmpty() && it in ALLOWED_EXTENSIONS }
        return fromName ?: "png"
    }

    private fun verifyMagicBytes(file: MultipartFile) {
        val bytes = file.inputStream.use { stream ->
            val buf = ByteArray(12)
            val read = stream.read(buf)
            if (read < 3) throw ApiException(HttpStatus.BAD_REQUEST, "INVALID_FILE", "File too small to verify")
            buf.copyOf(read)
        }

        val isValid = when {
            // JPEG: FF D8 FF
            bytes.size >= 3 && bytes[0] == 0xFF.toByte() && bytes[1] == 0xD8.toByte() && bytes[2] == 0xFF.toByte() -> true
            // PNG: 89 50 4E 47
            bytes.size >= 4 && bytes[0] == 0x89.toByte() && bytes[1] == 0x50.toByte() && bytes[2] == 0x4E.toByte() && bytes[3] == 0x47.toByte() -> true
            // GIF: 47 49 46 38
            bytes.size >= 4 && bytes[0] == 0x47.toByte() && bytes[1] == 0x49.toByte() && bytes[2] == 0x46.toByte() && bytes[3] == 0x38.toByte() -> true
            // WebP: RIFF....WEBP
            bytes.size >= 12 && bytes[0] == 0x52.toByte() && bytes[1] == 0x49.toByte() && bytes[2] == 0x46.toByte() && bytes[3] == 0x46.toByte()
                && bytes[8] == 0x57.toByte() && bytes[9] == 0x45.toByte() && bytes[10] == 0x42.toByte() && bytes[11] == 0x50.toByte() -> true
            else -> false
        }

        if (!isValid) {
            throw ApiException(HttpStatus.BAD_REQUEST, "INVALID_FILE", "File content does not match a valid image format")
        }
    }
}
