/**
 * env.js
 *
 * Single source of truth for all environment variables.
 * Every VITE_* variable is accessed here — never call import.meta.env
 * directly anywhere else in the codebase.
 *
 * Vite replaces import.meta.env values at build time.
 * Fallbacks ensure the app works locally without a .env file.
 */
export const env = {
  /** Spring Boot API base URL (no trailing slash) */
  API_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',

  /** Current build environment: 'development' | 'production' | 'test' */
  MODE: import.meta.env.MODE,

  /** True only in production builds */
  IS_PROD: import.meta.env.PROD,

  /** True in dev server / vite preview */
  IS_DEV: import.meta.env.DEV,
};
