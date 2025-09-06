import { cn } from "@/shared/lib/utils/mergeClass";
import { Badge, Check, Circle } from "lucide-react";

export type TStep = {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  optional?: boolean;
  /** content is shown in the panel area if provided (used by the demo) */
  content?: React.ReactNode;
};

type StepperProps = {
  steps: TStep[];
  current: number; // index
  onChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  clickable?: boolean;
  showNumbers?: boolean;
  className?: string;
  /** When true, completed steps show a check icon; otherwise they keep their icon/number */
  checkOnComplete?: boolean;
};

// --- Stepper -----------------------------------------------------------------
export function Stepper({
  steps,
  current,
  onChange,
  orientation = "horizontal",
  clickable = true,
  showNumbers = true,
  className,
  checkOnComplete = true,
}: StepperProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div className={cn("w-full", className)}>
      <ol
        role="list"
        aria-label="Progress"
        className={cn(
          "relative",
          isHorizontal
            ? "grid auto-cols-fr grid-flow-col gap-6 pb-2"
            : "flex flex-col gap-6"
        )}
      >
        {isHorizontal && (
          <div
            aria-hidden
            className="absolute left-0 top-5 h-[2px] w-full bg-muted"
          />
        )}
        {steps.map((step, idx) => {
          const completed = idx < current;
          const isActive = idx === current;
          const Icon = step.icon ?? Circle;

          return (
            <li
              key={step.id}
              className={cn("relative")}
              aria-current={isActive ? "step" : undefined}
            >
              {/* connectors */}
              {!isHorizontal && idx !== steps.length - 1 && (
                <div
                  aria-hidden
                  className="absolute left-5 top-10 bottom-[-1.5rem] w-[2px] bg-muted"
                />
              )}

              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onChange?.(idx)}
                className={cn(
                  "group flex items-start gap-4 text-left outline-none",
                  isHorizontal ? "justify-start" : "",
                  !clickable && "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background",
                    completed && "border-primary/60 bg-primary/5",
                    isActive && "ring-4 ring-primary/20 border-primary",
                    !completed && !isActive && "border-muted-foreground/20"
                  )}
                >
                  {completed && checkOnComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  {showNumbers && !completed && (
                    <span className="absolute  text-[11px] font-medium opacity-70">
                      {idx + 1}
                    </span>
                  )}
                </span>

                <span className="flex min-w-0 flex-col">
                  <span
                    className={cn(
                      "text-sm font-semibold tracking-tight",
                      completed
                        ? "text-foreground"
                        : isActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                    {step.optional && (
                      <Badge className="ml-2 h-5 align-middle">Optional</Badge>
                    )}
                  </span>
                  {step.description && (
                    <span className="text-xs mt-1 text-muted-foreground line-clamp-2">
                      {step.description}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
