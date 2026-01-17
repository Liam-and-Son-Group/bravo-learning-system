import { useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  ComposeHeader,
  ComposeMainContent,
  ComposeSidebar,
  SaveConfirmationModal,
  CreateBranchModal,
} from "../components/compose";
import { PLUGIN_CONFIGS } from "../constants/compose";
import { useComposeContent } from "../hooks/useComposeContent";

export default function ComposePage() {
  const navigate = useNavigate();
  const { lessonId } = useParams({ from: "/auth/authoring/compose/$lessonId" });

  // Redirect if no lessonId
  useEffect(() => {
    if (!lessonId) {
      console.error("No lessonId found in params");
      toast.error("Invalid lesson ID");
      navigate({ to: "/authoring" });
    }
  }, [lessonId, navigate]);

  // Use custom hook for all compose logic
  const {
    activeTab,
    contentBlocks,
    isLoading,
    isSaving,
    isSaveModalOpen,
    branches,
    currentBranch,
    isBranchesLoading,
    isCreateBranchModalOpen,
    isCreatingBranch,
    setActiveTab,
    addContentBlock,
    updateContentBlock,
    removeContentBlock,
    openSaveModal,
    handleSaveVersion,
    setIsSaveModalOpen,
    handleBranchSelect,
    openCreateBranchModal,
    handleCreateBranch,
    setIsCreateBranchModalOpen,
  } = useComposeContent({
    lessonId: lessonId || "",
    pluginConfigs: PLUGIN_CONFIGS,
  });

  // Show loading while redirecting or fetching data
  if (!lessonId || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ComposeHeader
        lessonId={lessonId}
        contentBlocksCount={contentBlocks.length}
        isSaving={isSaving}
        activeTab={activeTab}
        onSave={openSaveModal}
        onSetActiveTab={setActiveTab}
        currentBranch={currentBranch}
        branches={branches}
        isBranchesLoading={isBranchesLoading}
        onBranchSelect={handleBranchSelect}
        onCreateBranch={openCreateBranchModal}
      />

      <div className="flex flex-1 overflow-hidden">
        <ComposeSidebar
          pluginConfigs={PLUGIN_CONFIGS}
          onAddBlock={addContentBlock}
        />

        <ComposeMainContent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          contentBlocks={contentBlocks}
          pluginConfigs={PLUGIN_CONFIGS}
          onUpdateBlock={updateContentBlock}
          onRemoveBlock={removeContentBlock}
        />
      </div>

      <SaveConfirmationModal
        open={isSaveModalOpen}
        onOpenChange={setIsSaveModalOpen}
        onConfirm={handleSaveVersion}
        isSaving={isSaving}
        currentBranchName={currentBranch?.name}
      />

      <CreateBranchModal
        open={isCreateBranchModalOpen}
        onOpenChange={setIsCreateBranchModalOpen}
        onConfirm={handleCreateBranch}
        isCreating={isCreatingBranch}
        currentBranchName={currentBranch?.name}
      />
    </div>
  );
}
