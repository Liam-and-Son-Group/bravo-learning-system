import { Input } from "@/shared/components/ui/input";
import { SelectField } from "@/shared/components/ui/select";

import { User, Briefcase, Mail, Lock } from "lucide-react";
import { COUNT_COUNTRIES, TIMEZONES } from "../const";
import { Label } from "@/shared/components/ui/label";
import { AvatarUploader } from "@/shared/components/ui/upload";
import { Controller } from "react-hook-form";
import type { TFormCreateAccountValues } from "./hook";
import useCreateAccount from "./hook";
import { forwardRef, useImperativeHandle } from "react";

type TProps = {
  onSubmit: (value: TFormCreateAccountValues) => void;
  value?: TFormCreateAccountValues;
};

const CreateAccountStep = forwardRef(function CreateAccountStep(
  { onSubmit, value }: TProps,
  ref
) {
  const [{ control, register, errors }, { handleAvatarChange, handleSubmit }] =
    useCreateAccount({ initValue: value });

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }));

  return (
    <form className="flex flex-col gap-4 p-2">
      <div className="flex flex-col items-center gap-4 mb-2">
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <AvatarUploader
              showPreview
              value={field.value}
              variant="circle"
              size="lg"
              placeholder="Avatar"
              onChange={handleAvatarChange}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="grid gap-2">
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" /> Full name
          </Label>
          <Input
            title="Fullname"
            id="fullname"
            placeholder="Ada Lovelace"
            error={errors.fullname?.message}
            {...register("fullname")}
          />
        </div>

        {/* Current Job */}
        <div className="grid gap-2">
          <Label className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Current Job
          </Label>
          <Input
            id="job"
            placeholder="Software Engineer"
            error={errors.job?.message}
            {...register("job")}
          />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </Label>
          <Input
            id="email"
            type="email"
            error={errors.email?.message}
            placeholder="you@example.com"
            {...register("email")}
          />
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        {/* Confirm Password */}
        <div className="grid gap-2">
          <Label className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Confirm Password
          </Label>
          <Input
            id="confirm"
            type="password"
            placeholder="••••••••"
            error={errors.confirm?.message}
            {...register("confirm")}
          />
        </div>

        {/* Additional suggestions: phone number, timezone */}
        <div className="grid gap-2">
          <Label>Phone Number (optional)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 555 123 4567"
            {...register("phone")}
          />
        </div>

        {/* Nation / Region */}
        <div className="grid gap-2">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Nation / Region"
                id="country"
                options={COUNT_COUNTRIES}
                value={field.value}
                onChange={field.onChange}
                error={errors.country?.message}
              />
            )}
          />
        </div>

        <div className="grid gap-2">
          <Controller
            name="timezone"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Time zone"
                id="timezone"
                options={TIMEZONES}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </form>
  );
});

export default CreateAccountStep;
