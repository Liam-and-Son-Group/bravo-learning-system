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
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCreateClassroomMutation } from "../../queries";
import type { CreateClassroomPayload } from "../../types";
import { SelectField } from "@/shared/components/ui/select";

interface Props {
  organizations: { id: string; name: string }[];
  onCreated?: () => void;
}

function generateKey() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function CreateClassroomDialog({ organizations, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateClassroomPayload>({
    name: "",
    description: "",
    organizationId: organizations[0]?.id || "",
    enrollmentKey: generateKey(),
  });

  const { mutate, isPending } = useCreateClassroomMutation();

  const handleChange = (field: keyof CreateClassroomPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name) return; // basic guard
    mutate(form, {
      onSuccess: () => {
        onCreated?.();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Classroom</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Classroom</DialogTitle>
          <DialogDescription>Create a new classroom.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Classroom name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </div>
          {organizations.length > 1 && (
            <div className="flex flex-col gap-2">
              <SelectField
                id="organization"
                label="Organization"
                value={form.organizationId}
                options={organizations.map((o) => ({
                  label: o.name,
                  value: o.id,
                }))}
                onChange={(v) => handleChange("organizationId", v)}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="enrollmentKey">Enrollment Key</Label>
            <Input
              id="enrollmentKey"
              value={form.enrollmentKey}
              onChange={(e) =>
                handleChange("enrollmentKey", e.target.value.toUpperCase())
              }
              placeholder="Auto-generated key"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!form.name || isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
