import { authInstance, nonAuthInstance } from "@/shared/lib/axios";
import type { TReponse } from "@/shared/types/http.type";
import type {
  TCheckToken,
  TLoginResponse,
  TUserProfileResponse,
  TSignupFullRequest,
  TSignupFullResponse,
  TUploadAvatarResponse,
} from "../types";

export const login = async (data: {
  username: string;
  password: string;
}): Promise<TReponse<TLoginResponse>> => {
  const response = await nonAuthInstance.post("/auth/login", data);
  return response.data;
};

export const checkToken = async (): Promise<TReponse<TCheckToken>> => {
  const response = await authInstance.get("/verification/token");
  return response.data;
};

export const getUser = async (): Promise<TReponse<TUserProfileResponse>> => {
  const response = await authInstance.get("/users/self/profile");
  return response.data;
};

// Public avatar upload (prior to full signup). If backend requires auth, switch to authInstance.
export const uploadSignupAvatar = async (
  file: File
): Promise<TReponse<TUploadAvatarResponse>> => {
  const form = new FormData();
  form.append("file", file, file.name);
  // Endpoint assumption; adjust to backend: /uploads/avatar or /auth/uploads/avatar
  const response = await nonAuthInstance.post("/uploads/avatar", form, {
    headers: {
      // Let browser set multipart boundary automatically
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
