import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CONST_COUNTRIES, TIMEZONES } from "../const";

export const formSchema = z
  .object({
    avatar: z.file({ error: "Avatar is required" }).nullable(),
    fullname: z
      .string()
      .min(1, { message: "Full name is required." })
      .max(100, { message: "Full name must be less than 100 characters." }),

    job: z
      .string()
      .min(2, { message: "Job title is required." })
      .max(50, { message: "Job title must be less than 50 characters." }),

    email: z.string().email({ message: "Please enter a valid email address." }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),

    confirm: z.string(),

    country: z
      .string()
      .min(1, { message: "Please select your nation or region." }),

    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[0-9\s-]{7,15}$/.test(val),
        "Please enter a valid phone number."
      ),

    timezone: z.string().min(1, { message: "Please select a timezone." }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export type TFormCreateAccountValues = z.infer<typeof formSchema>;

export default function useCreateAccount({
  initValue,
}: {
  initValue?: TFormCreateAccountValues;
}) {
  const { control, register, setValue, handleSubmit, formState } =
    useForm<TFormCreateAccountValues>({
      defaultValues: initValue ?? {
        confirm: "",
        country: CONST_COUNTRIES[0].value,
        email: "",
        fullname: "",
        job: "",
        password: "",
        phone: "",
        timezone: TIMEZONES[0].value,
      },
      resolver: zodResolver(formSchema),
    });

  const handleAvatarChange = (file: File | null) => {
    setValue("avatar", file);
  };

  const { errors } = formState;

  return [
    { control, register, formState, errors },
    { handleSubmit, handleAvatarChange },
  ] as const;
}
