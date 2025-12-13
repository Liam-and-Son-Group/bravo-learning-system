import { useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ComposeHeader } from "./components/ComposeHeader";
import { ComposeSidebar } from "./components/ComposeSidebar";
import { ComposeMainContent } from "./components/ComposeMainContent";
import { useComposeContent } from "./hooks/useComposeContent";
import { PLUGIN_CONFIGS } from "./constants";

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
    setActiveTab,
    addContentBlock,
    updateContentBlock,
    removeContentBlock,
    handleSave,
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
        onSave={handleSave}
        onSetActiveTab={setActiveTab}
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
    </div>
  );
}
