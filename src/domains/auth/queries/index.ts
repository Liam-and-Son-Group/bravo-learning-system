import { useMutation } from "@tanstack/react-query";
import { login, signup } from "../apis";
import type { AxiosError } from "axios";
import { useAuthStore } from "../storage";
import type { TLoginResponse, TTemplateResponse } from "../types";

type TParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useLoginMutation = (params?: TParams) => {
  const { onSuccess, onError } = params || {};
  const loginAction = useAuthStore((state) => state.renewToken);
  return useMutation({
    mutationKey: ["login-action"],
    mutationFn: login,
    onSuccess: (data: TTemplateResponse<TLoginResponse>) => {
      loginAction({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token || "",
      });
      onSuccess?.();
    },
    onError: (error: AxiosError) => {
      onError?.(error);
    },
  });
};

export const useSignupMutation = () =>
  useMutation({
    mutationFn: signup,
    onError: (error: AxiosError) => {
      console.error("Signup failed:", error.message);
    },
  });
