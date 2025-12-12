import { useState } from "react";
import { useLoginMutation } from "../../queries";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { type AxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";

export const loginFormSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useLoginMutation({
    onError(err) {
      const error = err as AxiosError<{ message: string }>;
      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      toast.error("Login failed", {
        description: <p className="text-xs">{message}</p>,
      });
    },

    onSuccess(data) {
      console.log("✅ [LOGIN SUCCESS] Received data:", {
        hasAccessToken: !!data.access_token,
        hasRefreshToken: !!data.refresh_token,
      });

      // Save tokens to localStorage
      console.log("💾 [LOGIN SUCCESS] Saving access_token to localStorage...");
      localStorage.setItem("access_token", data.access_token);
      console.log(
        "💾 [LOGIN SUCCESS] access_token saved:",
        localStorage.getItem("access_token") ? "✅ CONFIRMED" : "❌ FAILED"
      );

      if (data.refresh_token) {
        console.log(
          "💾 [LOGIN SUCCESS] Saving refresh_token to localStorage..."
        );
        localStorage.setItem("refresh_token", data.refresh_token);
        console.log(
          "💾 [LOGIN SUCCESS] refresh_token saved:",
          localStorage.getItem("refresh_token") ? "✅ CONFIRMED" : "❌ FAILED"
        );
      }

      toast.success("Welcome back!", {
        description: (
          <p className="text-xs">You have logged in successfully.</p>
        ),
      });

      // Navigate to home
      console.log("🚀 [LOGIN SUCCESS] Navigating to / with replace: true");
      navigate({ to: "/", replace: true });
    },
  });

  const { register, formState, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await mutateAsync(values);
  };

  const redirectToSignup = () => navigate({ to: "/signup" });

  return [
    { showPassword, isSubmitingForm: isPending, formState, register },
    { setShowPassword, handleSubmit, onSubmit, redirectToSignup },
  ] as const;
};
