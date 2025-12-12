import { authInstance, nonAuthInstance } from "@/shared/lib/axios";
import type { TReponse } from "@/shared/types/http.type";
import type {
  TLoginResponse,
  TUserProfileResponse,
  TSignupFullRequest,
  TSignupFullResponse,
  TUploadAvatarResponse,
  TRawLoginApiResponse,
} from "../types";

export const login = async (data: {
  username: string;
  password: string;
}): Promise<TReponse<TLoginResponse>> => {
  const response = await nonAuthInstance.post<TRawLoginApiResponse>(
    "/authentication/signin",
    {
      email: data.username,
      password: data.password,
      rememberMe: true,
    }
  );

  const raw = response.data;

  if (!raw || !raw.success || !raw.data?.accessToken) {
    throw new Error(raw?.message || "Login failed");
  }

  return {
    body: {
      access_token: raw.data.accessToken,
      refresh_token: raw.data.refreshToken || "",
    },
  };
};

export const getUser = async (): Promise<TReponse<TUserProfileResponse>> => {
  const response = await authInstance.get("/authentication/profile");
  // Backend returns { success, message, data }, transform to { body }
  if (!response.data.data) {
    throw new Error(response.data.message || "Failed to get user profile");
  }
  return {
    body: response.data.data,
  };
};

// Public avatar upload (prior to full signup). If backend requires auth, switch to authInstance.
export const uploadSignupAvatar = async (
  file: File
): Promise<TReponse<TUploadAvatarResponse>> => {
  const form = new FormData();
  form.append("file", file, file.name);

  // Generate path segment /pre-signup/<YYYYMMDD_HHmmss>
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const dateSegment = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const storagePath = `/pre-signup/${dateSegment}`;

  // Some backends expect a path field; adjust key name if required (e.g., 'directory' or 'folder')
  form.append("path", storagePath);

  const response = await nonAuthInstance.post("file/upload", form, {
    headers: {
      // Let browser set multipart boundary automatically
    },
    params: {
      // Also pass as query param in case backend reads from query
      path: storagePath,
    },
  });
  return response.data;
};

// Composite multi-step signup endpoint
export const signupFull = async (
  payload: TSignupFullRequest
): Promise<TReponse<TSignupFullResponse>> => {
  const response = await nonAuthInstance.post(
    "/authentication/signup",
    payload
  );
  return response.data;
};

// Logout endpoint - revokes refresh token on backend
export const logoutApi = async (): Promise<TReponse<{ message: string }>> => {
  try {
    const response = await authInstance.post("/authentication/logout");
    // Backend returns { success, message, data }, transform to { body }
    return {
      body: { message: response.data.message || "Logged out successfully" },
    };
  } catch (error) {
    // Even if API call fails, we still want to clear local tokens
    console.warn("Logout API call failed:", error);
    return {
      body: { message: "Logged out locally" },
    };
  }
};
