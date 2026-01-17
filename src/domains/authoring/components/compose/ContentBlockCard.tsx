import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import type { ContentBlock } from "../lexical-editor";
import type { PluginConfig } from "../../types/compose";

interface ContentBlockCardProps {
  block: ContentBlock;
  pluginConfig: PluginConfig | undefined;
  mode: "edit" | "preview";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (id: string, data: any) => void;
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

  const Icon = pluginConfig.icon;

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <h3 className="font-semibold">{pluginConfig.name}</h3>
        </div>
        {mode === "edit" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(block.id)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {mode === "edit"
          ? pluginConfig.plugin.renderEditor({
              data: block.data,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange: (data: any) => onUpdate(block.id, data),
            })
          : pluginConfig.plugin.renderPreview({
              data: block.data,
              blockId: block.id,
            })}
      </CardContent>
    </Card>
  );
};
