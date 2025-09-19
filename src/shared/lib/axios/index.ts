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

let isRefreshing = false;
let failedQueue: any[] = [];
let hasRedirected = false; // Prevent infinite reload loop

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

authInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      // 🚫 No token → logout immediately once
      if (!accessToken || !refreshToken) {
        if (!hasRedirected) {
          hasRedirected = true;
          localStorage.clear();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If refresh already in progress, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return authInstance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          { refresh_token: refreshToken }
        );

        const newAccessToken = data.access_token;
        localStorage.setItem("access_token", newAccessToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return authInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        if (!hasRedirected) {
          hasRedirected = true;
          localStorage.clear();
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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
