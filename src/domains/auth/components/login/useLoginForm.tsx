import { useState } from "react";
import { useLoginMutation } from "../../queries";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { type AxiosError } from "axios";
import { capitalizeFirstLetter } from "@/shared/lib/utils/stringify";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../storage";

export const loginFormSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUserData } = useAuthStore();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useLoginMutation({
    onError(err) {
      const error = err as AxiosError<{ message: string }, { message: string }>;
      const message = error.response?.data?.message || "Unknown error occurred";
      const stringifyMessage = capitalizeFirstLetter(message);

      toast("Login failed", {
        description: <p className="text-xs">{stringifyMessage}</p>,
      });
    },

    onSuccess(data) {
      toast.success("Login successful", {
        description: (
          <p className="text-xs">
            Welcome back! You have logged in successfully.
          </p>
        ),
      });
      localStorage.setItem("access_token", data?.access_token || "");
      localStorage.setItem("refresh_token", data?.access_token || "");
      navigate({ to: "/", replace: true });
    },
  });

  const { register, formState, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
      // remember: false,
    },
  });

  const onSubmit = async (value: LoginFormValues) => {
    setUserData({
      id: "",
      country: "",
      email: value.username,
      fullname: "",
      jobTitle: "",
      username: "",
    });
    mutateAsync(value);
  };

  const redirectToSignup = () => navigate({ to: "/signup" });

  return [
    { showPassword, isSubmitingForm: isPending, formState, register },
    { setShowPassword, handleSubmit, onSubmit, redirectToSignup },
  ] as const;
};
