import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, login, signupFull } from "../apis";
import type { AxiosError } from "axios";
import type {
  TLoginResponse,
  TSignupFullRequest,
  TSignupFullResponse,
} from "../types";
import type { TReponse } from "@/shared/types/http.type";

type TParams = {
  onSuccess?: (data: TLoginResponse) => void;
  onError?: (error: Error) => void;
};

export const USER_QUERIES_KEY_NAME = "user";
export const TOKEN_KEY_NAME = "token";

export const useLoginMutation = (params?: TParams) => {
  const { onSuccess, onError } = params || {};
  return useMutation({
    mutationKey: ["login-action"],
    mutationFn: login,
    onSuccess: (data: TReponse<TLoginResponse>) => {
      if (!data?.body?.access_token) {
        const error = new Error("Invalid login response: missing access token");
        onError?.(error);
        return;
      }
      onSuccess?.(data.body);
    },
    onError: (error: AxiosError) => {
      onError?.(error);
    },
  });
};

export const useFullSignupMutation = (params?: {
  onSuccess?: (data: TSignupFullResponse) => void;
  onError?: (error: AxiosError) => void;
}) => {
  return useMutation({
    mutationKey: ["signup-full"],
    mutationFn: (payload: TSignupFullRequest) => signupFull(payload),
    onSuccess: (res: TReponse<TSignupFullResponse>) => {
      // If backend returns tokens, save them to localStorage
      const { access_token, refresh_token } = res.body;
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        if (refresh_token) {
          localStorage.setItem("refresh_token", refresh_token);
        }
      }
      params?.onSuccess?.(res.body);
    },
    onError: (error: AxiosError) => {
      params?.onError?.(error);
      console.error("Full signup failed:", error.message);
    },
  });
};

export const useGetUser = ({ enabled }: { enabled: boolean }) =>
  useQuery({
    queryKey: [USER_QUERIES_KEY_NAME],
    queryFn: () => getUser(),
    enabled,
  });
