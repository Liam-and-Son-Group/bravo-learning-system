import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";
import type { TStorageUserData } from "../types";
import { AUTH_STORAGE_KEY } from "../const";

// Simplified store: only user profile data, no tokens
type TAuthStore = Omit<TStorageUserData, "accessToken" | "refreshToken"> & {
  setUserData: (
    value: Omit<TStorageUserData, "accessToken" | "refreshToken">
  ) => void;
  logout: () => void;
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
        username: "",
        setUserData: (value) => set((state) => ({ ...state, ...value })),
        logout: () =>
          set(() => ({
            id: "",
            fullname: "",
            email: "",
            jobTitle: "",
            country: "",
            username: "",
          })),
      }),
      { name: AUTH_STORAGE_KEY }
    )
  )
);
