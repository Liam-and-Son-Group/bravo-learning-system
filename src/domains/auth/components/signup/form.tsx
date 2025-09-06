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

type TCombinedForm = {
  createAccount: TFormCreateAccountValues;
};

export type StepRef = {
  submit: () => void;
};

export default function SignUpForm() {
  const accountStepRef = useRef<StepRef>(null);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [combinedForm, setCombinedForm] = useState<TCombinedForm>();
  console.log("🚀 ~ SignUpForm ~ combinedForm:", combinedForm);

  const cardData = CONST_SIGNUP_STEP.at(currentStep);
  const { title = "", description = "" } = cardData || {};

  const updateCombinedForm = <K extends keyof TCombinedForm>(
    key: K,
    value: TCombinedForm[K]
  ) => {
    setCombinedForm(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        } as TCombinedForm)
    );

    setCurrentStep(currentStep + 1);
  };

  const listOfContent = [
    <CreateAccountStep
      ref={accountStepRef}
      value={combinedForm?.createAccount}
      onSubmit={(value) => updateCombinedForm("createAccount", value)}
    />,
  ];

  const listOfPageRef = [accountStepRef];

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
        <CardFooter className="flex justify-end self-end mt-2">
          <Button onClick={handleNextStep}>Next</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
