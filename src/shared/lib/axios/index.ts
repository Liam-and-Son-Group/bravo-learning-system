import { UPLOAD_CONFIG } from "@/shared/config/env";
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

export const nonAuthInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

export const authInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// -------------------------------------------------------------
// Token Storage Helpers (localStorage only - no in-memory cache to avoid race conditions)
// -------------------------------------------------------------
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_EXP_KEY = "access_token_expires_at"; // optional timestamp (ms) if backend provides

/**
 * Get access token - always reads from localStorage for consistency
 */
export function getAccessToken() {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return token;
}

/**
 * Set tokens - only writes to localStorage
 */
export function setTokens(data: {
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresAt?: number; // epoch ms
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  if (data.refreshToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  if (data.accessTokenExpiresAt)
    localStorage.setItem(ACCESS_EXP_KEY, String(data.accessTokenExpiresAt));
}

/**
 * Clear all tokens from localStorage
 */
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_EXP_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAccessExpiry() {
  const raw = localStorage.getItem(ACCESS_EXP_KEY);
  return raw ? Number(raw) : null;
}

// -------------------------------------------------------------
// Token Refresh State & Queue (typed)
// -------------------------------------------------------------
let isRefreshing = false;

/**
 * A queued request waiting for a token refresh to complete.
 * resolve(token) is called with the new access token so the original request can be retried.
 */
type FailedQueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: AxiosError) => void;
};

let failedQueue: FailedQueueItem[] = [];
let hasRedirected = false; // Prevent infinite reload loop / multiple logout redirects

/**
 * Flushes all queued promises once the refresh attempt completes.
 * Passing an error rejects all queued requests; otherwise they receive the fresh token.
 */
const processQueue = (error: AxiosError | null, token: string | null) => {
  for (const queued of failedQueue) {
    if (error) queued.reject(error);
    else queued.resolve(token);
  }
  failedQueue = [];
};

// -------------------------------------------------------------
// Central Logout Helper
// -------------------------------------------------------------
export function logout(reason?: string) {
  if (hasRedirected) return; // already in progress
  hasRedirected = true;
  try {
    clearTokens();
    // Could emit a custom event for app-level listeners (e.g., queryClient.clear())
    window.dispatchEvent(
      new CustomEvent("auth:logout", {
        detail: { reason: reason || "unknown" },
      })
    );
  } catch {
    // noop - best effort
  } finally {
    // Ensure navigation away from protected routes
    window.location.href = "/login";
  }
}

authInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Proactive refresh (soft): if token expiry exists & within 30s, trigger background refresh
  const exp = getAccessExpiry();
  if (exp && Date.now() + 30_000 > exp && !isRefreshing) {
    // Fire & forget best-effort refresh to extend session
    void (async () => {
      try {
        await attemptRefresh();
      } catch {
        // ignore; normal 401 flow will handle if actually expired
      }
    })();
  }
  return config;
});

authInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;
    if (!originalRequest) return Promise.reject(error);

    // Only handle 401 once per request and ignore refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/authentication/refresh")
    ) {
      const currentAccess = getAccessToken();
      const currentRefresh = getRefreshToken();
      if (!currentAccess || !currentRefresh) {
        logout("missing_tokens");
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => resolve(token),
            reject,
          });
        }).then((newToken) => {
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return authInstance(originalRequest);
        });
      }

      try {
        const newToken = await attemptRefresh();
        processQueue(null, newToken);
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return authInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr as AxiosError, null);
        logout("refresh_failed");
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

