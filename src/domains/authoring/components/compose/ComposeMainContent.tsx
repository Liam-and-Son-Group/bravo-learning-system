import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import type { TabType, PluginConfig, PluginData } from "../../types/compose";
import type { ContentBlock } from "../lexical-editor";
import { ContentBlockCard } from "./ContentBlockCard";

interface ComposeMainContentProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  contentBlocks: ContentBlock[];
  pluginConfigs: PluginConfig[];
  onUpdateBlock: (id: string, data: PluginData) => void;
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
            <TabsTrigger value="live">Live Mode</TabsTrigger>
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
                  (c) => c.id === block.pluginId,
                );
                if (!config) return null;

                return (
                  <ContentBlockCard
                    key={block.id}
                    block={block}
                    pluginConfig={config}
                    mode="edit"
                    onUpdate={onUpdateBlock}
                    onRemove={onRemoveBlock}
                  />
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
                  (c) => c.id === block.pluginId,
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

          <TabsContent value="live" className="space-y-8 mt-6">
            {contentBlocks.length === 0 ? (
              <div className="text-center p-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground text-lg">
                  Document is empty. Add modules in Edit Mode to see them here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-8 min-h-[500px]">
                <div className="max-w-3xl mx-auto space-y-12">
                  {contentBlocks.map((block) => {
                    const config = pluginConfigs.find(
                      (c) => c.id === block.pluginId,
                    );
                    if (!config) return null;

                    return (
                      <div
                        key={block.id}
                        className="animate-in fade-in duration-500"
                      >
                        {config.plugin.renderPreview({
                          data: block.data,
                          blockId: block.id,
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
