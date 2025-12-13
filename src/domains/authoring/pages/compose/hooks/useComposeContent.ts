import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { ContentBlock } from "../../../components/lexical-editor";
import type { PluginType, PluginConfig, TabType } from "../types";
import {
  useGetLessonContent,
  useUpdateLessonContentMutation,
} from "../../../queries/content";

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

  // Fetch existing lesson content
  const { data: lessonContentData, isLoading } = useGetLessonContent(lessonId);
  const updateContentMutation = useUpdateLessonContentMutation(lessonId);

  // Load content on mount
  useEffect(() => {
    if (lessonContentData?.data?.body?.blocks) {
      setContentBlocks(lessonContentData.data.body.blocks);
    }
  }, [lessonContentData]);

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

  const updateContentBlock = (id: string, data: any) => {
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
    for (const block of contentBlocks) {
      switch (block.pluginId) {
        case "matching":
          if (
            block.data.items.some(
              (item: any) => !item.left.trim() || !item.right.trim()
            )
          ) {
            toast.error(
              "Matching: All pairs must have both left and right items"
            );
            return false;
          }
          break;
        case "fill-in-blank":
          if (
            block.data.items.some(
              (item: any) => !item.text.includes("_____") || !item.answer.trim()
            )
          ) {
            toast.error(
              "Fill in Blank: All items must have _____ and an answer"
            );
            return false;
          }
          break;
        case "multiple-choice":
          if (!block.data.question.trim()) {
            toast.error("Multiple Choice: Question is required");
            return false;
          }
          if (block.data.options.some((opt: any) => !opt.text.trim())) {
            toast.error("Multiple Choice: All options must have text");
            return false;
          }
          if (!block.data.options.some((opt: any) => opt.isCorrect)) {
            toast.error(
              "Multiple Choice: At least one correct answer required"
            );
            return false;
          }
          break;
        case "drag-drop":
          if (block.data.items.some((item: any) => !item.text.trim())) {
            toast.error("Drag & Drop: All items must have text");
            return false;
          }
          break;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateContent()) return;

    const payload = {
      blocks: contentBlocks,
      updatedAt: Date.now(),
    };

    updateContentMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Content saved successfully!");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to save content");
      },
    });
  };

  return {
    // State
    activeTab,
    contentBlocks,
    isLoading,
    isSaving: updateContentMutation.isPending,

    // Actions
    setActiveTab,
    addContentBlock,
    updateContentBlock,
    removeContentBlock,
    handleSave,
  };
};