// -------------------------------------------------------------
// Refresh Logic (single-flight)
// -------------------------------------------------------------
async function attemptRefresh(): Promise<string | null> {
  if (isRefreshing)
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  isRefreshing = true;
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken)
      throw new AxiosError("No refresh token", "NO_REFRESH_TOKEN");

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/authentication/refresh`,
      { refreshToken }
    );

    // Backend returns { success, message, data: { accessToken, refreshToken } }
    if (!data.success || !data.data?.accessToken) {
      throw new AxiosError("Invalid refresh response", "INVALID_RESPONSE");
    }

    const newAccessToken = data.data.accessToken;
    const newRefreshToken = data.data.refreshToken || refreshToken;

    // Support optional expiry fields if backend returns them
    const expiresInSec: number | undefined =
      data.expires_in || data.access_token_expires_in;
    const expiryTs = expiresInSec
      ? Date.now() + expiresInSec * 1000
      : undefined;

    setTokens({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresAt: expiryTs,
    });
    return newAccessToken;
  } catch (e) {
    clearTokens();
    throw e;
  } finally {
    isRefreshing = false;
  }
}

// -------------------------------------------------------------
// File Upload Utility
// -------------------------------------------------------------
export type UploadFileOptions = {
  /** API endpoint (relative to baseURL), e.g. '/upload/avatar' */
  endpoint: string;
  /** Field name expected by backend (default: 'file') */
  fieldName?: string;
  /** Additional form data key-value pairs */
  data?: Record<string, string | Blob | number | undefined | null>;
  /** Optional axios overrides */
  config?: AxiosRequestConfig;
  /** Progress callback (0-100) */
  onProgress?: (percent: number, evt: ProgressEvent) => void;
  /** AbortSignal for cancellation */
  signal?: AbortSignal;
};

export class UploadValidationError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = "UploadValidationError";
    this.code = code;
  }
}

function validateFile(file: File) {
  if (file.size > UPLOAD_CONFIG.maxSize) {
    throw new UploadValidationError(
      `File too large. Max ${(UPLOAD_CONFIG.maxSize / 1024 / 1024).toFixed(
        2
      )}MB`,
      "FILE_TOO_LARGE"
    );
  }
  const mimeOk = UPLOAD_CONFIG.allowedTypes.some((type: string) => {
    if (type.endsWith("/*")) {
      const prefix = type.replace("/*", "");
      return file.type.startsWith(prefix);
    }
    return file.type === type;
  });
  if (!mimeOk) {
    throw new UploadValidationError(
      `Unsupported file type '${
        file.type
      }'. Allowed: ${UPLOAD_CONFIG.allowedTypes.join(", ")}`,
      "UNSUPPORTED_TYPE"
    );
  }
}

/**
 * Upload a single file with validation & progress support.
 * Automatically attaches Authorization header via authInstance.
 */
export async function uploadFile(
  file: File,
  {
    endpoint,
    fieldName = "file",
    data,
    config,
    onProgress,
    signal,
  }: UploadFileOptions
) {
  validateFile(file);

  const form = new FormData();
  form.append(fieldName, file, file.name);
  if (data) {
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      form.append(k, String(v));
    });
  }

  const response = await authInstance.post(endpoint, form, {
    ...config,
    headers: {
      ...(config?.headers || {}),
      // Let browser set multipart boundary
    },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        const percent = Math.round((evt.loaded / evt.total) * 100);
        // Cast via unknown to satisfy TS when bridging AxiosProgressEvent
        onProgress(percent, evt as unknown as ProgressEvent);
      }
    },
    signal,
  });
  return response.data;
}

/**
 * Convenience multiple file uploader (sequential to respect ordering & simplify progress aggregation).
 */
export async function uploadFiles(
  files: File[],
  options: Omit<UploadFileOptions, "onProgress"> & {
    /** Per-file progress */
    onFileProgress?: (file: File, percent: number) => void;
    /** Aggregate progress across all files */
    onOverallProgress?: (percent: number) => void;
  }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results: any[] = [];
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  let uploadedBytes = 0;

  for (const file of files) {
    const res = await uploadFile(file, {
      ...options,
      onProgress: (percent, evt) => {
        options.onFileProgress?.(file, percent);
        if (evt.lengthComputable) {
          // Estimate aggregate percent
          const currentUploaded = percent === 100 ? file.size : evt.loaded;
          const previousUploaded = uploadedBytes;
          const tempTotal = previousUploaded + currentUploaded;
          const overall = Math.min(
            100,
            Math.round((tempTotal / totalBytes) * 100)
          );
          options.onOverallProgress?.(overall);
        }
      },
    });
    uploadedBytes += file.size;
    options.onOverallProgress?.(
      Math.min(100, Math.round((uploadedBytes / totalBytes) * 100))
    );
    results.push(res);
  }
  return results;
}
