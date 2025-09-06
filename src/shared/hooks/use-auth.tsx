import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useCheckToken, useGetUser } from "@/domains/auth/queries";
import { useAuthStore } from "@/domains/auth/storage";

export const useAuth = () => {
  const hasToken = !!localStorage.getItem("access_token");

  const { setUserData } = useAuthStore();
  const hasShownToast = useRef(false);

  const { data: tokenCheck } = useCheckToken(hasToken);

  const {
    data: userData,
    isLoading,
    isSuccess,
    isError,
  } = useGetUser({ enabled: tokenCheck?.body.verify === "OK" });

  const setupAccountToStorage = useCallback(() => {
    if (userData) {
      const raw = userData.body;
      setUserData({
        id: raw.id,
        country: raw.country,
        email: raw.email,
        fullname: raw.fullname,
        jobTitle: raw.role.Name,
        username: raw.email,
      });
    }
  }, [userData, setUserData]);

  useEffect(() => {
    if (hasShownToast.current) return;

    if (isLoading) {
      toast("Syncing your account information", {
        description: "Syncing your settings and account information...",
      });
    } else if (isError) {
      toast("Failed to sync your account", {
        description:
          "We couldn't update your settings and account information. Please try again.",
      });
      hasShownToast.current = true;
    } else if (isSuccess && userData) {
      setupAccountToStorage();
      toast("Account synced successfully", {
        description: "Your settings and account information are up to date.",
      });
      hasShownToast.current = true;
    }
  }, [isLoading, isError, isSuccess, userData, setupAccountToStorage]);
};
