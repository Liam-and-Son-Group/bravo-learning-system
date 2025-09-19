import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  organizationName: z
    .string()
    .min(3, "Organization name must be at least 3 characters"),
  organizationType: z.string().min(1, "Organization type is required"),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[0-9\s-]{7,15}$/.test(val),
      "Please enter a valid phone number."
    ),
  website: z.string().optional(),
  taxCode: z.string().optional(),
  logo: z.any().optional(),
});

export type TFormCreateOrganizationValues = z.infer<typeof schema>;

type UseOrganizationFormProps = {
  onSubmit: (values: TFormCreateOrganizationValues) => void;
  initialValues?: Partial<TFormCreateOrganizationValues>;
};

export const useOrganizationForm = ({
  onSubmit,
  initialValues,
}: UseOrganizationFormProps) => {
  const methods = useForm<TFormCreateOrganizationValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const handleChangeOrganizationType = (value: string) => {
    methods.setValue("organizationType", value);
  };

  const handleChangeCountry = (value: string) => {
    methods.setValue("country", value);
  };

  const getFieldError = (
    fieldName: keyof TFormCreateOrganizationValues
  ): string | undefined => {
    return methods.formState.errors[fieldName]?.message as string | undefined;
  };

  return {
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
    handleChangeOrganizationType,
    handleChangeCountry,
    getFieldError,
  };
};
