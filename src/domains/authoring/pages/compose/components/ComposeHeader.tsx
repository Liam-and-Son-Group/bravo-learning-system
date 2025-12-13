import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Save, Eye } from "lucide-react";

interface ComposeHeaderProps {
  lessonId: string;
  contentBlocksCount: number;
  isSaving: boolean;
  activeTab: "edit" | "preview";
  onSave: () => void;
  onSetActiveTab: (tab: "edit" | "preview") => void;
}

export const ComposeHeader = ({
  lessonId,
  contentBlocksCount,
  isSaving,
  activeTab,
  onSave,
  onSetActiveTab,
}: ComposeHeaderProps) => {
  return (
    <div className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lesson Editor</h1>
          <p className="text-sm text-muted-foreground">Lesson ID: {lessonId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="outline">{contentBlocksCount} modules</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetActiveTab("preview")}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={onSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};
