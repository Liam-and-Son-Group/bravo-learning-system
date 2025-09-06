import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";
import type { TStorageUserData } from "../types";
import { AUTH_STORAGE_KEY } from "../const";

type TAuthStore = TStorageUserData & {
  setUserData: (
    value: Omit<TStorageUserData, "accessToken" | "refreshToken">
  ) => void;
  revokeAccessToken: () => void;
  renewToken: (value: Pick<TAuthStore, "accessToken" | "refreshToken">) => void;
};

export const useAuthStore = create<TAuthStore>()(
  devtools(
    persist(
      (set) => ({
        id: "",
        fullname: "",
        email: "",
        jobTitle: "",
        country: "",
        accessToken: "",
        refreshToken: "",
        username: "",
        setUserData: (value) => set((state) => ({ ...state, ...value })),
        revokeAccessToken: () =>
          set((state) => ({ ...state, accessToken: "", refreshToken: "" })),
        renewToken: (value: Pick<TAuthStore, "accessToken" | "refreshToken">) =>
          set((state) => ({ ...state, ...value })),
      }),
      { name: AUTH_STORAGE_KEY }
    )
  )
);
