import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { ContentBlock } from "../../../components/lexical-editor";
import type { PluginConfig, TabType } from "../types";

interface ComposeMainContentProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  contentBlocks: ContentBlock[];
  pluginConfigs: PluginConfig[];
  onUpdateBlock: (id: string, data: any) => void;
  onRemoveBlock: (id: string) => void;
}

export const ComposeMainContent = ({
  activeTab,
  onTabChange,
  contentBlocks,
  pluginConfigs,
  onUpdateBlock,
  onRemoveBlock,
}: ComposeMainContentProps) => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) => onTabChange(v as TabType)}
        >
          <TabsList>
            <TabsTrigger value="edit">Edit Mode</TabsTrigger>
            <TabsTrigger value="preview">Preview Mode</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6 mt-6">
            {contentBlocks.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No content blocks yet. Select a module from the sidebar to get
                  started!
                </p>
              </Card>
            ) : (
              contentBlocks.map((block, index) => {
                const config = pluginConfigs.find(
                  (c) => c.id === block.pluginId
                );
                if (!config) return null;

                return (
                  <div key={block.id} className="relative">
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemoveBlock(block.id)}
                      >
                        Remove
                      </Button>
                    </div>
                    {config.plugin.renderEditor({
                      data: block.data,
                      onChange: (data) => onUpdateBlock(block.id, data),
                      editable: true,
                    })}
                  </div>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            {contentBlocks.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No content to preview yet.
                </p>
              </Card>
            ) : (
              contentBlocks.map((block) => {
                const config = pluginConfigs.find(
                  (c) => c.id === block.pluginId
                );
                if (!config) return null;

                return (
                  <div key={block.id}>
                    {config.plugin.renderPreview(block.data)}
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
