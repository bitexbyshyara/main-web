# BiteX Main Web -- Security Guide for Developers

This document covers every security pattern, rule, and guideline that must be followed when working on the BiteX Main Web platform. Any developer adding features, fixing bugs, or modifying existing code **must** read this document first.

---

## Table of Contents

1. [Authentication Architecture](#1-authentication-architecture)
2. [Authorization (RBAC)](#2-authorization-rbac)
3. [Rate Limiting](#3-rate-limiting)
4. [Account Lockout](#4-account-lockout)
5. [Input Validation Rules](#5-input-validation-rules)
6. [Password Policy](#6-password-policy)
7. [File Upload Security](#7-file-upload-security)
8. [Security Headers](#8-security-headers)
9. [Error Handling and Information Disclosure](#9-error-handling-and-information-disclosure)
10. [CORS Policy](#10-cors-policy)
11. [Audit Logging](#11-audit-logging)
12. [Frontend Security](#12-frontend-security)
13. [Environment Variables and Secrets](#13-environment-variables-and-secrets)
14. [Common Mistakes to Avoid](#14-common-mistakes-to-avoid)
15. [Security Checklist for Pull Requests](#15-security-checklist-for-pull-requests)

---

## 1. Authentication Architecture

### Token Model

BiteX uses a **dual-token JWT system**:

- **Access Token** (15-minute lifetime): Short-lived, stateless, sent via `Authorization: Bearer <token>` header. Contains `userId`, `tenantId`, `role`, `tenantSlug` claims plus `jti`, `iss`, `aud`.
- **Refresh Token** (7-day lifetime): Long-lived, stored as a SHA-256 hash in the `refresh_tokens` database table. Used exclusively to obtain new access tokens via `POST /api/auth/refresh`.

### Why Two Tokens?

If an access token is stolen, the attacker has a maximum 15-minute window. Refresh tokens can be revoked server-side instantly (e.g., on password change, logout, or suspicious activity).

### Token Claims

Every access token MUST contain:

| Claim | Purpose |
|-------|---------|
| `sub` | User ID (UUID) |
| `tenantId` | Tenant ID for multi-tenant isolation |
| `role` | User role (`MANAGER`, `STAFF`) |
| `tenantSlug` | Tenant slug for URL generation |
| `jti` | Unique token identifier for revocation |
| `iss` | Issuer: `"bitex-main-web"` |
| `aud` | Audience: `"bitex"` |
| `iat` | Issued at timestamp |
| `exp` | Expiration timestamp |

### Token Lifecycle

1. **Login/Register** -> Returns `{ accessToken, refreshToken }` pair
2. **API Calls** -> Frontend sends access token in `Authorization` header
3. **Token Expires** -> Frontend calls `POST /api/auth/refresh` with refresh token
4. **Refresh Succeeds** -> New access token issued
5. **Refresh Fails** -> User redirected to login
6. **Logout** -> Refresh token revoked in database, both tokens cleared client-side
7. **Password Change/Reset** -> ALL refresh tokens for that user are revoked

### Rules for Developers

- NEVER store tokens in cookies without `httpOnly`, `Secure`, `SameSite=Strict` flags
- NEVER log tokens, even partially
- NEVER include tokens in URLs or query parameters
- NEVER extend access token lifetime beyond 15 minutes
- When adding new authenticated endpoints, they are protected by default (JwtAuthFilter)
- Only endpoints explicitly listed in `SecurityConfig.permitAll()` bypass auth

---

## 2. Authorization (RBAC)

### Roles

| Role | Description | Can Access |
|------|-------------|------------|
| `MANAGER` | Restaurant owner/admin | Everything |
| `STAFF` | Restaurant employee | Profile, dashboard, support tickets only |

### How to Protect Endpoints

Use Spring Security's `@PreAuthorize` annotation on controller methods:

```kotlin
// Manager-only endpoint
@PreAuthorize("hasRole('MANAGER')")
@PutMapping("/settings")
fun updateSettings(...) { ... }

// Any authenticated user
@GetMapping("/profile")
fun getProfile(...) { ... }
```

### Authorization Matrix

| Endpoint | MANAGER | STAFF |
|----------|---------|-------|
| `GET/PUT /api/user/profile` | Yes | Yes |
| `PUT /api/user/password` | Yes | Yes |
| `GET/PUT /api/user/notifications` | Yes | Yes |
| `GET /api/dashboard` | Yes | Yes |
| `GET/POST /api/support/tickets` | Yes | Yes |
| `GET/PUT /api/tenant/settings` | Yes | **No** |
| `GET/PUT /api/tenant/billing-info` | Yes | **No** |
| `POST /api/tenant/logo` | Yes | **No** |
| `ALL /api/billing/*` | Yes | **No** |

### Rules for Developers

- ALWAYS add `@PreAuthorize` to new controller methods
- NEVER trust the `role` from the JWT alone for business logic -- the filter sets Spring Security authorities
- When in doubt, restrict to `MANAGER` and loosen later
- Test both roles in integration tests

---

## 3. Rate Limiting

### Current Limits

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| `POST /api/auth/login` | 5 | per minute | IP |
| `POST /api/auth/register` | 3 | per minute | IP |
| `POST /api/auth/forgot-password` | 3 | per 15 min | IP |
| `POST /api/auth/reset-password` | 5 | per 15 min | IP |
| `POST /api/contact` | 5 | per 15 min | IP |
| `POST /api/support/tickets` | 10 | per hour | User |
| `POST /api/user/avatar` | 5 | per hour | User |
| `POST /api/tenant/logo` | 5 | per hour | User |
| All other authenticated | 100 | per minute | User |

### Rules for Developers

- When adding a new public endpoint, ALWAYS add a rate limit rule
- When adding file upload endpoints, add a per-user hourly limit
- Rate limit responses return `429 Too Many Requests` with `Retry-After` header
- Never rely on rate limiting alone for security -- it's defense-in-depth

---

## 4. Account Lockout

- After **5 consecutive failed login attempts**: account locked for **15 minutes**
- After **10 consecutive failures**: account locked for **1 hour**
- Successful login resets the counter
- Lockout message is generic ("Invalid credentials") to prevent user enumeration
- Lockout state is stored in the `users` table (`login_attempts`, `locked_until` columns)

### Rules for Developers

- NEVER reveal whether an account is locked in error messages
- If adding alternative login methods (OAuth, SSO), they must also respect lockout state

---

## 5. Input Validation Rules

### Backend Validation

Every `@RequestBody` parameter MUST have `@Valid` annotation:

```kotlin
@PostMapping("/register")
fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<AuthResponse>
```

Every DTO string field MUST have `@Size(max=...)`:

```kotlin
data class UpdateProfileRequest(
    @field:Size(max = 100) val firstName: String? = null,
    @field:Size(max = 100) val lastName: String? = null,
    @field:Size(max = 20) val phone: String? = null
)
```

### Size Limits by Field Type

| Field Type | Max Length |
|------------|-----------|
| Names (first, last, restaurant) | 100 |
| Email | 255 |
| Phone | 20 |
| Password | 72 (BCrypt limit) |
| Short text (subject, label) | 255 |
| Medium text (description, address) | 5000 |
| URL fields | 500 |
| GSTIN | 20 |
| Pincode | 10 |

### Rules for Developers

- ALWAYS add `@Valid` to controller method parameters
- ALWAYS add `@Size(max=...)` to string fields in DTOs
- ALWAYS add `@NotBlank` to required string fields
- For numeric fields, use `@Min` and `@Max`
- For enum-like fields, validate against allowed values in the service layer
- Frontend validation is for UX only -- NEVER trust it for security

---

## 6. Password Policy

### Requirements

- Minimum 8 characters
- Maximum 72 characters (BCrypt truncation boundary)
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- Must not be in the top-1000 common passwords list
- Must not equal the user's email

### BCrypt Note

BCrypt silently truncates passwords longer than 72 bytes. Our validation rejects passwords > 72 chars to prevent users from having a false sense of security.

### Rules for Developers

- ALWAYS use `PasswordEncoder.encode()` for hashing -- never roll your own
- NEVER log passwords, even hashed ones
- NEVER compare passwords with `==` -- always use `PasswordEncoder.matches()`
- When adding password fields to new DTOs, apply `@StrongPassword` annotation

---

## 7. File Upload Security

### Validation Steps (in order)

1. **Empty check**: Reject empty files
2. **Size check**: Max 2MB per file
3. **Content-Type check**: Must be in `image/jpeg`, `image/png`, `image/gif`, `image/webp`
4. **Magic bytes check**: First bytes must match file signature:
   - JPEG: `FF D8 FF`
   - PNG: `89 50 4E 47`
   - GIF: `47 49 46 38`
   - WebP: `52 49 46 46` (bytes 0-3) + `57 45 42 50` (bytes 8-11)
5. **Extension check**: Must be in `jpg`, `jpeg`, `png`, `gif`, `webp`

### Storage Rules

- Filenames use `UUID.randomUUID()` -- NEVER use client-supplied filenames
- Old files are deleted when a new one is uploaded
- Upload directory is outside the application root
- Files are served only to authenticated users
- Response headers include `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff`

### Rules for Developers

- NEVER use the client-supplied filename for storage
- NEVER serve uploaded files inline -- always use `Content-Disposition: attachment`
- NEVER trust `Content-Type` headers alone -- always verify magic bytes
- If adding new upload endpoints, use the shared `validateImageFile()` + `verifyMagicBytes()` methods
- Consider per-user storage quotas for new upload features

---

## 8. Security Headers

### Backend Headers (applied to all API responses)

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restrict browser APIs |
| `Cache-Control` | `no-store` | Prevent caching of authenticated responses |

### Frontend Headers (via meta tags in index.html)

| Header | Purpose |
|--------|---------|
| Content-Security-Policy | Restricts script/style/image sources |
| X-Frame-Options | Prevents embedding in iframes |
| Referrer-Policy | Controls referrer information |

### Rules for Developers

- NEVER remove or weaken security headers
- If a new feature requires relaxing CSP (e.g., embedding a third-party widget), discuss with the team first and use the narrowest possible exception
- When adding external resources (fonts, scripts, images), update the CSP accordingly

---

## 9. Error Handling and Information Disclosure

### Rules

1. **NEVER include exception messages in API responses** -- use generic messages:
   ```kotlin
   // BAD
   throw ApiException(BAD_GATEWAY, "ERROR", "Failed: ${e.message}")
   
   // GOOD
   log.error("Razorpay subscription creation failed", e)
   throw ApiException(BAD_GATEWAY, "PAYMENT_ERROR", "Payment service unavailable. Please try again.")
   ```

2. **NEVER expose internal IDs** from third-party services (Razorpay, Stripe, etc.) in API responses

3. **NEVER include stack traces in responses** -- the `GlobalExceptionHandler` catches all unhandled exceptions and returns a generic 500 response

4. **Log the full exception server-side** with structured logging for debugging

5. **Validation errors** may include field names and constraint messages (these are public API contracts), but NEVER include the rejected value itself

6. **Database constraint names** must not leak -- the `DataIntegrityViolationException` handler maps known constraints to user-friendly messages

---

## 10. CORS Policy

### Configuration

- **Allowed Origins**: Only explicitly configured domains (via `CORS_ORIGINS` env var)
- **Allowed Methods**: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- **Allowed Headers**: `Authorization, Content-Type, X-Requested-With`
- **Credentials**: Disabled (Bearer token auth doesn't need cookies)
- **Max Age**: 3600 seconds (1 hour preflight cache)

### Rules for Developers

- NEVER use `allowedOrigins("*")` -- always list specific origins
- NEVER enable `allowCredentials` unless switching to cookie-based auth
- When deploying to a new domain, add it to the `CORS_ORIGINS` environment variable

---

## 11. Audit Logging

### Events That Are Logged

| Event | Data Logged | Sensitivity |
|-------|-------------|-------------|
| Login success | userId, IP, user-agent | LOW |
| Login failure | email (masked), IP, reason | MEDIUM |
| Registration | userId, tenantId | LOW |
| Password change | userId | LOW |
| Password reset request | email (masked) | MEDIUM |
| Password reset complete | userId | LOW |
| Account lockout | userId, IP, attempt count | MEDIUM |
| Token refresh | userId | LOW |
| Token revocation | userId, reason | LOW |
| Subscription change | tenantId, old tier, new tier | LOW |
| File upload | userId, file type, file size | LOW |
| Authorization failure | userId, endpoint, required role | MEDIUM |

### Rules for Developers

- ALWAYS log security-relevant events using the `AuditService`
- NEVER log passwords, tokens, API keys, or full request/response bodies
- NEVER log personally identifiable information (PII) beyond what's listed above
- Use the `SECURITY` SLF4J marker for security events so they can be filtered
- Mask emails in logs: `j***@example.com`

---

## 12. Frontend Security

### Token Storage

- Tokens are stored in `localStorage` (with XSS mitigation via CSP)
- The `AuthContext` validates token format and expiration before trusting it
- `JSON.parse` of stored user data is wrapped in try/catch to prevent crashes from tampered data
- Cross-tab logout is synchronized via `StorageEvent` listener

### Protected Routes

- All `/profile/*` routes are wrapped in `<ProtectedRoute>` which checks authentication
- `isAuthenticated` validates both token presence AND format (JWT structure + non-expired)
- A loading state is shown while the auth context hydrates from storage

### XSS Prevention

- React's JSX escapes all rendered values by default
- `dangerouslySetInnerHTML` is NEVER used with user-supplied content
- Content Security Policy restricts script execution to same-origin
- No inline event handlers (`onclick`, etc.) -- all via React event system

### Rules for Developers

- NEVER use `dangerouslySetInnerHTML` with user-supplied data
- NEVER construct HTML strings from user input
- NEVER store sensitive data in `sessionStorage`, `localStorage`, or cookies without encryption
- ALWAYS validate and sanitize URLs before using them in `href` attributes (reject `javascript:` protocol)
- When rendering user-generated content (names, descriptions), React's default escaping is sufficient
- When adding new authenticated pages, wrap them in `<ProtectedRoute>`

---

## 13. Environment Variables and Secrets

### Required Environment Variables (Backend)

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | **YES** (app fails without it) | HMAC-SHA256 signing key, minimum 32 chars |
| `DATABASE_URL` | YES | PostgreSQL JDBC URL |
| `DATABASE_USERNAME` | YES | Database username |
| `DATABASE_PASSWORD` | YES | Database password |
| `RAZORPAY_KEY_ID` | YES | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | YES | Razorpay API secret |
| `RAZORPAY_WEBHOOK_SECRET` | YES | Razorpay webhook signature secret |
| `CORS_ORIGINS` | YES | Comma-separated allowed origins |
| `PORT` | No (default: 8080) | Server port |
| `UPLOAD_DIR` | No (default: ./uploads) | File upload directory |

### Rules for Developers

- NEVER commit secrets to the repository
- NEVER add default values for secrets in `application.yml`
- NEVER log environment variables at startup
- Use `.env.example` to document required variables (without real values)
- Rotate secrets immediately if they are accidentally committed

---

## 14. Common Mistakes to Avoid

1. **Trusting client-side validation**: Frontend validation is for UX. All security checks MUST be server-side.

2. **Using string concatenation for SQL**: Always use parameterized queries (Spring Data JPA does this automatically).

3. **Returning internal IDs in responses**: Database UUIDs are fine. Third-party IDs (Razorpay, Stripe) must stay server-side.

4. **Logging sensitive data**: Never log tokens, passwords, API keys, or full request bodies.

5. **Catching exceptions too broadly**: Don't catch `Exception` and ignore it. Log it, then throw an appropriate `ApiException`.

6. **Skipping rate limits on new endpoints**: Every public endpoint needs a rate limit.

7. **Forgetting `@Valid`**: Every `@RequestBody` needs `@Valid`. Without it, Jakarta validation annotations are silently ignored.

8. **Hardcoding URLs or secrets**: Use environment variables for everything environment-specific.

9. **Serving uploaded files inline**: Always use `Content-Disposition: attachment`.

10. **Using `==` to compare secrets/tokens**: Use constant-time comparison (`MessageDigest.isEqual`).

---

## 15. Security Checklist for Pull Requests

Before submitting a PR, verify:

- [ ] All new `@RequestBody` parameters have `@Valid`
- [ ] All new DTO string fields have `@Size(max=...)` and `@NotBlank` where required
- [ ] All new controller methods have `@PreAuthorize` with appropriate role
- [ ] No secrets, tokens, or credentials in the code
- [ ] No internal exception messages exposed in API responses
- [ ] No `dangerouslySetInnerHTML` with user data
- [ ] New authenticated pages wrapped in `<ProtectedRoute>`
- [ ] New public endpoints have rate limiting configured
- [ ] New file upload endpoints validate magic bytes, not just Content-Type
- [ ] Audit logging added for security-relevant events
- [ ] No new dependencies with known CVEs (check with `npm audit` / `gradle dependencyCheck`)
- [ ] Tests cover both authorized and unauthorized access paths

---

## Appendix A: Frontend-Backend Alignment Audit Findings (Feb 2026)

The following issues were found during a comprehensive audit comparing the frontend UI/flows against the backend API capabilities. All items have been resolved.

### A1. Forgot/Reset Password Flow Was Missing

The backend had `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` endpoints, but the frontend "Forgot password?" link only showed a toast. **Fix:** Created dedicated `/forgot-password` and `/reset-password` pages with proper forms and API integration. The forgot password page always shows a success message regardless of whether the email exists (to prevent email enumeration).

### A2. BillingPage Buttons Were Dead

All action buttons on the billing page (Change Plan, Cancel Subscription, Add/Remove Payment Method, Export Invoices) had no `onClick` handlers. **Fix:** Wired all buttons to their respective backend API endpoints using React Query mutations with proper loading states, confirmation dialogs for destructive actions (cancel, delete), and a plan-change dialog.

### A3. Stale Razorpay Fields in Frontend Interface

The frontend `Subscription` interface still contained `razorpaySubscriptionId` and `razorpayPlanId` fields that were removed from the backend DTO during security hardening. **Fix:** Removed these fields from the frontend interface.

### A4. Delete Account Button Was Fake

The "Delete Account" button showed a confirmation dialog but only displayed a toast "Deletion request submitted" without calling any API. The backend has no delete-account endpoint. **Fix:** Replaced with a "Contact Support to Delete Account" mailto link, since account deletion is a manual support process.

### A5. 2FA Toggle Appeared Broken

The Two-Factor Authentication section showed a disabled Switch that looked like a broken feature. The backend has no 2FA implementation. **Fix:** Replaced with a "Coming Soon" badge and dimmed UI to clearly communicate the feature is planned.

### A6. Password Validation Mismatch

The frontend allowed passwords up to 128 characters with no complexity requirements, while the backend enforces max 72 (BCrypt limit) and requires uppercase + lowercase + digit. **Fix:** Updated Zod schemas in Register.tsx (max 72, regex patterns for complexity) and added validation in AccountSettingsPage.tsx change-password handler.

### A7. Login Redirect Not Preserved

`ProtectedRoute` passed `state.from` to the login page, but `Login.tsx` never read it -- always navigating to `/profile`. **Fix:** Login now reads `location.state.from` and redirects there after successful authentication.

### A8. No Logout in Navbar

Users had to navigate to the profile sidebar to log out. **Fix:** Added a dropdown menu to the Navbar's Profile button with "My Profile", "Settings", and "Sign Out" options. Mobile menu also includes Sign Out.

### A9. Billing Cycle Not Sent During Registration

Users selected monthly/annual billing during registration, but the choice was never sent to the backend. **Fix:** Added `billingCycle` field to the backend `RegisterRequest` DTO and updated the frontend to send the selected billing cycle.

### A10. Inconsistent Contact Information

`support@bitex.in` was used in some places while `support@shyara.co.in` was used in others. **Fix:** Standardized all contact emails to `support@shyara.co.in` across `ContactSupportPage.tsx` and `ProfileDashboard.tsx`.

### A11. Placeholder YouTube Videos

`HowToUsePage.tsx` embedded Rick Roll and other placeholder YouTube videos. **Fix:** Replaced video embeds with "Coming Soon" placeholder cards showing a clock icon, removing the fake video thumbnails and modals.

### A12. No Post-Registration Welcome Flow

After registration, users landed on `/profile?welcome=true` but no welcome experience was shown. **Fix:** Added a welcome dialog on `ProfileDashboard` triggered by `?welcome=true` query param, showing quick-start steps (Complete profile, Set up billing, Open POS Dashboard).

### A13. Authenticated Users Could Access Login/Register

Logged-in users could navigate to `/login` or `/register` and see those forms. **Fix:** Both pages now redirect authenticated users to `/profile`.

### Developer Notes

When building new features, keep these patterns in mind:

1. **Every button must do something.** If a feature isn't implemented, show "Coming Soon" rather than a dead button.
2. **Frontend validation must match backend validation.** If you change a `@Size` constraint on the backend, update the corresponding Zod schema on the frontend.
3. **Use `support@shyara.co.in`** as the canonical support email everywhere.
4. **Don't use placeholder content that looks real** (fake videos, dummy phone numbers that look legitimate). Use clear "Coming Soon" indicators instead.
5. **Always wire confirmation dialogs for destructive actions** (delete, cancel subscription, etc.).
6. **Login/Register pages should redirect authenticated users** to prevent re-registration or confusion.

---

*Last updated: February 2026*
*Maintainer: BiteX Engineering Team*
