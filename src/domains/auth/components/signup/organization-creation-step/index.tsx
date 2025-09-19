import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { SelectField } from "@/shared/components/ui/select";
import { forwardRef, useImperativeHandle } from "react";
import { Controller } from "react-hook-form";
import {
  useOrganizationForm,
  type TFormCreateOrganizationValues,
} from "./hook";
import { CONST_COUNTRIES, ORGANIZATION_TYPES } from "../const";

type TProps = {
  onSubmit: (value: TFormCreateOrganizationValues) => void;
  value?: TFormCreateOrganizationValues;
};

export const OrganizationCreationForm = forwardRef(
  ({ onSubmit, value }: TProps, ref) => {
    const {
      methods,
      handleSubmit,
      handleChangeOrganizationType,
      handleChangeCountry,
      getFieldError,
    } = useOrganizationForm({
      onSubmit,
      initialValues: value,
    });

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    return (
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Organization Name */}
          <div className="grid gap-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              {...methods.register("organizationName")}
              error={getFieldError("organizationName")}
              required
            />
          </div>
          {/* Organization Type */}
          <div className="grid gap-2">
            <Controller
              control={methods.control}
              name="organizationType"
              render={({ field, fieldState }) => (
                <SelectField
                  id="organizationType"
                  value={field.value}
                  label="Organization Type"
                  options={ORGANIZATION_TYPES}
                  onChange={handleChangeOrganizationType}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          {/* Address */}
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...methods.register("address")} />
          </div>
          {/* City */}
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...methods.register("city")}
              error={getFieldError("city")}
              required
            />
          </div>
          {/* Country */}
          <div className="grid gap-2">
            <Controller
              control={methods.control}
              name="country"
              render={({ field, fieldState }) => (
                <SelectField
                  id="country"
                  value={field.value}
                  label="Country"
                  options={CONST_COUNTRIES}
                  onChange={handleChangeCountry}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          {/* Contact Email */}
          <div className="grid gap-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              {...methods.register("contactEmail")}
              error={getFieldError("contactEmail")}
              required
            />
          </div>
          {/* Contact Phone */}
          <div className="grid gap-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              {...methods.register("contactPhone")}
              error={getFieldError("contactPhone")}
            />
          </div>
          {/* Website */}
          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" {...methods.register("website")} />
          </div>
          {/* Tax Code */}
          <div className="grid gap-2">
            <Label htmlFor="taxCode">Tax Code</Label>
            <Input id="taxCode" {...methods.register("taxCode")} />
          </div>
          {/* Logo (file upload) can be added here if needed */}
        </div>
      </form>
    );
  }
);
