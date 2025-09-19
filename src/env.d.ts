// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // App Configuration
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_ENV: "development" | "staging" | "production";

  // API Configuration
  readonly VITE_API_URL: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_API_TIMEOUT: number;

  // Authentication
  readonly VITE_AUTH_COOKIE_NAME: string;
  readonly VITE_AUTH_TOKEN_EXPIRES: number;
  readonly VITE_AUTH_REFRESH_TOKEN_EXPIRES: number;
  readonly VITE_AUTH_PERSIST_KEY: string;

  // Organization Setup
  readonly VITE_ORG_LOGO_MAX_SIZE: number;
  readonly VITE_ORG_LOGO_ALLOWED_TYPES: string;
  readonly VITE_ORG_MEMBER_INVITE_LIMIT: number;
  readonly VITE_ORG_MEMBER_ROLES: string;

  // File Upload
  readonly VITE_UPLOAD_MAX_SIZE: number;
  readonly VITE_UPLOAD_ALLOWED_TYPES: string;
  readonly VITE_UPLOAD_BASE_URL: string;

  // Feature Flags
  readonly VITE_FEATURE_SOCIAL_LOGIN: boolean;
  readonly VITE_FEATURE_GOOGLE_LOGIN: boolean;
  readonly VITE_FEATURE_MICROSOFT_LOGIN: boolean;
  readonly VITE_FEATURE_INVITE_BY_LINK: boolean;

  // External Services
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_MICROSOFT_CLIENT_ID: string;

  // Error Reporting
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ERROR_REPORTING_LEVEL: string;

  // Validation Rules
  readonly VITE_PASSWORD_MIN_LENGTH: number;
  readonly VITE_PASSWORD_REQUIRE_UPPERCASE: boolean;
  readonly VITE_PASSWORD_REQUIRE_LOWERCASE: boolean;
  readonly VITE_PASSWORD_REQUIRE_NUMBER: boolean;
  readonly VITE_PASSWORD_REQUIRE_SPECIAL: boolean;

  // Development Tools
  readonly VITE_ENABLE_DEVTOOLS: boolean;
  readonly VITE_ENABLE_API_MOCKING: boolean;
  readonly VITE_ENABLE_DEBUG_LOGGING: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// NOTE: Runtime configuration objects have been moved to `src/shared/config/env.ts`.
