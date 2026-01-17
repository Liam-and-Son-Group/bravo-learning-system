import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Save, Eye } from "lucide-react";
import { BranchSelector } from "./BranchSelector";
import { BranchGraphModal } from "./BranchGraphModal";

interface Branch {
  id: string;
  name: string;
  message?: string;
  isMain: boolean;
  status: string;
  createdAt: string;
  latestVersion?: {
    id: string;
    createdAt: string;
  } | null;
  versions?: Array<{
    id: string;
    createdAt: string;
    versionName?: string;
  }>;
}

interface ComposeHeaderProps {
  lessonId: string;
  contentBlocksCount: number;
  isSaving: boolean;
  activeTab: "edit" | "preview";
  onSave: () => void;
  onSetActiveTab: (tab: "edit" | "preview") => void;
  // Branch props
  currentBranch: Branch | null;
  branches: Branch[];
  isBranchesLoading: boolean;
  onBranchSelect: (branchId: string) => void;
  onCreateBranch: () => void;
}

export const ComposeHeader = ({
  lessonId,
  contentBlocksCount,
  isSaving,
  onSave,
  onSetActiveTab,
  currentBranch,
  branches,
  isBranchesLoading,
  onBranchSelect,
  onCreateBranch,
}: ComposeHeaderProps) => {
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);

  return (
    <div className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lesson Editor</h1>
          <p className="text-sm text-muted-foreground">Lesson ID: {lessonId}</p>
        </div>
        <div className="flex items-center gap-2">
          <BranchSelector
            currentBranch={currentBranch}
            branches={branches}
            isLoading={isBranchesLoading}
            onBranchSelect={onBranchSelect}
            onCreateBranch={onCreateBranch}
            onVisualizeGraph={() => setIsGraphModalOpen(true)}
          />
          <Badge variant="secondary">{currentBranch?.status || "Draft"}</Badge>
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

      <BranchGraphModal
        open={isGraphModalOpen}
        onOpenChange={setIsGraphModalOpen}
        branches={branches}
        currentBranchId={currentBranch?.id}
        lessonId={lessonId}
      />
    </div>
  );
};
