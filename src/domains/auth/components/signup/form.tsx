import { Stepper } from "@/shared/components/ui/stepper";
import { CONST_SIGNUP_STEP } from "./const";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import CreateAccountStep from "./create-account-step";
import type { TFormCreateAccountValues } from "./create-account-step/hook";
import { OrganizationCreationForm } from "./organization-creation-step";
import type { TFormCreateOrganizationValues } from "./organization-creation-step/hook";
import { InviteMemberForm } from "./invite-member";
import type { TInviteMemberForm } from "./invite-member/types";
import { DoneStep } from "./done-step";
import { useFullSignupMutation } from "@/domains/auth/queries";
import { uploadSignupAvatar } from "@/domains/auth/apis";
import type { TSignupFullRequest } from "@/domains/auth/types";
import { toast } from "sonner";

type TCombinedForm = {
  createAccount: TFormCreateAccountValues;
  organization: TFormCreateOrganizationValues;
  inviteMember: TInviteMemberForm;
};

export type StepRef = {
  submit: () => void;
};

export default function SignUpForm() {
  const accountStepRef = useRef<StepRef>(null);
  const organizationStepRef = useRef<StepRef>(null);
  const inviteStepRef = useRef<StepRef>(null);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [combinedForm, setCombinedForm] = useState<TCombinedForm>();
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: submitFullSignup, isPending: isSubmitting } =
    useFullSignupMutation({
      onSuccess: () => {
        toast.success("Signup complete", {
          description: (
            <p className="text-xs">Your account and organization are ready.</p>
          ),
        });
        setCurrentStep(listOfContent.length - 1);
      },
      onError: () => {
        toast("Signup failed", {
          description: (
            <p className="text-xs">
              We couldn't finish setting up your account. Please try again.
            </p>
          ),
        });
      },
    });

  const cardData = CONST_SIGNUP_STEP.at(currentStep);
  const { title = "", description = "" } = cardData || {};

  const handleFormSubmission = async (formData: TCombinedForm) => {
    if (!formData) return;
    try {
      let avatarUrl: string | undefined;
      const avatarFile = formData.createAccount.avatar as unknown as
        | File
        | undefined;
      if (avatarFile) {
        try {
          setIsUploading(true);
          const res = await uploadSignupAvatar(avatarFile);
          avatarUrl = res.body.url;
        } catch (e) {
          toast("Avatar upload failed", {
            description: (
              <p className="text-xs">
                We couldn't upload your avatar. You can add one later in your
                profile.
              </p>
            ),
          });
        } finally {
          setIsUploading(false);
        }
      }

      const payload: TSignupFullRequest = {
        createAccount: {
          avatarUrl,
          fullname: formData.createAccount.fullname,
          job: formData.createAccount.job,
          email: formData.createAccount.email,
          password: formData.createAccount.password,
          confirm: formData.createAccount.confirm,
          country: formData.createAccount.country,
          phone: formData.createAccount.phone || undefined,
          timezone: formData.createAccount.timezone,
        },
        organization: {
          organizationName: formData.organization.organizationName,
          organizationType: formData.organization.organizationType,
          address: formData.organization.address || undefined,
          city: formData.organization.city,
          country: formData.organization.country,
          contactEmail: formData.organization.contactEmail,
          contactPhone: formData.organization.contactPhone || undefined,
          website: formData.organization.website || undefined,
          taxCode: formData.organization.taxCode || undefined,
        },
        inviteMember: {
          inviteMethod: formData.inviteMember.inviteMethod,
          emails: formData.inviteMember.emails,
          usernames: formData.inviteMember.usernames,
          role: formData.inviteMember.role,
          message: formData.inviteMember.message || undefined,
        },
      };

      submitFullSignup(payload);
    } catch (error) {
      toast("Unexpected error", {
        description: (
          <p className="text-xs">Something went wrong. Please try again.</p>
        ),
      });
    }
  };

  const updateCombinedForm = <K extends keyof TCombinedForm>(
    key: K,
    value: TCombinedForm[K]
  ) => {
    const updatedForm = {
      ...combinedForm,
      [key]: value,
    } as TCombinedForm;

    setCombinedForm(updatedForm);

    // If we're on the invite step (second to last step), submit the entire form
    if (currentStep === listOfContent.length - 2) {
      handleFormSubmission(updatedForm);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const listOfContent = [
    <CreateAccountStep
      ref={accountStepRef}
      value={combinedForm?.createAccount}
      onSubmit={(value) => updateCombinedForm("createAccount", value)}
    />,
    <OrganizationCreationForm
      ref={organizationStepRef}
      value={combinedForm?.organization}
      onSubmit={(value) => updateCombinedForm("organization", value)}
    />,
    <InviteMemberForm
      ref={inviteStepRef}
      value={combinedForm?.inviteMember}
      onSubmit={(value) => updateCombinedForm("inviteMember", value)}
    />,
    <DoneStep
      organizationName={combinedForm?.organization?.organizationName}
      userEmail={combinedForm?.createAccount?.email}
    />,
  ];

  const listOfPageRef = [accountStepRef, organizationStepRef, inviteStepRef];

  const onChangeStepper = (stepIdx: number) => {
    setCurrentStep(stepIdx);
  };

  const handleNextStep = () => {
    listOfPageRef.at(currentStep)?.current?.submit();
  };

  return (
    <div className="py-2 flex flex-col gap-2">
      <Stepper
        steps={CONST_SIGNUP_STEP}
        showNumbers={false}
        current={currentStep}
        onChange={onChangeStepper}
      />
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>

          <CardDescription>{`Step ${currentStep + 1} of ${
            CONST_SIGNUP_STEP.length
          } — ${description}`}</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-auto">
          {listOfContent.at(currentStep)}
        </CardContent>
        <CardFooter className="flex justify-end self-end gap-4 mt-2 w-full">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          )}
          {currentStep < listOfContent.length - 1 && (
            <Button
              onClick={handleNextStep}
              disabled={isUploading || isSubmitting}
            >
              {isUploading
                ? "Uploading..."
                : isSubmitting
                ? "Submitting..."
                : currentStep === listOfContent.length - 2
                ? "Complete Setup"
                : "Next"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
