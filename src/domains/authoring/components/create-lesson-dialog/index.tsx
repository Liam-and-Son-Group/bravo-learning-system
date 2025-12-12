import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Stepper, type TStep } from "@/shared/components/ui/stepper";
import { TypeSelectionStep } from "./type-selection-step";
import { ConfigurationStep } from "./configuration-step";
import {
  DEFAULT_FORM_DATA,
  type CreateLessonFormData,
  type LessonType,
} from "../../types/lesson-creation";
import { ClipboardCheck, BookOpen, Puzzle, Gamepad2 } from "lucide-react";

interface CreateLessonDialogProps {
  folders?: { id: string; name: string }[];
  onCreated?: (lesson: CreateLessonFormData) => void;
  children?: React.ReactNode;
}

const STEPS: TStep[] = [
  {
    id: "type",
    title: "Select Type",
    description: "Choose content type",
  },
  {
    id: "config",
    title: "Configure",
    description: "Set up details",
  },
];

const TYPE_ICONS: Record<
  LessonType,
  React.ComponentType<{ className?: string }>
> = {
  assessment: ClipboardCheck,
  lesson: BookOpen,
  "puzzle-game": Puzzle,
  "custom-game": Gamepad2,
};

export function CreateLessonDialog({
  folders = [],
  onCreated,
  children,
}: CreateLessonDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] =
    useState<CreateLessonFormData>(DEFAULT_FORM_DATA);

  const handleTypeSelect = (type: LessonType) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleFieldChange = (
    field: keyof CreateLessonFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 0 && !formData.type) {
      return; // Guard: type must be selected
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleCreate = () => {
    // Validation
    if (!formData.type || !formData.name.trim()) {
      return;
    }

    // Call parent callback with form data
    onCreated?.(formData);

    // Reset and close
    setFormData(DEFAULT_FORM_DATA);
    setCurrentStep(0);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset on close
      setFormData(DEFAULT_FORM_DATA);
      setCurrentStep(0);
    }
    setOpen(newOpen);
  };

  const canProceed =
    currentStep === 0 ? formData.type !== null : formData.name.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>Create New Lesson</Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formData.type && (
              <>
                {(() => {
                  const Icon = TYPE_ICONS[formData.type];
                  return <Icon className="h-5 w-5" />;
                })()}
              </>
            )}
            Create New Content
          </DialogTitle>
          <DialogDescription>
            {currentStep === 0
              ? "Choose the type of content you want to create"
              : "Configure your content settings"}
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="py-4">
          <Stepper
            steps={STEPS}
            current={currentStep}
            onChange={setCurrentStep}
            clickable={false}
            checkOnComplete={true}
            orientation="horizontal"
          />
        </div>

        {/* Step Content */}
        <div className="py-4">
          {currentStep === 0 && (
            <TypeSelectionStep
              selectedType={formData.type}
              onSelect={handleTypeSelect}
            />
          )}

          {currentStep === 1 && (
            <ConfigurationStep
              formData={formData}
              onChange={handleFieldChange}
              folders={folders}
            />
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed}>
              Next
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={!canProceed}>
              Create
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
