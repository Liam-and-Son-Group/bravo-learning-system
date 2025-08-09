import { useState } from "react";
import { useLoginMutation } from "../../queries";
import { useForm } from "react-hook-form";
import z from "zod";

export const loginFormSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutateAsync, isPending } = useLoginMutation();

  const { register, formState, handleSubmit } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
      // remember: false,
    },
  });

  const onSubmit = async (value: LoginFormValues) => {
    mutateAsync(value);
  };

  return [
    { showPassword, isSubmitingForm: isPending, formState, register },
    { setShowPassword, handleSubmit, onSubmit },
  ] as const;
};
