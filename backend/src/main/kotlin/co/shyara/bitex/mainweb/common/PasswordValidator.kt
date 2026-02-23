package co.shyara.bitex.mainweb.common

import org.springframework.http.HttpStatus

object PasswordValidator {

    private val COMMON_PASSWORDS = setOf(
        "password", "12345678", "123456789", "1234567890", "qwerty123",
        "abc12345", "password1", "iloveyou", "sunshine1", "princess1",
        "football1", "charlie1", "access14", "master12", "michael1",
        "shadow12", "hello123", "charlie", "donald12", "trustno1",
        "letmein1", "welcome1", "monkey12", "dragon12", "baseball1",
        "passw0rd", "p@ssw0rd", "p@ssword", "admin123", "root1234",
        "test1234", "guest123", "master1", "qwerty12", "changeme",
        "abcdef12", "abcd1234", "11111111", "22222222", "12341234",
        "asdfghjk", "zxcvbnm1"
    )

    fun validate(password: String, email: String? = null) {
        val errors = mutableListOf<String>()

        if (password.length < 8) errors.add("Password must be at least 8 characters")
        if (password.length > 72) errors.add("Password must be at most 72 characters")
        if (!password.any { it.isUpperCase() }) errors.add("Password must contain at least one uppercase letter")
        if (!password.any { it.isLowerCase() }) errors.add("Password must contain at least one lowercase letter")
        if (!password.any { it.isDigit() }) errors.add("Password must contain at least one digit")
        if (password.lowercase() in COMMON_PASSWORDS) errors.add("This password is too common")
        if (email != null && password.equals(email, ignoreCase = true)) errors.add("Password must not be the same as your email")

        if (errors.isNotEmpty()) {
            throw ApiException(HttpStatus.BAD_REQUEST, "WEAK_PASSWORD", errors.joinToString(". "))
        }
    }
}
