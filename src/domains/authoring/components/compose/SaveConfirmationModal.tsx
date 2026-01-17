import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Save, Loader2, GitBranch } from "lucide-react";

interface SaveConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (versionName: string) => void;
  isSaving: boolean;
  currentBranchName?: string;
}

export const SaveConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
  isSaving,
  currentBranchName,
}: SaveConfirmationModalProps) => {
  const [versionName, setVersionName] = useState("");

  const handleConfirm = () => {
    if (!versionName.trim()) {
      return;
    }
    onConfirm(versionName.trim());
  };

  const handleClose = () => {
    if (!isSaving) {
      setVersionName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Lesson Version</DialogTitle>
          <DialogDescription>
            Create a new version of your lesson. This will be saved to{" "}
            {currentBranchName && (
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1"
              >
                <GitBranch className="h-3 w-3" />
                {currentBranchName}
              </Badge>
            )}{" "}
            branch.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="version-name">
              Version Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="version-name"
              placeholder="e.g., Initial draft, Fixed typos, Added images"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              disabled={isSaving}
              onKeyDown={(e) => {
                if (e.key === "Enter" && versionName.trim()) {
                  handleConfirm();
                }
              }}
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              Enter a descriptive name for this version to track changes.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSaving || !versionName.trim()}
            type="submit"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Version
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
