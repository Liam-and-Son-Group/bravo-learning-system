import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { SelectField } from "@/shared/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import type { CreateLessonFormData } from "../../types/lesson-creation";

interface ConfigurationStepProps {
  formData: CreateLessonFormData;
  onChange: (field: keyof CreateLessonFormData, value: string) => void;
  folders: { id: string; name: string }[];
}

export function ConfigurationStep({
  formData,
  onChange,
  folders,
}: ConfigurationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Configure Your Content</h3>
        <p className="text-sm text-muted-foreground">
          Set up the basic details for your new content
        </p>
      </div>

      <div className="space-y-4">
        {/* Lesson Name */}
        <div className="space-y-2">
          <Label htmlFor="lesson-name" className="required">
            Content Name
          </Label>
          <Input
            id="lesson-name"
            placeholder="Enter a descriptive name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Choose a clear, descriptive name for your content
          </p>
        </div>

        {/* Main Branch Name */}
        <div className="space-y-2">
          <Label htmlFor="main-branch">Main Branch Name</Label>
          <Input
            id="main-branch"
            placeholder="main"
            value={formData.mainBranch}
            onChange={(e) => onChange("mainBranch", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The primary version branch (typically "main" or "master")
          </p>
        </div>

        {/* Visibility */}
        <div className="space-y-3">
          <Label>Visibility</Label>
          <RadioGroup
            value={formData.visibility}
            onValueChange={(value) =>
              onChange("visibility", value as "public" | "private")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="font-normal cursor-pointer">
                <div>
                  <p className="font-medium">Private</p>
                  <p className="text-xs text-muted-foreground">
                    Only you and invited collaborators can access
                  </p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="font-normal cursor-pointer">
                <div>
                  <p className="font-medium">Public</p>
                  <p className="text-xs text-muted-foreground">
                    Anyone in your organization can view and use
                  </p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Folder Selection */}
        <div className="space-y-2">
          <SelectField
            id="folder"
            label="Save to Folder"
            placeholder="Select a folder"
            value={formData.folderId}
            options={[
              { label: "Root Folder", value: "root" },
              ...folders.map((f) => ({ label: f.name, value: f.id })),
            ]}
            onChange={(value) => onChange("folderId", value)}
          />
          <p className="text-xs text-muted-foreground">
            Choose where to organize this content
          </p>
        </div>
      </div>
    </div>
  );
}
