import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

import type { ContentBlock } from "../lexical-editor";
import type { PluginConfig, PluginData } from "../../types/compose";

interface ContentBlockCardProps {
  block: ContentBlock;
  pluginConfig: PluginConfig | undefined;
  mode: "edit" | "preview";
  onUpdate: (id: string, data: PluginData) => void;
  onRemove: (id: string) => void;
}

export const ContentBlockCard = ({
  block,
  pluginConfig,
  mode,
  onUpdate,
  onRemove,
}: ContentBlockCardProps) => {
  if (!pluginConfig) {
    return null;
  }

  if (mode === "edit") {
    return (
      <div id={block.id} className="scroll-mt-4 mb-4">
        {pluginConfig.plugin.renderEditor({
          data: block.data,
          onChange: (data: PluginData) => onUpdate(block.id, data),
          onRemove: () => onRemove(block.id),
        })}
      </div>
    );
  }

  const Icon = pluginConfig.icon;

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <h3 className="font-semibold">{pluginConfig.name}</h3>
        </div>
      </CardHeader>
      <CardContent>
        {pluginConfig.plugin.renderPreview({
          data: block.data,
          blockId: block.id,
        })}
      </CardContent>
    </Card>
  );
};
