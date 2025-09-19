import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { TInviteMemberForm, TInviteMethod } from "./types";

const schema = z.object({
  inviteMethod: z.enum(["email", "username", "link"]),
  emails: z.array(z.string()),
  usernames: z.array(
    z.string().min(3, "Username must be at least 3 characters")
  ),
  role: z.string().min(1, "Role is required"),
  message: z.string().optional(),
  linkExpiration: z.date().optional(),
  maxUses: z.number().min(1).optional(),
});

const defaultValues: TInviteMemberForm = {
  inviteMethod: "email",
  emails: [],
  usernames: [],
  role: "student",
  message: "",
};

export type UseInviteMemberFormProps = {
  onSubmit: (values: TInviteMemberForm) => void;
  initialValues?: Partial<TInviteMemberForm>;
};

export const useInviteMemberForm = ({
  onSubmit,
  initialValues,
}: UseInviteMemberFormProps) => {
  const methods = useForm<TInviteMemberForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
    mode: "onChange",
  });

  const handleMethodChange = (method: TInviteMethod) => {
    methods.setValue("inviteMethod", method);
    // Reset form fields based on method
    if (method === "email") {
      methods.setValue("usernames", []);
    } else if (method === "username") {
      methods.setValue("emails", []);
    } else {
      methods.setValue("emails", []);
      methods.setValue("usernames", []);
    }
  };

  const handleAddEmail = (email: string) => {
    const currentEmails = methods.getValues("emails") || [];
    if (!currentEmails.includes(email)) {
      methods.setValue("emails", [...currentEmails, email]);
    }
  };

  const handleRemoveEmail = (email: string) => {
    const currentEmails = methods.getValues("emails") || [];
    methods.setValue(
      "emails",
      currentEmails.filter((e) => e !== email)
    );
  };

  const handleAddUsername = (username: string) => {
    const currentUsernames = methods.getValues("usernames") || [];
    if (!currentUsernames.includes(username)) {
      methods.setValue("usernames", [...currentUsernames, username]);
    }
  };

  const handleRemoveUsername = (username: string) => {
    const currentUsernames = methods.getValues("usernames") || [];
    methods.setValue(
      "usernames",
      currentUsernames.filter((u) => u !== username)
    );
  };

  const getFieldError = (
    fieldName: keyof TInviteMemberForm
  ): string | undefined => {
    return methods.formState.errors[fieldName]?.message as string | undefined;
  };

  return {
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
    handleMethodChange,
    handleAddEmail,
    handleRemoveEmail,
    handleAddUsername,
    handleRemoveUsername,
    getFieldError,
  };
};
