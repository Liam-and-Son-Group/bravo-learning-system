import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import type { TabType, PluginConfig } from "../../types/compose";
import type { ContentBlock } from "../lexical-editor";

interface ComposeMainContentProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  contentBlocks: ContentBlock[];
  pluginConfigs: PluginConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              contentBlocks.map((block) => {
                const config = pluginConfigs.find(
                  (c) => c.id === block.pluginId
                );
                if (!config) return null;

                return (
                  <div key={block.id}>
                    {config.plugin.renderEditor({
                      data: block.data,
                      onChange: (data) => onUpdateBlock(block.id, data),
                      editable: true,
                      onRemove: () => onRemoveBlock(block.id),
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
              contentBlocks.map((block, index) => {
                const config = pluginConfigs.find(
                  (c) => c.id === block.pluginId
                );
                if (!config) return null;

                const Icon = config.icon;

                return (
                  <Card key={block.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        <div>
                          <h3 className="font-semibold">{config.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            Question #{index + 1}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemoveBlock(block.id)}
                      >
                        Remove
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {config.plugin.renderPreview({
                        data: block.data,
                        blockId: block.id,
                      })}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
