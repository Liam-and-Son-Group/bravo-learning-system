// Centralized runtime environment configuration
// This file reads from import.meta.env and exports typed config objects.
// Keep parallel with declarations in src/env.d.ts.

// Helper to safely split comma lists (ignores empty segments)
function splitList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Numeric coercion helper (defensive in case env is string)
function toNumber(v: unknown, fallback?: number): number {
  const n = typeof v === "number" ? v : Number(v);
  if (Number.isNaN(n)) return fallback ?? 0;
  return n;
}

// Boolean coercion helper (accepts 'true'/'false')
function toBool(v: unknown, fallback = false): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return fallback;
}

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME,
  version: import.meta.env.VITE_APP_VERSION,
  description: import.meta.env.VITE_APP_DESCRIPTION,
  environment: import.meta.env.VITE_APP_ENV,
} as const;

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL,
  version: import.meta.env.VITE_API_VERSION,
  timeout: toNumber(import.meta.env.VITE_API_TIMEOUT, 10000),
} as const;

export const AUTH_CONFIG = {
  cookieName: import.meta.env.VITE_AUTH_COOKIE_NAME,
  tokenExpires: toNumber(import.meta.env.VITE_AUTH_TOKEN_EXPIRES),
  refreshTokenExpires: toNumber(
    import.meta.env.VITE_AUTH_REFRESH_TOKEN_EXPIRES
  ),
  persistKey: import.meta.env.VITE_AUTH_PERSIST_KEY,
} as const;

export const ORGANIZATION_CONFIG = {
  logoMaxSize: toNumber(
    import.meta.env.VITE_ORG_LOGO_MAX_SIZE,
    2 * 1024 * 1024
  ), // default 2MB
  logoAllowedTypes: splitList(import.meta.env.VITE_ORG_LOGO_ALLOWED_TYPES),
  memberInviteLimit: toNumber(import.meta.env.VITE_ORG_MEMBER_INVITE_LIMIT, 50),
  memberRoles: splitList(import.meta.env.VITE_ORG_MEMBER_ROLES),
} as const;

export const UPLOAD_CONFIG = {
  maxSize: toNumber(import.meta.env.VITE_UPLOAD_MAX_SIZE, 20 * 1024 * 1024), // default 20MB
  allowedTypes:
    splitList(import.meta.env.VITE_UPLOAD_ALLOWED_TYPES).length > 0
      ? splitList(import.meta.env.VITE_UPLOAD_ALLOWED_TYPES)
      : ["image/*", "video/*", "audio/*", "application/pdf"],
  baseUrl: import.meta.env.VITE_UPLOAD_BASE_URL,
} as const;

export const FEATURE_FLAGS = {
  socialLogin: toBool(import.meta.env.VITE_FEATURE_SOCIAL_LOGIN),
  googleLogin: toBool(import.meta.env.VITE_FEATURE_GOOGLE_LOGIN),
  microsoftLogin: toBool(import.meta.env.VITE_FEATURE_MICROSOFT_LOGIN),
  inviteByLink: toBool(import.meta.env.VITE_FEATURE_INVITE_BY_LINK),
} as const;

export const EXTERNAL_SERVICES = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  microsoftClientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
} as const;

export const ERROR_REPORTING = {
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  level: import.meta.env.VITE_ERROR_REPORTING_LEVEL,
} as const;

export const PASSWORD_RULES = {
  minLength: toNumber(import.meta.env.VITE_PASSWORD_MIN_LENGTH, 8),
  requireUppercase: toBool(
    import.meta.env.VITE_PASSWORD_REQUIRE_UPPERCASE,
    true
  ),
  requireLowercase: toBool(
    import.meta.env.VITE_PASSWORD_REQUIRE_LOWERCASE,
    true
  ),
  requireNumber: toBool(import.meta.env.VITE_PASSWORD_REQUIRE_NUMBER, true),
  requireSpecial: toBool(import.meta.env.VITE_PASSWORD_REQUIRE_SPECIAL, true),
} as const;

export const DEV_FEATURES = {
  enableDevtools: toBool(import.meta.env.VITE_ENABLE_DEVTOOLS),
  enableApiMocking: toBool(import.meta.env.VITE_ENABLE_API_MOCKING),
  enableDebugLogging: toBool(import.meta.env.VITE_ENABLE_DEBUG_LOGGING),
} as const;

// Aggregate export (optional convenience)
export const RUNTIME_CONFIG = {
  app: APP_CONFIG,
  api: API_CONFIG,
  auth: AUTH_CONFIG,
  organization: ORGANIZATION_CONFIG,
  upload: UPLOAD_CONFIG,
  featureFlags: FEATURE_FLAGS,
  external: EXTERNAL_SERVICES,
  error: ERROR_REPORTING,
  password: PASSWORD_RULES,
  dev: DEV_FEATURES,
} as const;

export type TRuntimeConfig = typeof RUNTIME_CONFIG;
