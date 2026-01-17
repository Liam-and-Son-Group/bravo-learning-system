import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { ContentBlock } from "../components/lexical-editor";
import {
  useGetLessonContent,
  useSaveLessonVersionMutation,
  useGetBranches,
  useCreateBranchMutation,
  useGetBranchContent,
} from "../queries/content";
import type { PluginConfig, TabType, PluginType } from "../types/compose";

interface UseComposeContentParams {
  lessonId: string;
  pluginConfigs: PluginConfig[];
}

export const useComposeContent = ({
  lessonId,
  pluginConfigs,
}: UseComposeContentParams) => {
  const [activeTab, setActiveTab] = useState<TabType>("edit");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCreateBranchModalOpen, setIsCreateBranchModalOpen] = useState(false);
  const [currentBranchId, setCurrentBranchId] = useState<string | null>(null);

  // Fetch branches
  const { data: branchesData, isLoading: isBranchesLoading } =
    useGetBranches(lessonId);

  // Fetch existing lesson content (for backward compatibility)
  const { data: lessonContentData, isLoading } = useGetLessonContent(lessonId);

  // Fetch branch content
  const { data: branchContentData, isLoading: isBranchContentLoading } =
    useGetBranchContent(lessonId, currentBranchId);

  const saveLessonVersionMutation = useSaveLessonVersionMutation(lessonId);
  const createBranchMutation = useCreateBranchMutation(lessonId);

  // Set initial branch (main branch) when branches are loaded
  useEffect(() => {
    if (branchesData?.data && !currentBranchId) {
      const mainBranch = branchesData.data.find((branch: { isMain: boolean }) => branch.isMain);
      if (mainBranch) {
        setCurrentBranchId(mainBranch.id);
      }
    }
  }, [branchesData, currentBranchId]);

  // Load content from branch or fallback to lesson content
  useEffect(() => {
    if (branchContentData?.data?.blocks) {
      setContentBlocks(branchContentData.data.blocks);
    } else if (lessonContentData?.data?.body?.blocks) {
      setContentBlocks(lessonContentData.data.body.blocks);
    }
  }, [branchContentData, lessonContentData]);

  const addContentBlock = (pluginId: PluginType) => {
    const config = pluginConfigs.find((c) => c.id === pluginId);
    if (!config) return;

    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      pluginId,
      data: config.defaultData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setContentBlocks([...contentBlocks, newBlock]);
    toast.success(`${config.name} module added`);
  };

  const updateContentBlock = (id: string, data: Record<string, unknown>) => {
    setContentBlocks(
      contentBlocks.map((block) =>
        block.id === id ? { ...block, data, updatedAt: Date.now() } : block
      )
    );
  };

  const removeContentBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== id));
    toast.success("Module removed");
  };

  const validateContent = (): boolean => {
    // Allow saving if there are no content blocks
    if (contentBlocks.length === 0) {
      return true;
    }

    for (const block of contentBlocks) {
      switch (block.pluginId) {
        case "matching":
          if (block.data.items && block.data.items.length > 0) {
            const hasContent = block.data.items.some(
              (item: { left?: string; right?: string }) => item.left?.trim() || item.right?.trim()
            );
            const hasIncomplete = block.data.items.some(
              (item: { left?: string; right?: string }) =>
                (item.left?.trim() && !item.right?.trim()) ||
                (!item.left?.trim() && item.right?.trim())
            );
            if (hasContent && hasIncomplete) {
              toast.error(
                "Matching: All pairs must have both left and right items"
              );
              return false;
            }
          }
          break;
        case "fill-in-blank":
          if (block.data.items && block.data.items.length > 0) {
            const hasContent = block.data.items.some(
              (item: { text?: string; answer?: string }) => item.text?.includes("_____") || item.answer?.trim()
            );
            const hasIncomplete = block.data.items.some(
              (item: { text?: string; answer?: string }) =>
                item.text?.includes("_____") && !item.answer?.trim()
            );
            if (hasContent && hasIncomplete) {
              toast.error(
                "Fill in Blank: All items with _____ must have an answer"
              );
              return false;
            }
          }
          break;
        case "multiple-choice": {
          const hasQuestion = block.data.question?.trim();
          const hasOptions = block.data.options?.some((opt: { text?: string }) =>
            opt.text?.trim()
          );
          if (hasQuestion || hasOptions) {
            if (hasQuestion && !hasOptions) {
              toast.error("Multiple Choice: At least one option is required");
              return false;
            }
            if (block.data.options.some((opt: { text?: string }) => !opt.text?.trim())) {
              toast.error("Multiple Choice: All options must have text");
              return false;
            }
            if (!block.data.options.some((opt: { isCorrect?: boolean }) => opt.isCorrect)) {
              toast.error(
                "Multiple Choice: At least one correct answer required"
              );
              return false;
            }
          }
          break;
        }
        case "drag-drop":
          if (block.data.items && block.data.items.length > 0) {
            const hasContent = block.data.items.some((item: { text?: string }) =>
              item.text?.trim()
            );
            const hasEmpty = block.data.items.some(
              (item: { text?: string }) => !item.text?.trim()
            );
            if (hasContent && hasEmpty) {
              toast.error("Drag & Drop: All items must have text");
              return false;
            }
          }
          break;
      }
    }
    return true;
  };

  const openSaveModal = () => {
    if (!validateContent()) return;
    if (!currentBranchId) {
      toast.error("No branch selected. Please select a branch first.");
      return;
    }
    setIsSaveModalOpen(true);
  };

  const handleSaveVersion = async (versionName: string) => {
    if (!currentBranchId) {
      toast.error("No branch selected");
      return;
    }

    const payload = {
      branchId: currentBranchId,
      versionName,
      blocks: contentBlocks,
    };

    saveLessonVersionMutation.mutate(payload, {
      onSuccess: (response) => {
        const branchName =
          response?.data?.branchName || currentBranch?.name || "branch";
        toast.success(`Version saved to ${branchName}!`);
        setIsSaveModalOpen(false);
      },
      onError: (error: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        toast.error(
          error?.response?.data?.message || "Failed to save lesson version"
        );
      },
    });
  };

  const handleBranchSelect = (branchId: string) => {
    if (branchId === currentBranchId) return;
    setCurrentBranchId(branchId);
    const selectedBranch = branchesData?.data.find(
      (branch: { id: string; name: string }) => branch.id === branchId
    );
    if (selectedBranch) {
      toast.success(`Switched to branch: ${selectedBranch.name}`);
    }
  };

  const openCreateBranchModal = () => {
    setIsCreateBranchModalOpen(true);
  };

  const handleCreateBranch = (data: { name: string; message?: string }) => {
    // const currentBranch = branchesData?.data.find(
    //   (branch: { id: string }) => branch.id === currentBranchId
    // );

    createBranchMutation.mutate(
      {
        name: data.name,
        message: data.message,
        sourceBranchId: currentBranchId || undefined,
      },
      {
        onSuccess: (response) => {
          toast.success(`Branch "${data.name}" created successfully!`);
          setIsCreateBranchModalOpen(false);
          // Switch to the new branch
          if (response?.data?.id) {
            setCurrentBranchId(response.data.id);
          }
        },
        onError: (error: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          toast.error(
            error?.response?.data?.message || "Failed to create branch"
          );
        },
      }
    );
  };

  const branches = branchesData?.data || [];
  const currentBranch = branches.find(
    (branch: { id: string; name?: string }) => branch.id === currentBranchId
  );

  return {
    // State
    activeTab,
    contentBlocks,
    isLoading: isLoading || isBranchContentLoading,
    isSaving: saveLessonVersionMutation.isPending,
    isSaveModalOpen,

    // Branch state
    branches,
    currentBranch,
    currentBranchId,
    isBranchesLoading,
    isCreateBranchModalOpen,
    isCreatingBranch: createBranchMutation.isPending,

    // Actions
    setActiveTab,
    addContentBlock,
    updateContentBlock,
    removeContentBlock,
    openSaveModal,
    handleSaveVersion,
    setIsSaveModalOpen,

    // Branch actions
    handleBranchSelect,
    openCreateBranchModal,
    handleCreateBranch,
    setIsCreateBranchModalOpen,
  };
};
