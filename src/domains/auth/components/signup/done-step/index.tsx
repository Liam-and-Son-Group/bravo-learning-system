import { Card } from "@/shared/components/ui/card";
import { forwardRef } from "react";
import type { StepRef } from "../form";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type TProps = {
  organizationName?: string;
  userEmail?: string;
};

export const DoneStep = forwardRef<StepRef, TProps>(
  (
    { organizationName = "Your Organization", userEmail = "your email" },
    ref
  ) => {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center space-y-6">
        {/* Success Icon */}
        <div className="rounded-full bg-primary/10 p-3">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome to Bravo Education!
          </h2>
          <p className="text-muted-foreground">
            Your workspace has been created successfully.
          </p>
        </div>

        {/* Organization Details */}
        <div className="space-y-4 w-full max-w-md">
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="font-medium">{organizationName}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-4 w-full max-w-md">
          <h3 className="text-lg font-medium">Next Steps</h3>
          <ul className="space-y-2 text-sm text-muted-foreground text-left">
            <li>✓ Check your email for verification</li>
            <li>✓ Complete your organization profile</li>
            <li>✓ Set up your workspace</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/settings")}
          >
            Complete Profile
          </Button>
          <Button onClick={() => (window.location.href = "/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    );
  }
);
