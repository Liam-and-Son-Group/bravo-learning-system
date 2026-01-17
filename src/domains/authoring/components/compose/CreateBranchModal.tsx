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
import { Textarea } from "@/shared/components/ui/textarea";
import { GitBranch, Loader2 } from "lucide-react";

interface CreateBranchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: { name: string; message?: string }) => void;
  isCreating: boolean;
  currentBranchName?: string;
}

export const CreateBranchModal = ({
  open,
  onOpenChange,
  onConfirm,
  isCreating,
  currentBranchName,
}: CreateBranchModalProps) => {
  const [branchName, setBranchName] = useState("");
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    if (!branchName.trim()) {
      return;
    }
    onConfirm({
      name: branchName.trim(),
      message: message.trim() || undefined,
    });
  };

  const handleClose = () => {
    if (!isCreating) {
      setBranchName("");
      setMessage("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Create New Branch
          </DialogTitle>
          <DialogDescription>
            Create a new branch from {currentBranchName || "main"}. The new
            branch will include all current content.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="branch-name">
              Branch Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="branch-name"
              placeholder="e.g., feature/add-quiz, fix/typos, version-2"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              disabled={isCreating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && branchName.trim()) {
                  handleConfirm();
                }
              }}
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              Use a descriptive name like feature/quiz-section or fix/images
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="branch-message">Description (Optional)</Label>
            <Textarea
              id="branch-message"
              placeholder="Describe the purpose of this branch..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isCreating}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              Add context about what you're working on in this branch
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isCreating || !branchName.trim()}
            type="submit"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <GitBranch className="h-4 w-4 mr-2" />
                Create Branch
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
