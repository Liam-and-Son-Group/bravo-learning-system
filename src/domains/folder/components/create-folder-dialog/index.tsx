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
import { useCreateFolder } from "../../queries";
import type { CreateFolderDto } from "../../apis";
import { Folder, Loader2 } from "lucide-react";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string | null;
}

export function CreateFolderDialog({
  open,
  onOpenChange,
  parentId = null,
}: CreateFolderDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");

  const { mutate: createFolder, isPending } = useCreateFolder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const dto: CreateFolderDto = {
      name: name.trim(),
      color,
      parentId: parentId || undefined,
    };

    createFolder(dto, {
      onSuccess: () => {
        setName("");
        setColor("#3B82F6");
        onOpenChange(false);
      },
    });
  };

  const handleCancel = () => {
    setName("");
    setColor("#3B82F6");
    onOpenChange(false);
  };

  const colorOptions = [
    { label: "Blue", value: "#3B82F6" },
    { label: "Green", value: "#10B981" },
    { label: "Purple", value: "#8B5CF6" },
    { label: "Red", value: "#EF4444" },
    { label: "Orange", value: "#F59E0B" },
    { label: "Pink", value: "#EC4899" },
    { label: "Indigo", value: "#6366F1" },
    { label: "Teal", value: "#14B8A6" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your lessons.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Folder Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                placeholder="e.g., Mathematics, Science, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                autoFocus
              />
            </div>

            {/* Folder Color */}
            <div className="space-y-2">
              <Label>Folder Color</Label>
              <div className="grid grid-cols-8 gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColor(option.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === option.value
                        ? "border-gray-900 ring-2 ring-offset-2 ring-gray-400"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: option.value }}
                    title={option.label}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                <Folder className="w-5 h-5" style={{ color }} fill={color} />
                <span className="text-sm font-medium">
                  {name || "Folder Name"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
