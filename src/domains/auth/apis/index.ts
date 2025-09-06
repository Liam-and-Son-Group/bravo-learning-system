import { authInstance, nonAuthInstance } from "@/shared/lib/axios";
import type { TReponse } from "@/shared/types/http.type";
import type {
  TCheckToken,
  TLoginResponse,
  TUserProfileResponse,
} from "../types";

export const login = async (data: {
  username: string;
  password: string;
}): Promise<TReponse<TLoginResponse>> => {
  const response = await nonAuthInstance.post("/auth/login", data);
  return response.data;
};

export const signup = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await nonAuthInstance.post("/auth/signup", data);
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
