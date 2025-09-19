import { useMutation, useQuery } from "@tanstack/react-query";
import { checkToken, getUser, login, signupFull } from "../apis";
import type { AxiosError } from "axios";
import { useAuthStore } from "../storage";
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
  const { renewToken } = useAuthStore();
  return useMutation({
    mutationKey: ["login-action"],
    mutationFn: login,
    onSuccess: (data: TReponse<TLoginResponse>) => {
      renewToken({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token || "",
      });
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
  const { renewToken } = useAuthStore();
  return useMutation({
    mutationKey: ["signup-full"],
    mutationFn: (payload: TSignupFullRequest) => signupFull(payload),
    onSuccess: (res: TReponse<TSignupFullResponse>) => {
      // If backend returns tokens, persist them
      const { access_token, refresh_token } = res.body;
      if (access_token) {
        renewToken({
          accessToken: access_token,
          refreshToken: refresh_token || "",
        });
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

export const useCheckToken = (enabled: boolean) =>
  useQuery({
    queryKey: [TOKEN_KEY_NAME],
    queryFn: () => checkToken(),
    refetchOnWindowFocus: true,
    refetchInterval: 6000,
    enabled,
  });
