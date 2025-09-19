import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { SelectField } from "@/shared/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { forwardRef, useImperativeHandle } from "react";
import { Controller } from "react-hook-form";
import { useInviteMemberForm } from "./hook";
import { DEFAULT_ROLES, INVITE_METHODS, type TInviteMemberForm } from "./types";
import type { StepRef } from "../form";
import { Textarea } from "@/shared/components/ui/textarea";

type TProps = {
  onSubmit: (value: TInviteMemberForm) => void;
  value?: Partial<TInviteMemberForm>;
};

export const InviteMemberForm = forwardRef<StepRef, TProps>(
  ({ onSubmit, value }, ref) => {
    const {
      methods,
      handleSubmit,
      handleMethodChange,
      handleAddEmail,
      handleRemoveEmail,
      getFieldError,
    } = useInviteMemberForm({
      onSubmit,
      initialValues: value,
    });

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    const currentMethod = methods.watch("inviteMethod");
    const emails = methods.watch("emails") || [];

    return (
      <form className="flex flex-col gap-2">
        {/* Invite Method Selection */}
        <div className="space-y-2">
          <Label>Invite Method</Label>
          <Tabs
            value={currentMethod}
            onValueChange={(value) =>
              handleMethodChange(value as TInviteMemberForm["inviteMethod"])
            }
          >
            <TabsList className="grid w-full grid-cols-3">
              {INVITE_METHODS.map((method) => (
                <TabsTrigger key={method.value} value={method.value}>
                  {method.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Email Invitation */}
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Addresses</Label>
                <div className="flex gap-2">
                  <Input
                    id="emailInput"
                    type="email"
                    placeholder="Enter email address"
                    error={getFieldError("emails")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.currentTarget;
                        if (input.value) {
                          handleAddEmail(input.value);
                          input.value = "";
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(
                        "emailInput"
                      ) as HTMLInputElement;
                      if (input.value) {
                        handleAddEmail(input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {emails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {emails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary rounded-full"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmail(email)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Username Invitation */}
            <TabsContent value="username" className="space-y-4">
              {/* TODO: Implement username search/selection */}
            </TabsContent>

            {/* Share Link */}
            <TabsContent value="link" className="space-y-4">
              {/* TODO: Implement share link generation */}
            </TabsContent>
          </Tabs>
        </div>

        {/* Role Selection - Common for all methods */}
        <div className="space-y-2">
          <Controller
            control={methods.control}
            name="role"
            render={({ field, fieldState }) => (
              <SelectField
                id="role"
                label="Select Role"
                value={field.value}
                options={DEFAULT_ROLES.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Optional Message */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            {...methods.register("message")}
            placeholder="Add a personal message to your invitation"
            rows={4}
          />
        </div>
      </form>
    );
  }
);
